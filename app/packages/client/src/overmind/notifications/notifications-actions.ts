import {Context} from "../index";

export const closeNotification = async ({state,actions} : Context, id : number) => {
    state.notifications.notifications.splice(id, 1);
}