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
    Action
} from '@meshsdk/core'
import cbor from 'cbor'
import { plutusV3 } from '../libs/plutus-v3'

const update = async function () {
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

    const userAddress = wallet.getChangeAddress()
    console.log(userAddress)
    const mintScript: PlutusScript = {
        code: cbor.encode(Buffer.from(plutusV3.validators[0].compiledCode, 'hex')).toString('hex'),
        version: 'V3'
    }
    const storeScript: PlutusScript = {
        code: cbor.encode(Buffer.from(plutusV3.validators[2].compiledCode, 'hex')).toString('hex'),
        version: 'V3'
    }
    const { address: storeAddress } = serializePlutusScript(storeScript, undefined, 0, false)
    console.log(storeAddress)
    const storeUtxos = await provider.fetchAddressUTxOs(storeAddress)

    async function fetchUtxo(addr, txHash) {
        const utxos = await provider.fetchAddressUTxOs(addr)
        return utxos.find((utxo) => {
            return utxo.input.txHash == txHash
        })
    }

    const storeUtxo = await fetchUtxo(storeAddress, '63c04dbcd662b3eb1b631fe3ff04375c6ebed4fc8aae5420b6f046790fa14f20')

    console.log(storeUtxo)

    const redeemer = {
        data: { alternative: 1, fields: [] }
    }

    const referenceTokenRecipient: Recipient = {
        address: userAddress,
        datum: {
            value: metadataToCip68({
                name: 'KH17112003',
                description: 'Nguyễn Duy Khánh'
            }),
            inline: true
        }
    }

    const tx = new Transaction({ initiator: wallet })
    tx.redeemValue({
        value: storeUtxo!,
        script: storeScript,
        redeemer: redeemer
    })
    // tx.sendValue(userAddress, storeUtxo!)
    tx.sendValue(referenceTokenRecipient, storeUtxo!)

    const unsignedTx = await tx.build()
    const signedTx = wallet.signTx(unsignedTx, true)
    const txHash = await wallet.submitTx(signedTx)
    console.log(txHash)
}

update()
    .then(() => {
        process.exit(1)
    })
    .catch((error) => console.log(error))
    .finally(() => {
        process.exit(0)
    })
//81d1f83172bd35f68c1d6ba037c8ad2bb9acccd739d8df98c4e2b94648e4c66f
//274853ed1578339217960c9a1893ab9df236b6a5a0a1733350fcd555c19e66b6
//c79ec8056267a82dca3906c46a3aa222579a9e111ded54bc7d0f3e8a5db21edb
