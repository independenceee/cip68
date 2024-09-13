export const plutusV3 = {
    preamble: {
        title: "independence/contract",
        description: "Aiken contracts for project 'independence/contract'",
        version: "0.0.0",
        plutusVersion: "v3",
        compiler: {
            name: "Aiken",
            version: "v1.1.0+be31a7c",
        },
        license: "Apache-2.0",
    },
    validators: [
        {
            title: "mint.mint.mint",
            redeemer: {
                title: "redeemer",
                schema: {
                    $ref: "#/definitions/contract~1types~1MintRedeemer",
                },
            },
            compiledCode:
                "58bb0101003232323232322533300232323232325332330083001300937540042646464a66601660080022a66601c601a6ea8018540085854ccc02ccdc3a40040022a66601c601a6ea8018540085858c02cdd5002899191919192999807180398079baa00914a22944dd59808980918090011bac3010001301030100023758601c00260166ea8018dd7180618051baa002370e90000b1805180580118048009804801180380098021baa00114984d9595cd2ab9d5573caae7d5d0aba21",
            hash: "65ad4cd95f5357eaaa655f7edccf57067822e2ea33edaeef451cb457",
        },
        {
            title: "mint.mint.else",
            compiledCode:
                "58bb0101003232323232322533300232323232325332330083001300937540042646464a66601660080022a66601c601a6ea8018540085854ccc02ccdc3a40040022a66601c601a6ea8018540085858c02cdd5002899191919192999807180398079baa00914a22944dd59808980918090011bac3010001301030100023758601c00260166ea8018dd7180618051baa002370e90000b1805180580118048009804801180380098021baa00114984d9595cd2ab9d5573caae7d5d0aba21",
            hash: "65ad4cd95f5357eaaa655f7edccf57067822e2ea33edaeef451cb457",
        },
        {
            title: "store.store.spend",
            datum: {
                title: "_datum",
                schema: {
                    $ref: "#/definitions/types~1cip68~1CIP68",
                },
            },
            redeemer: {
                title: "_redeemer",
                schema: {
                    $ref: "#/definitions/contract~1types~1StoreRedeemer",
                },
            },
            compiledCode:
                "589101010032323232323225333002323232323253330073370e900118041baa00113232323232533300c3370e90000008a99980798071baa00715002161533300c3370e90010008a99980798071baa007150021616300c375400c2944c034c038008c030004c024dd50008b1805180580118048009804801180380098021baa00114984d9595cd2ab9d5573caae7d5d0aba21",
            hash: "05f7f1dd46616a14a0b46b385489a69d88c28814e56ed2fcafa6251a",
        },
        {
            title: "store.store.else",
            compiledCode:
                "589101010032323232323225333002323232323253330073370e900118041baa00113232323232533300c3370e90000008a99980798071baa00715002161533300c3370e90010008a99980798071baa007150021616300c375400c2944c034c038008c030004c024dd50008b1805180580118048009804801180380098021baa00114984d9595cd2ab9d5573caae7d5d0aba21",
            hash: "05f7f1dd46616a14a0b46b385489a69d88c28814e56ed2fcafa6251a",
        },
    ],
    definitions: {
        Data: {
            title: "Data",
            description: "Any Plutus data.",
        },
        Int: {
            dataType: "integer",
        },
        Pairs$Data_Data: {
            title: "Pairs<Data, Data>",
            dataType: "map",
            keys: {
                $ref: "#/definitions/Data",
            },
            values: {
                $ref: "#/definitions/Data",
            },
        },
        "contract/types/MintRedeemer": {
            title: "MintRedeemer",
            anyOf: [
                {
                    title: "Mint",
                    dataType: "constructor",
                    index: 0,
                    fields: [],
                },
                {
                    title: "Burn",
                    dataType: "constructor",
                    index: 1,
                    fields: [],
                },
            ],
        },
        "contract/types/StoreRedeemer": {
            title: "StoreRedeemer",
            anyOf: [
                {
                    title: "Update",
                    dataType: "constructor",
                    index: 0,
                    fields: [],
                },
                {
                    title: "Remove",
                    dataType: "constructor",
                    index: 1,
                    fields: [],
                },
            ],
        },
        "types/cip68/CIP68": {
            title: "CIP68",
            description:
                "The generic CIP68 metadatum type as defined in the CIP at\n https://cips.cardano.org/cips/cip68/.",
            anyOf: [
                {
                    title: "CIP68",
                    dataType: "constructor",
                    index: 0,
                    fields: [
                        {
                            title: "metadata",
                            $ref: "#/definitions/Pairs$Data_Data",
                        },
                        {
                            title: "version",
                            $ref: "#/definitions/Int",
                        },
                    ],
                },
            ],
        },
    },
};
