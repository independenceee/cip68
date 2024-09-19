import { BlockfrostProvider, MeshTxBuilder, MeshWallet, metadataToCip68 } from "@meshsdk/core";

const remove = async function () {
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

    const utxos = await wallet.getUtxos();
    const changeAddress = wallet.getChangeAddress();
    const txBuilder = new MeshTxBuilder({
        fetcher: blockfrostProvider,
        evaluator: blockfrostProvider,
        submitter: blockfrostProvider,
    });

    const unsignedTx = await txBuilder
        .changeAddress(changeAddress)
        .txOutInlineDatumValue(
            metadataToCip68({
                name: "Nguyen Duy Khanh 1",
                image: "ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua",
                mediaType: "image/jpg",
                description: "Blockchain Developer",
            }),
        )
        .selectUtxosFrom(utxos)
        .complete();
};

remove()
    .then(function () {
        process.exit(0);
    })
    .catch(function (error) {
        console.log(error);
    })
    .finally(function () {
        process.exit(1);
    });
