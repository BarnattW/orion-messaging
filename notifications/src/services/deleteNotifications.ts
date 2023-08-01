import { Notifications } from "../models/notifications";

export async function deleteNotification(notificationId: string){
    try{
        const notif = Notifications.findByIdAndDelete(notificationId);
        if (!notif){
            console.log("notification not found");
            return "";
        }
        console.log("notification succesfully deleted");
        return "deleted";
    }
    catch(error){
        console.log("error deleting notification");
        return"";
    }
}