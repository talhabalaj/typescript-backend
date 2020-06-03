import Express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import socket from "socket.io";
import { createServer } from "http";
import morgan from "morgan";

import { mainRouter } from "./routes/v1";
import { port, origin } from "./config";
import { escapeBody } from "./middleware/escapeBody";

import "./lib/db";
import { socketListener } from "./socket";
import { socketAuthHandler } from "./socket/authHandler";

const app = Express();
const server = createServer(app);
const io = socket(server);

const corsMiddleware: any = cors({ credentials: true, origin });

// Middleware
app.use(helmet());
app.use(morgan("combined"));

// Socket
io.use(socketAuthHandler).on("connection", socketListener);

// CORS
app.options(corsMiddleware);
app.use(corsMiddleware);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(escapeBody);

// Routes
app.use("/app/api/v1/", mainRouter);

server.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
