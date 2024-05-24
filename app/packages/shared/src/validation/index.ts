export const validateEmail = (email: string) : boolean => {
    return /^[\w.-]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email);
}