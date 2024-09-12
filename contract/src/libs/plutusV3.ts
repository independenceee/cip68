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
                "590182010100323232323232322533300232323232325332330083001300937540042646464a66601660080022a66601c601a6ea8018540085854ccc02ccdc3a40040022a66601c601a6ea8018540085858c02cdd5002899191919192999807180398079baa00914a22646600200200444a66602600229404c8c8c8c8c8c94ccc0594ccc058cdc79bae301b00600e153330163371e910104000de1400000113370e00490008a5014a029444cc020020014ccdc62400090040011bad3019301a002375c60300026030004602e0046eb0c054004c8cc004004dd59809980a180a0019129998090008a5eb804c8ccc888c8cc00400400c894ccc060004400c4c8cc068dd39980d1ba90063301a30170013301a30180014bd7019801801980e001180d0009bae30110013756602400266006006602c00460280026eb0c044004c044c044008dd6180780098059baa006375c601a60146ea8008dc3a40002c6016601800460140026014004601000260086ea8004526136565734aae7555cf2ab9f5740ae855d11",
            hash: "c17544c28dd4d85dd994b68478c0e290c65c5bf9e79213f25dd13d65",
        },
        {
            title: "mint.mint.else",
            compiledCode:
                "590182010100323232323232322533300232323232325332330083001300937540042646464a66601660080022a66601c601a6ea8018540085854ccc02ccdc3a40040022a66601c601a6ea8018540085858c02cdd5002899191919192999807180398079baa00914a22646600200200444a66602600229404c8c8c8c8c8c94ccc0594ccc058cdc79bae301b00600e153330163371e910104000de1400000113370e00490008a5014a029444cc020020014ccdc62400090040011bad3019301a002375c60300026030004602e0046eb0c054004c8cc004004dd59809980a180a0019129998090008a5eb804c8ccc888c8cc00400400c894ccc060004400c4c8cc068dd39980d1ba90063301a30170013301a30180014bd7019801801980e001180d0009bae30110013756602400266006006602c00460280026eb0c044004c044c044008dd6180780098059baa006375c601a60146ea8008dc3a40002c6016601800460140026014004601000260086ea8004526136565734aae7555cf2ab9f5740ae855d11",
            hash: "c17544c28dd4d85dd994b68478c0e290c65c5bf9e79213f25dd13d65",
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
