async function verifyNews() {
  const text = document.getElementById("newsInput").value;

  if (!text) {
    alert("Please enter news text");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/verify-news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    const data = await response.json();

    console.log("API Response:", data);

    if (data.success) {
      document.getElementById("result").innerHTML = `
        <h3>Verdict: ${data.data.verdict}</h3>
        <p>Score: ${data.data.score}/100</p>
        <p>Reason: ${data.data.reason}</p>
      `;
    } else {
      document.getElementById("result").innerHTML =
        "Error getting result";
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

// button click
document.getElementById("verifyBtn").addEventListener("click", verifyNews);