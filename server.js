import express from "express";
import cors from "cors";
import { users } from "./db/users.js";
import jwt from "jsonwebtoken";

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
  const token = jwt.sign(payload, "your_secret_key", { expiresIn: "1d" });
  res.send({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      token: token,
    },
  });
});

app.use(cors());

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
