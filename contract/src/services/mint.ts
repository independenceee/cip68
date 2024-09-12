import {
    BlockfrostProvider,
    MeshWallet,
    Mint,
    PlutusScript,
    Transaction,
    Recipient,
    serializePlutusScript,
    metadataToCip68,
    CIP68_100,
    CIP68_222,
} from "@meshsdk/core";
import cbor from "cbor";
import { plutusV3 } from "../libs/plutusV3";

const mint = async function () {
    const provider = new BlockfrostProvider("preprodHXZNMTECARQ3jlUE0RvCBT2qOK6JRtQf");

    const wallet = new MeshWallet({
        networkId: 0,
        fetcher: provider,
        submitter: provider,
        key: {
            type: "root",
            bech32: "xprv16zlhjxs29l9zk0aaf54ttn32nsrl9l855yqpsurnwjxfu2kd93dc4xx0pvxf0ffhzl9vc9vpcqsmmhhfu3c8nfusdj0yh8mg2kzgr797vxrtut4czgwjj4pdzfnstcwy6n0jfjw6tyeuqxdynl8msnu3cv8j5msy",
        },
    });

    const userAddress = wallet.getChangeAddress();
    console.log(userAddress);
    const mintScript: PlutusScript = {
        code: cbor.encode(Buffer.from(plutusV3.validators[0].compiledCode, "hex")).toString("hex"),
        version: "V3",
    };
    const storeScript: PlutusScript = {
        code: cbor.encode(Buffer.from(plutusV3.validators[2].compiledCode, "hex")).toString("hex"),
        version: "V3",
    };
    const { address: storeAddress } = serializePlutusScript(storeScript, undefined, 0, false);
    console.log(storeAddress);

    // process.exit(0);
    const referenceTolenRecipient: Recipient = {
        address: storeAddress,
        datum: {
            value: metadataToCip68({
                name: "MINT NFT CIP68",
                image: "ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua",
                mediaType: "image/jpg",
                description: "Blockchain Developer",
            }),
            inline: true,
        },
    };

    const redeemer = {
        data: { alternative: 0, fields: [] },
    };

    const referenceAsset: Mint = {
        assetName: "NGUYEN DUY KHANH - 17112003",
        assetQuantity: "1",
        metadata: {
            name: "NGUYEN DUY KHANH - 17112003",
            image: "ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua",
            mediaType: "image/jpg",
            description: "Blockchain Developer",
        },
        recipient: userAddress,
        cip68ScriptAddress: storeAddress,
    };

    const tx = new Transaction({ initiator: wallet });

    // tx.mintAsset(mintScript, contributeAssset, redeemer);
    tx.mintAsset(mintScript, referenceAsset, redeemer);

    const unsignedTx = await tx.build();
    const signedTx = wallet.signTx(unsignedTx, true);
    const txHash = await wallet.submitTx(signedTx);
    provider.onTxConfirmed(txHash, () => {
        console.log(txHash);
    });
    console.log(txHash);
};

mint()
    .then(() => {
        process.exit(1);
    })
    .catch((error) => console.log(error))
    .finally(() => {
        process.exit(0);
    });
