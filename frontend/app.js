console.log("app.js loaded");

document.getElementById("verifyBtn").addEventListener("click", async () => {

    const text = document.getElementById("newsInput").value;
    const resultBox = document.getElementById("result");

    if (!text.trim()) {
        resultBox.className = "uncertain";
        resultBox.innerHTML = "⚠ Please enter news text";
        return;
    }

    resultBox.className = "uncertain";
    resultBox.innerHTML = "🔄 Analyzing...";

    try {
        const response = await fetch("http://localhost:5000/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });

        const data = await response.json();

        let className = "uncertain";

        if (data.message.includes("Real")) {
            className = "real";
        } else if (data.message.includes("Fake")) {
            className = "fake";
        }

        resultBox.className = className;

        resultBox.innerHTML = `
            <div>${data.message}</div>
            <div style="margin-top:5px;">
                Score: ${data.credibilityScore}/100
            </div>
        `;

    } catch (err) {
        resultBox.className = "fake";
        resultBox.innerHTML = "❌ Backend not connected";
    }
});