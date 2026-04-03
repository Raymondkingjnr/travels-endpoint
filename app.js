import express from 'express';
import cookieParser from "cookie-parser";
import {PORT} from "./config/env.js";
import connectMongoDB from "./database/mongodb.js";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();


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
