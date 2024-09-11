import {
    applyDoubleCborEncoding,
    fromHex,
    MintingPolicy,
    SpendingValidator,
    toHex,
} from "lucid-cardano";
import { encode } from "cbor-x";
import { plutusV2 } from "../libs/plutusV2";

export const readMintValidatorV2 = function (): MintingPolicy {
    const validator = plutusV2.validators.find(function (validator) {
        return validator.title === "mint.mint.mint";
    });

    if (!validator) {
        throw new Error("Mint validator not found");
    }

    const script = toHex(encode(fromHex(validator.compiledCode)));

    return {
        type: "PlutusV2",
        script: applyDoubleCborEncoding(validator.compiledCode),
    };
};

export const readStoreValidatorV2 = function (): SpendingValidator {
    const validator = plutusV2.validators.find(function (validator) {
        return validator.title === "store.store.spend";
    });

    if (!validator) {
        throw new Error("Mint validator not found");
    }

    const script = toHex(encode(fromHex(validator.compiledCode)));

    return {
        type: "PlutusV2",
        script: script,
    };
};
