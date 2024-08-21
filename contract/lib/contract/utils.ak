use aiken/cbor
use aiken/list
use aiken/transaction.{InlineDatum, Output}
use aiken/transaction/credential.{Address}
use aiken/transaction/value.{Value}
use assist/values
use contract/types.{MetaDatum}

pub fn check_output_utxo(output: Output) -> Bool {
  trace cbor.diagnostic(output.datum)
  expect InlineDatum(data) = output.datum
  expect _metadatum: MetaDatum = data

  let output_value =
    output.value
      |> value.without_lovelace()
      |> value.flatten()
  list.length(output_value) == 1
}

pub fn output_by_addr_value(
  outputs: List<Output>,
  addr: Address,
  value: Value,
) -> Output {
  when outputs is {
    [output, ..rest] ->
      if output.address == addr && values.contains(value, output.value) {
        output
      } else {
        output_by_addr_value(rest, addr, value)
      }
    [] -> fail @"No Output found"
  }
}

pub fn output_by_value(outputs: List<Output>, value: Value) -> Output {
  when outputs is {
    [output, ..rest] ->
      if values.contains(value, output.value) {
        output
      } else {
        output_by_value(rest, value)
      }
    [] -> fail @"No Output found"
  }
}
