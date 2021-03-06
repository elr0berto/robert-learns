export type UserData = {
    id: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    isGuest: boolean;
}

export default class User {
    id: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    isGuest: boolean;

    constructor(data: UserData) {
        this.id = data.id;
        this.email = data.email;
        this.username = data.username;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.isGuest = data.isGuest;
    }

    name() : string {
        return this.firstName + " " + this.lastName;
    }
}