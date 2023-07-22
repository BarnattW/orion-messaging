import io from "socket.io-client";

const notificationSocket = io("http://orion-messaging.com", {
	path: "/socket/notifications-socket/",
});

export default notificationSocket;
