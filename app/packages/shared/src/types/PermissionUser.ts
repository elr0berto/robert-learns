import {UserRole} from "types/UserRole.js";

export type PermissionUser = {
    userId: number,
    name: string,
    email: string,
    role: UserRole,
}