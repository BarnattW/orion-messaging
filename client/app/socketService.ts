import io from "socket.io-client";

const socket = io("http://35.243.204.21", {
	path: "/socket/connect-socket",
});

export default socket;
