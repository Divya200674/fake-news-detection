const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Fake News Detection Server Running");
});

app.post("/verify", (req, res) => {

    const { text } = req.body;

    console.log("Received News:", text);

    res.json({
        success: true,
        message: "Verification Started",
        received: text
    });
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});