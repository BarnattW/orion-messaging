"use client";

import { createContext, useEffect } from "react";
import { Socket, io } from "socket.io-client";

interface SocketContextType {
	socket: Socket | undefined;
}

const SocketContext = createContext<SocketContextType>({
	socket: undefined,
});

interface SocketProviderProps {
	children: React.ReactNode;
}

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
	const socket = io("ws://localhost:3000", {
		rejectUnauthorized: false,
	});

	return (
		<SocketContext.Provider value={{ socket }}>
			{children}
		</SocketContext.Provider>
	);
};

export { SocketContext, SocketProvider };
