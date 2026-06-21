let mode = "text";

function setMode(m) {
  mode = m;

  document.getElementById("textBox").style.display =
    (m === "image" || m === "video") ? "none" : "block";

  document.getElementById("fileBox").style.display =
    (m === "image" || m === "video" || m === "mixed")
      ? "block"
      : "none";
}

async function analyze() {
  const formData = new FormData();

  const text = document.getElementById("newsInput").value;
  const file = document.getElementById("mediaInput").files[0];

  formData.append("text", text);
  formData.append("mode", mode);

  if (file) {
    formData.append("media", file);
  }

  const res = await fetch("http://localhost:5000/analyze", {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  document.getElementById("result").innerHTML = `
    <h2>Verdict: ${data.verdict}</h2>
    <p>Score: ${data.finalScore}/100</p>
    <p>Mode: ${data.mode}</p>
    <p><b>Extracted:</b> ${data.extractedText}</p>
  `;
}