import { Blockfrost, Lucid, Network } from "lucid-cardano";


const lucidProvider : () => Promise<Lucid> = async function () {
    const NETWORK: Network = "Preprod"
    const BLOCKFROST_API_KEY = "preprodHXZNMTECARQ3jlUE0RvCBT2qOK6JRtQf";
    const BLOCKFROST_RPC_URL = "https://cardano-preprod.blockfrost.io/api/v0";

    const lucid: Lucid = await Lucid.new(
        new Blockfrost(
            BLOCKFROST_RPC_URL, 
            BLOCKFROST_API_KEY,
        ),
        NETWORK,
    )

    if (!lucid) {
        throw new Error("Lucid not found");
    }
    
    return lucid;
}

export default lucidProvider;