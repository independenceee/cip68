use aiken/hash.{Blake2b_224, Hash}
use aiken/transaction.{ScriptContext, Spend}
use aiken/transaction/credential.{VerificationKey}
use aiken/transaction/value
use assist/signing
use contract/types.{MetaDatum, UpdateAction}
use contract/utils

validator(owner: Hash<Blake2b_224, VerificationKey>) {
  fn update(datum: MetaDatum, redeemer: StoreAction, ctx: ScriptContext) -> Bool {
    let tx = ctx.transaction

    expect Spend(output_reference) = ctx.purpose
    expect Some(input) = transaction.find_input(tx.inputs, output_reference)
    let ref_nft =
      input.output.value
        |> value.without_lovelace()

    when redeemer is {
      types.Update -> {
        let script_addr = input.output.address
        let validating_output =
          utils.output_by_addr_value(tx.outputs, script_addr, ref_nft)

        and {
          signing.verify_sig(tx.extra_signatories, owner)?,
          utils.check_output_utxo(validating_output)?,
        }
      }
      types.Remove -> {
        let validating_output = utils.output_by_value(tx.outputs, ref_nft)

        and {
          signing.verify_sig(tx.extra_signatories, owner)?,
          utils.check_output_utxo(validating_output)?,
        }
      }
    }
  }
}
