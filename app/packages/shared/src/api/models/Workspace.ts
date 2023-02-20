import {PermissionUser} from "../../types/index.js";

export type WorkspaceData = {
    id: number;
    name: string;
    description: string;
    users: PermissionUser[];
}

export class Workspace {
    id: number;
    name: string;
    description: string;
    users: PermissionUser[];

    constructor(data: WorkspaceData) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.users = data.users;
    }

    allowGuests() : boolean {
        return this.users.filter(u => u.isGuest).length > 0;
    }
}