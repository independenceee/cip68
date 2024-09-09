use aiken/crypto.{ScriptHash, VerificationKeyHash}
use aiken/primitive/bytearray
use cardano/address
use cardano/assets.{PolicyId, flatten}
use cardano/minting.{exact}
use cardano/transaction.{Transaction}
use cardano/tx
use cardano/value
use contract/types.{Burn, Mint, MintRedeemer}
use contract/utils.{check_output_utxo}
use types/cip68.{prefix_100, prefix_222}
use validation/find.{output_by_addr_value}
use validation/payout.{at_least}

validator mint(issuer: VerificationKeyHash, store: ScriptHash) {
  mint(redeemer: MintRedeemer, policy_id: PolicyId, transaction: Transaction) {
    let Transaction { inputs, mint, outputs, extra_signatories, .. } =
      transaction

    let mint_flatten =
      mint
        |> flatten()

    when redeemer is {
      Mint -> {
        let first_input_txid = find.first_input_txid(inputs)
        let first_input_index = find.first_input_index(inputs)
        let reference_token_name =
          value.unique_token_name(
            first_input_txid,
            first_input_index,
            prefix_100,
          )
        let reference_value =
          assets.from_asset(policy_id, reference_token_name, 1)
        let user_token_name =
          value.unique_token_name(
            first_input_txid,
            first_input_index,
            prefix_222,
          )
        let store_address = address.from_script(store)
        let output_utxo =
          output_by_addr_value(outputs, store_address, reference_value)

        and {
          tx.verify_signature(extra_signatories, issuer)?,
          first_input_index < 256,
          exact(mint_flatten, policy_id, reference_token_name, 1)?,
          exact(mint_flatten, policy_id, user_token_name, 1)?,
          at_least(store_address, reference_value, outputs)?,
          check_output_utxo(output_utxo)?,
        }
      }

      Burn -> and {
          tx.verify_signature(extra_signatories, issuer)?,
          minting.by_prefix(mint_flatten, policy_id, prefix_100, -1)?,
          minting.by_prefix(mint_flatten, policy_id, prefix_222, -1)?,
          when mint_flatten is {
            [(_pid1, tkn1, _amt1), (_pid2, tkn2, _amt2)] ->
              bytearray.compare(
                bytearray.drop(tkn1, 4),
                bytearray.drop(tkn2, 4),
              ) == Equal
            _ -> False
          },
        }
    }
  }

  else(_) {
    fail
  }
}
