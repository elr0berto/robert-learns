export const objectMap = (obj : any, fn : (v: unknown, k: string, i: number) => unknown) =>
    Object.fromEntries(
        Object.entries(obj).map(
            ([k, v], i) => [k, fn(v, k, i)]
        )
    );