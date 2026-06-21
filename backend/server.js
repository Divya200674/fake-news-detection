app.post("/verify", (req, res) => {
    const { text } = req.body;

    console.log("Received:", text);

    if (!text) {
        return res.json({
            success: false,
            message: "No text provided"
        });
    }

    // simple fake detection logic
    const fakeKeywords = [
        "100% free",
        "shocking",
        "you won't believe",
        "earn money fast",
        "click here immediately"
    ];

    let score = 50; // base score

    fakeKeywords.forEach(word => {
        if (text.toLowerCase().includes(word)) {
            score -= 15;
        }
    });

    if (text.length < 20) {
        score -= 10;
    }

    if (score < 0) score = 0;

    let result = "Uncertain";

    if (score > 70) result = "Likely Real News";
    else if (score < 40) result = "Likely Fake News";

    res.json({
        success: true,
        message: result,
        credibilityScore: score
    });
});