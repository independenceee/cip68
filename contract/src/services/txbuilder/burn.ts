import {
    BlockfrostProvider,
    CIP68_100,
    CIP68_222,
    mConStr0,
    mConStr1,
    MeshTxBuilder,
    MeshWallet,
    serializePlutusScript,
    PlutusScript,
    resolveScriptHash,
    stringToHex,
} from "@meshsdk/core";
import { applyParamsToScript } from "@meshsdk/core-csl";
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
    const { address: storeAddress } = serializePlutusScript(storeScript, undefined, 0, false);
    const storeUtxos = await provider.fetchAddressUTxOs(storeAddress);
    console.log(storeUtxos[storeUtxos.length - 1]);

    const utxos = await wallet.getUtxos();
    const collateral = (await wallet.getCollateral())[0]!;
    const changeAddress = wallet.getChangeAddress();

    const txBuilder = new MeshTxBuilder({
        fetcher: provider,
        evaluator: provider,
        submitter: provider,
    });

    const mintScript = applyParamsToScript(plutusV3.validators[0].compiledCode, []);
    const tokenName = "ABCDE";
    const tokenNameHex = stringToHex(tokenName);

    async function fetchUtxo(addr, txHash) {
        const utxos = await provider.fetchAddressUTxOs(addr);
        return utxos.find((utxo) => {
            return utxo.input.txHash == txHash;
        });
    }

    const txHashR = "d543920e462c312e5a31767eef893e02c0d1aec03d658f90d4a0bc1017d51f35";

    const userUtxo = await fetchUtxo(changeAddress, txHashR);
    const storeUtxo = await fetchUtxo(storeAddress, txHashR);

    console.log(userUtxo);
    console.log(storeUtxo);

    const unsignedTx = await txBuilder
        .txIn(
            userUtxo?.input.txHash!,
            userUtxo?.input.outputIndex!,
            userUtxo?.output.amount!,
            userUtxo?.output.address!,
        )
        .txIn(
            storeUtxo?.input.txHash!,
            storeUtxo?.input.outputIndex!,
            storeUtxo?.output.amount!,
            storeUtxo?.output.address!,
        )
        .mintPlutusScriptV3()
        .mint("-1", policyId, CIP68_100(tokenNameHex))
        .mintingScript(mintScript)
        .mintRedeemerValue(mConStr1([]))
        .mintPlutusScriptV3()
        .mint("-1", policyId, CIP68_222(tokenName))
        .mintingScript(mintScript)

        .mintRedeemerValue(mConStr1([]))
        .changeAddress(changeAddress)
        .selectUtxosFrom(utxos)
        .txInCollateral(
            collateral.input.txHash,
            collateral.input.outputIndex,
            collateral.output.amount,
            collateral.output.address,
        )
        .complete();
    const signedTx = wallet.signTx(unsignedTx, true);
    const txHash = await wallet.submitTx(signedTx);
    console.log(txHash);
};

burn()
    .then(function () {
        process.exit(0);
    })
    .catch(function (error) {
        console.log(error);
    })
    .finally(function () {
        process.exit(1);
    });
