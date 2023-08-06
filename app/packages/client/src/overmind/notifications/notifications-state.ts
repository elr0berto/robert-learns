import {derived} from "overmind";

type Notification = {
    message: string;
}

type NotificationsState = {
    notifications: Notification[];
    readonly notificationsWithId: { id: number, notification: Notification }[];
}

export const state: NotificationsState = {
    notifications: [],
    notificationsWithId: derived((state: NotificationsState) => {
        return state.notifications.map((notification, index) => {
            return {
                id: index,
                notification
            };
        });
    }),
};