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
			messageId: "131313131",
		},
		{
			sender: "barn",
			receiver: "barn",
			message: "Yeah",
			timeStamp: specificPastTime,
			messageId: "131231131",
		},
		{
			sender: "barn",
			receiver: "barn",
			message: "Code splitting good",
			timeStamp: specificPastTime,
			messageId: "13131375441131",
		},
		{
			sender: "vany",
			receiver: "barn",
			message: "ok i implemented friend requests but without socket ids",
			timeStamp: specificPastTime,
			messageId: "131313611131",
		},
		{
			sender: "vany",
			receiver: "barn",
			message: "as I dont understand that  yet",
			timeStamp: specificPastTime,
			messageId: "1312313851131",
		},
		{
			sender: "barn",
			receiver: "vany",
			message: "Just chill then",
			timeStamp: specificPastTime,
			messageId: "131831131131",
		},
		{
			sender: "barn",
			receiver: "vany",
			message: "Optimize your code, add more typescript",
			timeStamp: specificPastTime,
			messageId: "1313113123456131",
		},
		{
			sender: "barn",
			receiver: "vany",
			message: "Look up Kafka",
			timeStamp: specificPastTime,
			messageId: "131314131511131",
		},
		{
			sender: "barn",
			receiver: "vany",
			message: "Ah wait, you can write unit tests",
			timeStamp: specificPastTime,
			messageId: "1313129754131",
		},
		{
			sender: "vany",
			receiver: "barn",
			message: "X_X",
			timeStamp: specificPastTime,
			messageId: "131764131",
		},
		{
			sender: "barn",
			receiver: "vany",
			message: "There's a socket client mock library you can use",
			timeStamp: specificPastTime,
			messageId: "1131131",
		},
		{
			sender: "vany",
			receiver: "barn",
			message:
				"CRITICAL: ACTION REQUIRED: gke-gcloud-auth-plugin, which is needed for continued use of kubectl, was not found or is not executable. Install gke-gcloud-auth-plugin for use with kubectl by following ",
			timeStamp: specificPastTime,
			messageId: "310",
		},
		{
			sender: "vany",
			receiver: "barn",
			message:
				"https://cloud.google.com/blog/products/containers-kubernetes/kubectl-auth-changes-in-gke ",
			timeStamp: timeNow,
			messageId: "31031",
		},
		{
			sender: "vany",
			receiver: "barn",
			message:
				"const server = http.createServer(app);\nconst io = new Server(server);\nio.on('connection', (socket: Socket) =>{\nsendFriendRequest(socket);\nacceptFriendRequest(socket);\n}) ",
			timeStamp: timeNow,
			messageId: "31318",
		},
		{
			sender: "barn",
			receiver: "vany",
			message: "It works!",
			timeStamp: timeNow,
			messageId: "11041i131",
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
			messageId: "1104aa1i11",
		},
		{
			sender: "barn",
			receiver: "vany",
			message: "i need to check what's wrong real quick",
			timeStamp: timeNow,
			messageId: "1104113i11",
		},
		{
			sender: "barn",
			receiver: "vany",
			message:
				"Just a reminder that we're off today, but that doesn't mean you can't work on some code or learn Kafka for next week",
			timeStamp: timeNow,
			messageId: "11041i13131681",
		},
		{
			sender: "barn",
			receiver: "vany",
			message: "Also we'll be making a small tweak to our design",
			timeStamp: timeNow,
			messageId: "11311s041i11",
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

const dummyConvo = {
	convoId: "12311",
	messages: [
		{
			sender: "vany",
			receiver: "barn",
			message: "woof",
			timeStamp: new Date(),
			messageId: "1313131131",
		},
		{
			sender: "vany",
			receiver: "barn",
			message: "wan",
			timeStamp: new Date(),
			messageId: "1313131131",
		},
		{
			sender: "vany",
			receiver: "barn",
			message: "bau",
			timeStamp: new Date(),
			messageId: "1313131131",
		},
		{
			sender: "vany",
			receiver: "barn",
			message: "meong",
			timeStamp: new Date(),
			messageId: "1313131131",
		},
		{
			sender: "vany",
			receiver: "barn",
			message: "wang",
			timeStamp: new Date(),
			messageId: "1313131131",
		},
		{
			sender: "barn",
			receiver: "vany",
			message: "vov",
			timeStamp: new Date(),
			messageId: "1313131131",
		},
	],
};
