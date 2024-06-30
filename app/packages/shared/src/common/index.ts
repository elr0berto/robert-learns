import { UserRole } from '../api/models/UserRole.js';

export const objectMap = <TObject extends object, TRet>(obj : TObject, fn : (v: unknown, k: string, i: number) => TRet) =>
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

export type SortDirection = 'first' | 'last' | 'up' | 'down';
export function sortWithDirection(itemIds: number[], itemId: number, direction: SortDirection) {
    const copy = [...itemIds];

    const index = copy.indexOf(itemId);

    if (index === -1) {
        throw new Error('cardId not found in newSorting');
    }

    switch (direction) {
        case 'first':
            // Move item to the beginning of the array
            copy.splice(index, 1);
            copy.unshift(itemId);
            break;
        case 'last':
            // Move item to the end of the array
            copy.splice(index, 1);
            copy.push(itemId);
            break;
        case 'up':
            // Move item up one position
            if (index > 0) {
                const temp = copy[index - 1];
                copy[index - 1] = itemId;
                copy[index] = temp;
            }
            break;
        case 'down':
            // Move card down one position
            if (index < copy.length - 1) {
                const temp = copy[index + 1];
                copy[index + 1] = itemId;
                copy[index] = temp;
            }
            break;
    }

    return copy;
}