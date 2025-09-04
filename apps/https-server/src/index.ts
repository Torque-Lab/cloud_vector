import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "../routes/auth/auth.route";
import passport from "passport";
const app = express();
app.use(express.json());
app.use(cookieParser());
const isDev=process.env.NODE_ENV==='developement';
if(!isDev){
  app.set("trust proxy", 1);
}
app.use(passport.initialize());
app.use("/api/auth", authRouter);







app.get("/api/health", (req, res) => {
    const token=req.query.token;
    if(!token){
        return res.status(401).json({ message: "Unauthorized" });
    }
   if(token!=process.env.health_check_token){
    return res.status(401).json({ message: "Unauthorized" });
   }
    res.status(200).json({ message: "server is running on port 3000" });
});


app.listen(3000, () => {
    console.log("Server started on port 3000");
});
