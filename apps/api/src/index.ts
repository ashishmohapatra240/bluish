import express from "express";
import { cacheWrapper } from "@repo/shared";

const app = express();
const PORT = 3500;

app.use(express.json());

type User = {
  id: string;
  name: string;
  age: number;
};

const USERS = new Map<string, User>([
  ["1", { id: "1", name: "Ashish", age: 23 }],
  ["2", { id: "2", name: "Swastik", age: 23 }],
]);

app.get("/", (req, res) => {
  res.send("welcome to bluish");
});

async function getUserByid(id: string): Promise<User | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return USERS.get(id);
}



app.get("/users/:id", async (req, res) => {
  console.log("reached here");
  const { id } = req.params;
  const key = `users:${id}`;

  const cachedUser = await cacheWrapper.get<User>(key);
  if (cachedUser) return res.json({ source: "cache", user: cachedUser });

  const user = await getUserByid(id);
  if (!user) res.json("user not found");

  await cacheWrapper.set(key, user, 60);
  return res.json({ source: "db", user });
});

app.listen(PORT, () => {
  console.log(`connected on ${PORT}`);
});
