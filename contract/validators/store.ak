use cardano/assets.{without_lovelace}
use cardano/transaction.{OutputReference, Transaction, find_input}
use contract/types.{Remove, StoreRedeemer, Update}
use contract/utils.{check_output_utxo}
use types/cip68.{CIP68}
use validation/find.{output_by_addr_value, output_by_value}

validator store {
  spend(
    _datum: Option<CIP68>,
    redeemer: StoreRedeemer,
    output_reference: OutputReference,
    transaction: Transaction,
  ) {
    let Transaction { inputs, outputs, .. } = transaction
    expect Some(input) = find_input(inputs, output_reference)
    let reference_nft = input.output.value |> without_lovelace()

    when redeemer is {
      Update -> {
        let script_address = input.output.address
        let validation_output =
          output_by_addr_value(outputs, script_address, reference_nft)

        check_output_utxo(validation_output)
      }
      Remove -> True
    }
    // {
    //   let validation_output = output_by_value(outputs, reference_nft)
    //   check_output_utxo(validation_output)
    // }
  }

  else(_) {
    fail
  }
}
