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
    Asset,
    ForgeScript,
} from "@meshsdk/core";
import cbor from "cbor";
import { plutusV3 } from "../../libs/plutusV3";

const burn = async function () {
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

    const storeUtxos = await provider.fetchAddressUTxOs(storeAddress);
    const redeemer = {
        data: { alternative: 1, fields: [] },
    };

    const txHashR = "d543920e462c312e5a31767eef893e02c0d1aec03d658f90d4a0bc1017d51f35";
    async function fetchUtxo(addr, txHash) {
        const utxos = await provider.fetchAddressUTxOs(addr);
        return utxos.find((utxo) => {
            return utxo.input.txHash == txHash;
        });
    }
    const userUtxo = await fetchUtxo(userAddress, txHashR);
    const storeUtxo = await fetchUtxo(storeAddress, txHashR);

    console.log(userUtxo?.output.amount);
    console.log(storeUtxo?.output.amount);

    const contributeAsset: Asset = {
        unit: "65ad4cd95f5357eaaa655f7edccf57067822e2ea33edaeef451cb457000de1404142434445",
        quantity: "2",
    };

    const referenceAsset: Asset = {
        unit: "65ad4cd95f5357eaaa655f7edccf57067822e2ea33edaeef451cb457000643b04142434445",
        quantity: "2",
    };

    // const referenceAsset: Mint = {
    //     assetName: "ABCDE",
    //     assetQuantity: "-1",
    //     // metadata: {
    //     //     name: "ABCDE",
    //     //     image: "ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua",
    //     //     mediaType: "image/jpg",
    //     //     description: "Blockchain Developer",
    //     // },
    //     metadata: [],
    //     recipient: userAddress,
    //     cip68ScriptAddress: storeAddress,
    // };
    const tx = new Transaction({ initiator: wallet });
    // tx.redeemValue({
    //     value: storeUtxo!,
    //     script: storeScript,
    //     // datum: storeUtxos[storeUtxos.length - 1],
    //     redeemer: redeemer,
    // });
    // tx.sendAssets(userAddress, [
    //     // { unit: "lovelace", quantity: "2000000" },
    //     {
    //         unit: "c17544c28dd4d85dd994b68478c0e290c65c5bf9e79213f25dd13d65000de1404e475559454e20445559204b48414e48202d203137313132303033",
    //         quantity: "1",
    //     },
    // ]);
    tx.setTxInputs([storeUtxo!, userUtxo!]);
    tx.burnAsset(mintScript, contributeAsset, redeemer);
    tx.burnAsset(mintScript, referenceAsset, redeemer);

    const unsignedTx = await tx.build();
    const signedTx = wallet.signTx(unsignedTx, true);
    const txHash = await wallet.submitTx(signedTx);
    console.log(txHash);
};

burn()
    .then(() => {
        process.exit(1);
    })
    .catch((error) => console.log(error))
    .finally(() => {
        process.exit(0);
    });
