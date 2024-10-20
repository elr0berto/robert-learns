import {Context} from "../index";

export const addNotification = async ({state} : Context, message : string) => {
    console.log('notifications', state.notifications.notifications);
    const copy = [...state.notifications.notifications];
    copy.push({message});
    state.notifications.notifications = copy;
}

export const closeNotification = async ({state,actions} : Context, id : number) => {
    state.notifications.notifications.splice(id, 1);
}

