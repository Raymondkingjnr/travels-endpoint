import express from 'express';
import cookieParser from "cookie-parser";
import {PORT, SERVER_URL} from "./config/env.js";
import connectMongoDB from "./database/mongodb.js";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cors from "cors";

const app = express();

const allowedOrigins = [
    "http://localhost:3000", // local frontend
    SERVER_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", usersRoutes)


app.get("/", (req, res) => {
    res.send( "welcome to travels API")
})

app.use(errorMiddleware)

app.listen(PORT, async () =>{
    console.log(`Listening on  http://localhost:${PORT}`);
    await connectMongoDB()
})

connectMongoDB().catch(err =>{
    console.error('Initial MongoDB connection error:', err);
})
