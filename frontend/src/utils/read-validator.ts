import { SpendingValidator } from "lucid-cardano";

const readValidator = function (): SpendingValidator {
    return {
        type: "PlutusV2",
        script: "49480100002221200101",
    };
};

export default readValidator;
