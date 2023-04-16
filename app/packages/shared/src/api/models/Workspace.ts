import { role1IsAtLeastRole2 } from "../../common/index.js";
import {PermissionUser, UserRole} from "../../types/index.js";
import { DataType } from "./BaseResponse.js";

export type WorkspaceData = DataType & {
    id: number;
    name: string;
    description: string;
    users: PermissionUser[];
    myRole: UserRole;
}

export class Workspace {
    id: number;
    name: string;
    description: string;
    users: PermissionUser[];
    myRole: UserRole;

    constructor(data: WorkspaceData) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
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