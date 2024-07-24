"use client";

import {
    Address,
    Assets,
    Constr,
    Data,
    fromText,
    Lucid,
    PolicyId,
    SpendingValidator,
    TxComplete,
} from "lucid-cardano";
import React, { ReactNode } from "react";
import { redeemer } from "~/constants/redeemer";
import readValidator from "~/utils/read-validator";

type Props = {
    children: ReactNode;
};

const SmartContractProvider = function ({ children }: Props) {
    const mintAsset = async function ({
        lucid,
        assetName,
        metadata,
    }: {
        lucid: Lucid;
        assetName: string;
        metadata: any;
    }): Promise<void> {
        try {
            const validator: SpendingValidator = readValidator() as SpendingValidator;
            const policyId: PolicyId = lucid.utils.mintingPolicyToId(validator) as PolicyId;
            const contractAddress: Address = lucid.utils.validatorToAddress(validator) as Address;

            const asset = policyId + "000643b0" + fromText(assetName);
            const datum = Data.to(new Constr(0, [Data.fromJson(metadata), BigInt(1)]));
            const tx: TxComplete = await lucid
                .newTx()
                .mintAssets({ [asset]: BigInt(1) }, redeemer)
                .payToContract(contractAddress, datum, { [asset]: BigInt(1) })
                .attachMintingPolicy(validator)
                .complete();

            const signedTx = await tx.sign().complete();
            const txHash = await signedTx.submit();
            const success: boolean = await lucid.awaitTx(txHash);
            if (success) {
            }
        } catch (error) {
            console.log(error);
        } finally {
        }
    };

    const burnAsset = async function () {};

    const updateAsset = async function ({
        lucid,
        assetName,
        metadata,
    }: {
        lucid: Lucid;
        assetName: string;
        metadata: string;
    }): Promise<void> {
        try {
            const validator: SpendingValidator = readValidator() as SpendingValidator;
            const policyId: PolicyId = lucid.utils.mintingPolicyToId(validator);
            const contractAddress: Address = lucid.utils.validatorToAddress(validator) as Address;
            const asset = policyId + "000643b0" + fromText(assetName);
            const [utxo] = await lucid.utxosAtWithUnit(contractAddress, asset);
            const datum = Data.to(new Constr(0, [Data.fromJson(metadata), BigInt(2)]));

            const tx: TxComplete = await lucid
                .newTx()
                .collectFrom([utxo], redeemer)
                .payToContract(contractAddress, datum, { [asset]: BigInt(2) })
                .attachSpendingValidator(validator)
                .complete();
            const signedTx = await tx.sign().complete();
            const txHash = await signedTx.submit();
            const success: boolean = await lucid.awaitTx(txHash);
            if (success) {
            }
        } catch (error) {
            console.log(error);
        } finally {
        }
    };
};

export default SmartContractProvider;
