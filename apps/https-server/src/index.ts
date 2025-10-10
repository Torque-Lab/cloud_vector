import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "../routes/auth/auth.route";
import passport from "passport";
import postgresRouter from "../routes/infra/postgres.route";
import projectRouter from "../routes/infra/project.route";
import rabbitmqRouter from "../routes/infra/rabbitmq.route";
import redisRouter from "../routes/infra/redis.route";
import dashboardRouter from "../routes/infra/dashboard.route";
const app = express();
app.use(express.json());
app.use(cookieParser());
const isDev=process.env.NODE_ENV==='developement';
if(!isDev){
  app.set("trust proxy", 1);
}
app.use(passport.initialize());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/infra",dashboardRouter)
app.use("/api/v1/infra",postgresRouter);
app.use("/api/v1/infra",projectRouter);
app.use("/api/v1/infra",rabbitmqRouter);
app.use("/api/v1/infra",redisRouter);
app.get("/api/v1/health", (req, res) => {
    const token=req.query.token;
    if(!token){
        return res.status(401).json({ message: "Unauthorized" });
    }
   if(token!=process.env.health_check_token){
    return res.status(401).json({ message: "Unauthorized" });
   }
    res.status(200).json({ message: "server is running on port 3005" });
});


app.listen(3005, () => {
    console.log("Server started on port 3005");
});

process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception:", err);
    process.exit(1);
});
process.on("SIGTERM", (s) => {
    console.log("SIGTERM received",s);
    process.exit(0);
});