import express from "express";
import cors from "cors";
import { users } from "./db/users.js";
import jwt from "jsonwebtoken";
import { todos } from "./db/todos.js";

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => res.send("Hello from the backend"));

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.sendStatus(400);
  const user = users.find((user) => user.email === email);
  if (!user)
    return res.send({
      success: false,
      mesage: "Bad credentials",
    });
  if (user.password !== password)
    return res.send({
      success: false,
      mesage: "Bad credentials",
    });
  const payload = { email: user.email, id: user.id };
  const token = jwt.sign(payload, "your_secret_key", { expiresIn: "1h" });
  res.send({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      token: token,
    },
  });
});

app.get("/todo", (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.sendStatus(400);
  const { authorization } = req.headers;
  if (!authorization) return res.sendStatus(401);
  const isValidAuthorization = authorization.startsWith("Bearer", 0);
  if (!isValidAuthorization) return res.sendStatus(401);
  const token = authorization.split(" ")[1];
  if (!token) res.sendStatus(401);
  jwt.verify(token, "your_secret_key", (err, decoded) => {
    if (err) return res.sendStatus(401);
    const tasks = todos.filter((todo) => todo.userId === decoded.id);
    res.send(tasks);
  });
});

app.use(cors());

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
