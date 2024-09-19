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

    const referenceTokenRecipient: Recipient = {
        address: storeAddress,
        datum: {
            value: metadataToCip68({
                name: 'KH17112003'
            }),
            inline: true
        }
    }

    async function fetchUtxo(addr, txHash) {
        const utxos = await provider.fetchAddressUTxOs(addr)
        return utxos.find((utxo) => {
            return utxo.input.txHash == txHash
        })
    }

    const storeUtxo = await fetchUtxo(storeAddress, 'd20d387fc4e3cbcedb6717effad4b9855713b18c79537ed4931bcf85dde704ad')

    console.log(storeUtxo)

    const redeemer = {
        data: { alternative: 1, fields: [] }
    }

    const tx = new Transaction({ initiator: wallet })
    tx.redeemValue({
        value: storeUtxo!,
        script: storeScript,
        redeemer: redeemer
    })
    tx.sendAssets(userAddress, [
        {
            unit: 'd7b825c03d0243cd088670010a0033384529b1f0ebc13f9d50259f6d000de1404b483137313132303033',
            quantity: '1'
        }
    ])
    tx.sendAssets(referenceTokenRecipient, [
        {
            unit: 'd7b825c03d0243cd088670010a0033384529b1f0ebc13f9d50259f6d000643b04b483137313132303033',
            quantity: '1'
        }
    ])
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
