import { Socket } from "socket.io";
import { IConversation } from "../models/Conversation";

export async function socketsInConversation(
  conv: IConversation,
  connectedClients: Map<string, Socket>
) {
  try {
    const usersInConversation = conv.users;
    const userIds = [...connectedClients.keys()];

    const filteredArray = usersInConversation.filter((value) =>
      userIds.includes(value.toString())
    );

    console.log(filteredArray);

    const sockets = filteredArray
      .filter((key) => connectedClients.has(key.toString()))
      .map((key) => connectedClients.get(key.toString()));

    console.log("Added Message");
    let result = sockets.map((a) => a?.id);
    console.log(result);
    return result;
  } catch (e) {
    console.log('Unable to get sockets')
  }
}
