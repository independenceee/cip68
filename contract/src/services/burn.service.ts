import { Lucid, Data, Constr, toUnit } from "lucid-cardano";
import lucidProvider from "../providers/lucid.provider";
import { burnRedeemer} from "../constants/redeemer"


const burn = async function () {
    const lucid: Lucid = await lucidProvider();


    const nft = toUnit();
    const token = toUnit();

    const nftUtxo = 
    const tokenUtxo =

    const tx = await lucid
        .newTx()
        .collectFrom([tokenUtxo, nftUtxo])
        .mintAssets({ [nft]: BigInt(-1), [token]: BigInt(-1) }, burnRedeemer)
        .attachMintingPolicy()
        .addSigner(await lucid.wallet.address())
        .complete({ change: { address: await lucid.wallet.address() } })

    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();
    await lucid.awaitTx(txHash);
    console.log("TxHash: " + txHash);
}

export default burn;