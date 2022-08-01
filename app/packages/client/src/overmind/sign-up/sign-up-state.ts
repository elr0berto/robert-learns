import {derived} from 'overmind'

type SignUpState = {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password1: string;
    password2: string;
}

export const getInitialSignUpState = (): SignUpState => ({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password1: '',
    password2: '',
})

export const state: SignUpState = getInitialSignUpState();
