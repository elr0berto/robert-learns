import { UserRole } from "../types/index.js";

export const objectMap = <TObject extends {}, TRet>(obj : TObject, fn : (v: any, k: string, i: number) => TRet) =>
    Object.fromEntries(
        Object.entries(obj).map(
            ([k, v], i) => [k, fn(v, k, i)]
        )
    );

export function removeItem<T>(arr: Array<T>, value: T): Array<T> {
    console.log('removeItem');
    const index = arr.indexOf(value);
    console.log('removeItem index', index);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

export function arrayUnique<T>(a: T[]) : T[] {
    return [...new Set(a)];
}

export function role1IsAtLeastRole2(role1: UserRole, role2: UserRole) {
    const allRoles = Object.values(UserRole);
    const role1Index = allRoles.indexOf(role1);
    const role2Index = allRoles.indexOf(role2);
    return role1Index <= role2Index;
}