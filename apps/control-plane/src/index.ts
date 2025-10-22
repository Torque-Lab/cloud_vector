import express from "express";
import connectionRoute from "../routes/connection.route";


const app = express();
app.use(express.json());


app.use("/api/v1/infra", connectionRoute);
app.get("/api/v1/infra/health", (req, res) => {
    const token = req.query.health_token as string;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (token !== process.env.HEALTH_TOKEN) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json({ message: "server is running successfully",success: true });
});


const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});