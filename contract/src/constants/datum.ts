import { Data } from "lucid-cardano";

const Cip68DatumSchema = Data.Object({
    metadata: Data.Map(
        Data.Any(),
        Data.Any(),
    ),
    version: Data.Integer(),
    extra: Data.Bytes(),
})

export type Cip68Datum = Data.Static<typeof Cip68DatumSchema>
export const Cip68Datum = Cip68DatumSchema as unknown as Cip68Datum;