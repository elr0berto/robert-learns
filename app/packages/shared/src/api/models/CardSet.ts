import { role1IsAtLeastRole2 } from "../../common/index.js";
import {PermissionUser, UserRole} from "../../types/index.js";

export type CardSetData = {
    id: number;
    name: string;
    users: PermissionUser[];
    myRole: UserRole;
}

export class CardSet {
    id: number;
    name: string;
    users: PermissionUser[];
    myRole: UserRole;

    constructor(data: CardSetData) {
        this.id = data.id;
        this.name = data.name;
        this.users = data.users;
        this.myRole = data.myRole;
    }

    allowGuests() : boolean {
        return this.users.filter(u => u.isGuest).length > 0;
    }
    myRoleIsAtLeast(role: UserRole) : boolean {
        return role1IsAtLeastRole2(this.myRole, role);
    }
}