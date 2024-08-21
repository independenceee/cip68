use aiken/dict.{Dict}

pub type MintAction {
  Mint
  Burn
}

pub type StoreAction {
  Update
  Remove
}

pub type MetaDatum {
  metadata: Dict<ByteArray, Data>,
  version: Int,
  extra: ByteArray,
}
