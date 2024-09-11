import { Constr, Data } from "lucid-cardano";

const redeemers = {
    mint: Data.to(new Constr(0, []))
}

export default redeemers;