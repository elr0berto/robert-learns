export const objectMap = <TObject, TValue, TRet>(obj : TObject, fn : (v: TValue, k: string, i: number) => TRet) =>
    Object.fromEntries(
        Object.entries(obj).map(
            ([k, v], i) => [k, fn(v, k, i)]
        )
    );