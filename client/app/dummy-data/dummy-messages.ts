const timeNow = new Date();
const specificPastTime = new Date(2023, 5, 7);

export const dummyMessages = {
	convoId: "12311",
	messages: [
		{
			sender: "vany",
			receiver: "barn",
			message:
				"Should I be splitting up by routes then into agroup that use traditonal api routes and a group that uses sockets?",
			timeStamp: specificPastTime,
			messageId: "13131355131",
		},
		{
			sender: "barn",
			receiver: "barn",
			message: "Yeah",
			timeStamp: specificPastTime,
			messageId: "1312311da31",
		},
		{
			sender: "barn",
			receiver: "barn",
			message: "Code splitting good",
			timeStamp: specificPastTime,
			messageId: "13131375zc441131",
		},
		{
			sender: "vany",
			receiver: "barn",
			message: "ok i implemented friend requests but without socket ids",
			timeStamp: specificPastTime,
			messageId: "1313136a11131",
		},
		{
			sender: "vany",
			receiver: "barn",
			message: "as I dont understand that  yet",
			timeStamp: specificPastTime,
			messageId: "131231385zz1131",
		},
		{
			sender: "barn",
			receiver: "vany",
			message: "Just chill then",
			timeStamp: specificPastTime,
			messageId: "1318vq31131131",
		},
		{
			sender: "barn",
			receiver: "vany",
			message: "Optimize your code, add more typescript",
			timeStamp: specificPastTime,
			messageId: "131311jh3123456131",
		},
		{
			sender: "barn",
			receiver: "vany",
			message: "Look up Kafka",
			timeStamp: specificPastTime,
			messageId: "13131yw4131511131",
		},
		{
			sender: "barn",
			receiver: "vany",
			message: "Ah wait, you can write unit tests",
			timeStamp: specificPastTime,
			messageId: "131312bx9754131",
		},
		{
			sender: "vany",
			receiver: "barn",
			message: "X_X",
			timeStamp: specificPastTime,
			messageId: "1317ur64131",
		},
		{
			sender: "barn",
			receiver: "vany",
			message: "There's a socket client mock library you can use",
			timeStamp: specificPastTime,
			messageId: "113zc1131",
		},
		{
			sender: "vany",
			receiver: "barn",
			message:
				"CRITICAL: ACTION REQUIRED: gke-gcloud-auth-plugin, which is needed for continued use of kubectl, was not found or is not executable. Install gke-gcloud-auth-plugin for use with kubectl by following ",
			timeStamp: specificPastTime,
			messageId: "31ba0",
		},
		{
			sender: "vany",
			receiver: "barn",
			message:
				"https://cloud.google.com/blog/products/containers-kubernetes/kubectl-auth-changes-in-gke ",
			timeStamp: timeNow,
			messageId: "31uut031",
		},
		{
			sender: "vany",
			receiver: "barn",
			message:
				"const server = http.createServer(app);\nconst io = new Server(server);\nio.on('connection', (socket: Socket) =>{\nsendFriendRequest(socket);\nacceptFriendRequest(socket);\n}) ",
			timeStamp: timeNow,
			messageId: "313bg18",
		},
		{
			sender: "barn",
			receiver: "vany",
			message: "It works!",
			timeStamp: timeNow,
			messageId: "1104k1i131",
		},
		{
			sender: "barn",
			receiver: "vany",
			message: "The test server should be live",
			timeStamp: timeNow,
			messageId: "1104f1i11",
		},
		{
			sender: "barn",
			receiver: "vany",
			message: "wait, nvm there's an issue",
			timeStamp: timeNow,
			messageId: "1104aazza1i11",
		},
		{
			sender: "barn",
			receiver: "vany",
			message: "i need to check what's wrong real quick",
			timeStamp: timeNow,
			messageId: "11041fwy13i11",
		},
		{
			sender: "barn",
			receiver: "vany",
			message:
				"Just a reminder that we're off today, but that doesn't mean you can't work on some code or learn Kafka for next week",
			timeStamp: timeNow,
			messageId: "1104o1i13131681",
		},
		{
			sender: "barn",
			receiver: "vany",
			message: "Also we'll be making a small tweak to our design",
			timeStamp: timeNow,
			messageId: "11311s0yi41i11",
		},
		{
			sender: "barn",
			receiver: "vany",
			message:
				"Instead of using ws for our notification service, we should use something called server side events",
			timeStamp: timeNow,
			messageId: "1104dafa1i11",
		},
	],
};
