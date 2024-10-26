import { DataType } from "./BaseResponse.js";

export type UserData = DataType & {
    id: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    admin: boolean;
    emailVerified: boolean;
}

export class User {
    id: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    admin: boolean;
    emailVerified: boolean;

    constructor(data: UserData) {
        this.id = data.id;
        this.email = data.email;
        this.username = data.username;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.admin = data.admin;
        this.emailVerified = data.emailVerified;
    }
    name() : string {
        return this.firstName + " " + this.lastName;
    }
}