import { DataType } from "./BaseResponse.js";
import { UserRole } from "./UserRole.js";


export type WorkspaceUserData = DataType & {
    userId: number;
    workspaceId: number;
    role: UserRole;
}

export class WorkspaceUser {
    userId: number;
    workspaceId: number;
    role: UserRole;

    constructor(data: WorkspaceUserData) {
        this.userId = data.userId;
        this.workspaceId = data.workspaceId;
        this.role = data.role;
    }
}