import { Notifications } from "../models/notifications";
import { ObjectId } from 'mongoose';

export async function deleteNotification(notificationId: ObjectId){
    try{
        const notif = await Notifications.findByIdAndDelete(notificationId);
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