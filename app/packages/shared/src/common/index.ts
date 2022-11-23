export const objectMap = <TObject extends {}, TRet>(obj : TObject, fn : (v: any, k: string, i: number) => TRet) =>
    Object.fromEntries(
        Object.entries(obj).map(
            ([k, v], i) => [k, fn(v, k, i)]
        )
    );