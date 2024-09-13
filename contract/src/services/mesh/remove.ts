import {
    BlockfrostProvider,
    MeshWallet,
    Mint,
    PlutusScript,
    Transaction,
    Recipient,
    serializePlutusScript,
    metadataToCip68,
    Data,
    Action,
} from "@meshsdk/core";
import cbor from "cbor";
import { plutusV3 } from "../../libs/plutusV3";

const remove = async function () {
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
    const storeUtxos = await provider.fetchAddressUTxOs(storeAddress);
    console.log(storeUtxos[storeUtxos.length - 1]);

    // process.exit(0);

    const referenceTokenRecipient: Recipient = {
        address: storeAddress,
        datum: {
            value: metadataToCip68({
                name: "NGUYEN DUY KHANH",
                image: "ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua",
                mediaType: "image/jpg",
            }),
            inline: true,
        },
    };

    const redeemer = {
        data: { alternative: 0, fields: [] },
    };

    const tx = new Transaction({ initiator: wallet });
    tx.redeemValue({
        value: storeUtxos[storeUtxos.length - 1],
        script: storeScript,
        // datum: storeUtxos[storeUtxos.length - 1],
        redeemer: redeemer,
    });
    tx.sendAssets(userAddress, [
        // { unit: "lovelace", quantity: "2000000" },
        {
            unit: "c17544c28dd4d85dd994b68478c0e290c65c5bf9e79213f25dd13d65000de1404e475559454e20445559204b48414e48202d203137313132303033",
            quantity: "1",
        },
    ]);
    tx.sendAssets(referenceTokenRecipient, [
        // { unit: "lovelace", quantity: "2000000" },
        {
            unit: "c17544c28dd4d85dd994b68478c0e290c65c5bf9e79213f25dd13d65000643b04e475559454e20445559204b48414e48202d203137313132303033",
            quantity: "1",
        },
    ]);
    const unsignedTx = await tx.build();
    const signedTx = wallet.signTx(unsignedTx, true);
    const txHash = await wallet.submitTx(signedTx);
    console.log(txHash);
};

remove()
    .then(() => {
        process.exit(1);
    })
    .catch((error) => console.log(error))
    .finally(() => {
        process.exit(0);
    });
