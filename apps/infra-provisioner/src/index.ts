import express from "express";
import postgresRouter from "../routes/provisioner/provisioner.route";

const app = express();

app.use(express.json());
app.use("/api/provision", postgresRouter);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});