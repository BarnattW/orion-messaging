async function getUsername(userId: string) {
	try {
		const response = await fetch(`/api/connect/${userId}/getUsername`, {
			headers: {
				method: "GET",
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			// Handle non-successful HTTP response
			throw new Error("Failed to retrieve username");
		}

		const username = await response.json();
		return username;
	} catch (error: any) {
		// Handle the error
		console.log("Error occurred:", error.message);
		// Display or handle the error in the user interface
		// e.g., show an error message to the user
	}
}

export default getUsername;
