import {
    resolvePaymentKeyHash,
    resolvePlutusScriptAddress,
    BlockfrostProvider,
    MeshWallet,
    Transaction,
    PlutusScript,
    MeshTxBuilder,
    resolveScriptHash,
    CIP68_222,
    stringToHex,
    UTxO,
    mConStr0,
    mConStr1,
    metadataToCip68,
    serializePlutusScript,
    CIP68_100
} from '@meshsdk/core'
import { applyParamsToScript } from '@meshsdk/core-csl'
import cbor from 'cbor'
import { plutusV3 } from '../libs/plutus-v3.js'

const mint = async function () {
    const provider = new BlockfrostProvider('preprodHXZNMTECARQ3jlUE0RvCBT2qOK6JRtQf')

    const wallet = new MeshWallet({
        networkId: 0,
        fetcher: provider,
        submitter: provider,
        key: {
            type: 'root',
            bech32: 'xprv16zlhjxs29l9zk0aaf54ttn32nsrl9l855yqpsurnwjxfu2kd93dc4xx0pvxf0ffhzl9vc9vpcqsmmhhfu3c8nfusdj0yh8mg2kzgr797vxrtut4czgwjj4pdzfnstcwy6n0jfjw6tyeuqxdynl8msnu3cv8j5msy'
        }
    })
    console.log(await wallet.getLovelace())

    const storeScript: PlutusScript = {
        code: cbor.encode(Buffer.from(plutusV3.validators[2].compiledCode, 'hex')).toString('hex'),
        version: 'V3'
    }
    const storeScriptHash = resolveScriptHash(
        cbor.encode(Buffer.from(plutusV3.validators[2].compiledCode, 'hex')).toString('hex'),
        'V3'
    )
    const policyId = resolveScriptHash(
        cbor.encode(Buffer.from(plutusV3.validators[0].compiledCode, 'hex')).toString('hex'),
        'V3'
    )

    const utxos = await wallet.getUtxos()
    const collateral = (await wallet.getCollateral())[0]!
    const changeAddress = wallet.getChangeAddress()
    console.log(changeAddress)

    const tokenName = 'ERC721'
    const tokenNameHex = stringToHex(tokenName)
    const txBuilder = new MeshTxBuilder({
        fetcher: provider,
        evaluator: provider,
        submitter: provider
    })
    const { address: storeAddress } = serializePlutusScript(storeScript, undefined, 0, false)
    console.log(storeAddress)
    const storeUtxos = await provider
    const mintScript = applyParamsToScript(plutusV3.validators[0].compiledCode, [])
    console.log(utxos[3])
    console.log(collateral)
    const unsignedTx = await txBuilder
        .txIn(
            utxos[0]?.input.txHash!,
            utxos[0]?.input.outputIndex!,
            utxos[0]?.output.amount!,
            utxos[0]?.output.address!
        )
        .mintPlutusScriptV3()
        .mint('1', policyId, CIP68_100(tokenNameHex))
        .mintingScript(mintScript)
        .mintRedeemerValue(mConStr0([]))
        .mintPlutusScriptV3()
        .mint('1', policyId, CIP68_222(tokenNameHex))
        .mintingScript(mintScript)
        .mintRedeemerValue(mConStr0([]))
        .txOut(storeAddress, [{ unit: policyId + CIP68_100(tokenNameHex), quantity: '1' }])
        .txOutInlineDatumValue(
            metadataToCip68({
                name: 'ERC721',
                image: 'ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua',
                mediaType: 'image/jpg',
                description: 'Blockchain Developer'
            })
        )
        .changeAddress(changeAddress)
        .selectUtxosFrom(utxos)
        .txInCollateral(
            collateral.input.txHash,
            collateral.input.outputIndex,
            collateral.output.amount,
            collateral.output.address
        )
        .complete()

    const signedTx = wallet.signTx(unsignedTx, true)
    const txHash = await wallet.submitTx(signedTx)
    console.log(txHash)
}

mint()
    .then(function () {
        process.exit(0)
    })
    .catch(function (error) {
        console.log(error)
    })
    .finally(function () {
        process.exit(1)
    })
