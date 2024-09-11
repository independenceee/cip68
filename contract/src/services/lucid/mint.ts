import { Blockfrost, Constr, Data, fromText, Lucid, toUnit, TxComplete } from "lucid-cardano";
import { readMintValidatorV2 } from "../../utils/validators";
import redeemers from "../../constants/redeemers";

const lucid = await Lucid.new(
    new Blockfrost(
        "https://cardano-preprod.blockfrost.io/api/v0",
        "preprodHXZNMTECARQ3jlUE0RvCBT2qOK6JRtQf",
    ),
    "Preprod",
);
lucid.selectWalletFromPrivateKey(
    "ed25519_sk1xrfh0axn82mehh526fc6vx6xq8vnvlj0thla9n480d8wfvne6juqv80g4m",
);

const mintValidator = readMintValidatorV2();
const policyId = lucid.utils.mintingPolicyToId(mintValidator);
const nft = toUnit(policyId, fromText("NGUYEN DUY KHANH"), 222);
const utxos = await lucid.wallet.getUtxos();
const mintRedeemer = Data.to(new Constr(0, []));

const tx: TxComplete = await lucid
    .newTx()
    .collectFrom(utxos)
    .mintAssets({ [nft]: BigInt(1) }, Data.void())
    .attachMintingPolicy(mintValidator)
    .complete();

const signedTx = await tx.sign().complete();

const txHash = await signedTx.submit();

await lucid.awaitTx(txHash);

console.log(`policyId: ${policyId},
txHash: ${txHash}`);
