import io from "socket.io-client";

const messageSocket = io("http://orion-messaging.com", {
	path: "/socket/message-socket",
});

export default messageSocket;
