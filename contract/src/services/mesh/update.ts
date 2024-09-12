import {
    BlockfrostProvider,
    mConStr0,
    MeshTxBuilder,
    MeshWallet,
    metadataToCip68,
    PlutusScript,
    resolveScriptHash,
    serializePlutusScript,
    stringToHex,
} from "@meshsdk/core";
import cbor from "cbor";
import { plutusV3 } from "../../libs/plutusV3";
import { applyParamsToScript } from "@meshsdk/core-csl";
const update = async function () {
    const blockfrostProvider = new BlockfrostProvider("preprodHXZNMTECARQ3jlUE0RvCBT2qOK6JRtQf");
    const wallet = new MeshWallet({
        networkId: 0,
        fetcher: blockfrostProvider,
        submitter: blockfrostProvider,
        key: {
            type: "root",
            bech32: "xprv16zlhjxs29l9zk0aaf54ttn32nsrl9l855yqpsurnwjxfu2kd93dc4xx0pvxf0ffhzl9vc9vpcqsmmhhfu3c8nfusdj0yh8mg2kzgr797vxrtut4czgwjj4pdzfnstcwy6n0jfjw6tyeuqxdynl8msnu3cv8j5msy",
        },
    });
    const storeScript: PlutusScript = {
        code: cbor.encode(Buffer.from(plutusV3.validators[2].compiledCode, "hex")).toString("hex"),
        version: "V3",
    };
    const storeScriptHash = resolveScriptHash(
        cbor.encode(Buffer.from(plutusV3.validators[2].compiledCode, "hex")).toString("hex"),
        "V3",
    );
    const policyId = resolveScriptHash(
        cbor.encode(Buffer.from(plutusV3.validators[0].compiledCode, "hex")).toString("hex"),
        "V3",
    );
    const store = applyParamsToScript(plutusV3.validators[2].compiledCode, []);

    const utxos = await wallet.getUtxos();
    const collateral = (await wallet.getCollateral())[0]!;
    const changeAddress = wallet.getChangeAddress();
    console.log(changeAddress);

    const tokenName = "Nguyen Duy Khanh";
    const tokenNameHex = stringToHex(tokenName);
    const { address: storeAddress } = serializePlutusScript(storeScript, undefined, 0, false);
    console.log(storeAddress);

    const storeUtxos = await blockfrostProvider.fetchAddressUTxOs(storeAddress);
    console.log(storeUtxos);
    async function fetchUtxo(assetName) {
        return storeUtxos.forEach((utxo) => {
            console.log(utxo.output.amount);
        });
    }
    //

    //
    const utxo = await fetchUtxo("Nguyen Duy Khanh");
    const mintScript = applyParamsToScript(plutusV3.validators[0].compiledCode, []);
    console.log(collateral);

    const txBuilder = new MeshTxBuilder({
        fetcher: blockfrostProvider,
        evaluator: blockfrostProvider,
        submitter: blockfrostProvider,
    });

    const unsignedTx = await txBuilder
        .spendingPlutusScriptV3()
        .txIn(
            storeUtxos[0].input.txHash,
            storeUtxos[0].input.outputIndex,
            storeUtxos[0].output.amount,
            storeUtxos[0].output.address,
        )
        .txOut(storeAddress, [
            {
                unit: "c17544c28dd4d85dd994b68478c0e290c65c5bf9e79213f25dd13d65000643b04d494e54204153534554",
                quantity: "1",
            },
        ])
        .txOutDatumHashValue(
            metadataToCip68({
                name: "Nguyen Duy Khanh",
                image: "ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua",
                mediaType: "image/jpg",
                description: "Blockchain Developer",
            }),
        )
        .txInDatumValue(
            metadataToCip68({
                name: "Nguyen Duy Khanh",
                image: "ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua",
                mediaType: "image/jpg",
                description: "Blockchain Developer",
            }),
        )
        .txInRedeemerValue(mConStr0([]))
        .txInScript(store)
        .changeAddress(storeAddress)
        .txInCollateral(
            collateral[0]?.input.txHash!,
            collateral[0]?.input.outputIndex!,
            collateral[0]?.output.amount!,
            collateral[0]?.output.address!,
        )
        .selectUtxosFrom(storeUtxos)
        .complete();

    const signedTx = wallet.signTx(unsignedTx, true);
    const txHash = await wallet.submitTx(signedTx);
    console.log(txHash);
};

update()
    .then(function () {
        process.exit(0);
    })
    .catch(function (error) {
        console.log(error);
    })
    .finally(function () {
        process.exit(1);
    });
