import {
    BlockfrostProvider,
    MeshWallet,
    Mint,
    PlutusScript,
    Transaction,
    mTxOutRef,
    metadataToCip68,
    serializePlutusScript
} from '@meshsdk/core'
import cbor from 'cbor'
import redeemers from '../constants/redeemers'
import { plutusV3 } from '../libs/plutus-v3'
import { applyParamsToScript } from 'lucid-cardano'
type Props = {}

const mint = async function () {
    const blockfrostProvider = new BlockfrostProvider('preprodHXZNMTECARQ3jlUE0RvCBT2qOK6JRtQf')
    const wallet = new MeshWallet({
        networkId: 0,
        fetcher: blockfrostProvider,
        submitter: blockfrostProvider,
        key: {
            type: 'root',
            bech32: 'xprv16zlhjxs29l9zk0aaf54ttn32nsrl9l855yqpsurnwjxfu2kd93dc4xx0pvxf0ffhzl9vc9vpcqsmmhhfu3c8nfusdj0yh8mg2kzgr797vxrtut4czgwjj4pdzfnstcwy6n0jfjw6tyeuqxdynl8msnu3cv8j5msy'
        }
    })
    const utxos = await wallet.getUtxos()
    const scriptCode = applyParamsToScript(oneTimeMintingPolicy, [
        mTxOutRef(utxos[0]?.input.txHash!, utxos[0]?.input.outputIndex!)
    ])

    const userAddress = wallet.getChangeAddress()
    const mintScript: PlutusScript = {
        code: cbor.encode(Buffer.from(plutusV3.validators[0].compiledCode, 'hex')).toString('hex'),
        version: 'V3'
    }
    const storeScript: PlutusScript = {
        code: cbor.encode(Buffer.from(plutusV3.validators[2].compiledCode, 'hex')).toString('hex'),
        version: 'V3'
    }

    const { address: storeAddress } = serializePlutusScript(storeScript, undefined, 0, false)
    const redeemer = {
        data: { alternative: 0, fields: [] },
        tag: 'MINT'
    }

    const referenceAsset: Mint = {
        assetName: 'KH17112003',
        assetQuantity: '1',
        metadata: {
            name: 'KH17112003',
            image: 'ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua',
            mediaType: 'image/jpg',
            description: 'KH17112003'
        },
        recipient: userAddress,
        cip68ScriptAddress: storeAddress
    }

    const tx = new Transaction({ initiator: wallet })

    tx.mintAsset(mintScript, referenceAsset, redeemer)

    const unsignedTx = await tx.build()
    const signedTx = wallet.signTx(unsignedTx, true)
    const txHash = await wallet.submitTx(signedTx)
    blockfrostProvider.onTxConfirmed(txHash, () => {
        console.log(txHash)
    })
}

mint()
