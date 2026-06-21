console.log("app.js loaded");

const button = document.getElementById("verifyBtn");

button.addEventListener("click", async () => {

    try {

        const text =
            document.getElementById("newsInput").value;

        if (!text.trim()) {
            document.getElementById("result").innerText =
                "Please enter some news text.";
            return;
        }

        document.getElementById("result").innerText =
            "Verifying...";

        const response = await fetch(
            "http://localhost:5000/verify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: text
                })
            }
        );

        const data = await response.json();

        document.getElementById("result").innerText =
            data.message;

        console.log(data);

    } catch (error) {

        console.error(error);

        document.getElementById("result").innerText =
            "Error connecting to backend.";
    }
});