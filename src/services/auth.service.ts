import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const users: { username: string; password: string }[] = [];

export async function registerUser(username: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  return { message: "User registered successfully" };
}

export async function loginUser(username: string, password: string) {
  const user = users.find((u) => u.username === username);
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ username }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });

  return { token };
}
