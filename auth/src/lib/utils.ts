import { sign } from "jsonwebtoken";

function issueJWT(user: Express.User) {
  const expiresIn = "7d";

  const data = {
    userId: user.userId,
  };

  const payload = {
    sub: data,
    iat: Math.floor(Date.now() / 1000),
  };

  const token = sign(payload, process.env.JWT_KEY, {
    algorithm: "HS256",
    expiresIn: expiresIn,
  });

  console.log(payload);

  return {
    token: token,
    expiresIn: expiresIn,
  };
}

export { issueJWT as issueJWT };
