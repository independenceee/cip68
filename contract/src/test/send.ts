import { Blockfrost, Lucid } from "lucid-cardano";

const lucid = await Lucid.new(
    new Blockfrost(
        "https://cardano-preprod.blockfrost.io/api/v0",
        "preprodHXZNMTECARQ3jlUE0RvCBT2qOK6JRtQf",
    ),
    "Preprod",
);
lucid.selectWalletFromPrivateKey(
    "ed25519_sk1xrfh0axn82mehh526fc6vx6xq8vnvlj0thla9n480d8wfvne6juqv80g4m",
);

const receiver =
    "addr_test1qzjzr7f3yj3k4jky7schc55qjclaw6fhc3zfnrarma9l3579hwurrx9w7uhz99zdc3fmmzwel6hac404zyywjl5jhnls09rtm6";

const tx = await lucid
    .newTx()
    .payToAddress(receiver, {
        ["bc46e5a0ee056d5ab64c2514642644fa2df6e9968e906da6b1154570000de1404e677579656e204b68616e68"]:
            BigInt(1),
    })
    .complete();

const signedTx = await tx.sign().complete();

const txHash = await signedTx.submit();

await lucid.awaitTx(txHash);

console.log(`Successfully sent 5 ADA
to address: ${receiver}
txHash: ${txHash}`);
