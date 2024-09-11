import { Blockfrost, fromText, Lucid, toUnit } from "lucid-cardano";
import { NON_FUNGIBLE_TOKEN_LABEL } from "../constants/token-labels";

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

const { paymentCredential } = lucid.utils.getAddressDetails(await lucid.wallet.address());

const mintingPolicy = lucid.utils.nativeScriptFromJson({
    type: "all",
    scripts: [
        { type: "sig", keyHash: paymentCredential?.hash },
        { type: "before", slot: lucid.utils.unixTimeToSlot(Date.now() + 1000000) },
    ],
});

const policyId = lucid.utils.mintingPolicyToId(mintingPolicy);
const tokenName = "Nguyen Khanh";
const amount = 1000000;

const userNFT = toUnit(policyId, fromText(tokenName), NON_FUNGIBLE_TOKEN_LABEL);

const tx = await lucid
    .newTx()
    .mintAssets({ [userNFT]: BigInt(1) })
    .attachMetadata(222, {
        "Author/Designer": "Ctoy",
        "Block Owls ID": "#025",
        Project: "BlockOwls",
        Website: "https://blockowls.io",
        attributes: [
            "State: Paralyzed",
            "Body Shape: Block",
            "Main Material: Silicone",
            "Display Box Base: BlackCardboard+Styrofoam",
            "Display Box Glass: PlainPlexi",
            "Gender: Male",
        ],
        files: [
            {
                mediaType: "video/mp4",
                src: "ipfs://QmaY83eve3zNzwZgYukdbc1NnNYgb9pGczADFabtguH6tD",
            },
        ],
        image: "ipfs://Qmda82xY8k6BnFZLWAA5TuhwtoWFzmEpaPGugo7DhJzHxZ",
        name: "Nguyen Khanh",
        power: 37,
        rarity: "Common",
    })
    .validTo(Date.now() + 200000)
    .attachMintingPolicy(mintingPolicy)
    .complete();

const signedTx = await tx.sign().complete();

const txHash = await signedTx.submit();

await lucid.awaitTx(txHash);

console.log(`Successfully minted ${amount} tokens with
policyId: ${policyId},
tokenName: ${tokenName},
txHash: ${txHash}`);
