import { DataType } from "./BaseResponse.js";
import { UserRole } from "./UserRole.js";


export type WorkspaceUserInviteData = DataType & {
    email: string;
    workspaceId: number;
    role: UserRole;
}

export class WorkspaceUserInvite {
    email: string;
    workspaceId: number;
    role: UserRole;

    constructor(data: WorkspaceUserInviteData) {
        this.email = data.email;
        this.workspaceId = data.workspaceId;
        this.role = data.role;
    }
}