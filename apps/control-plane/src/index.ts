import express from "express";
import cors from "cors";
import connectionRoute from "../routes/connection.route";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", connectionRoute);

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});