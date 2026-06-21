console.log("app.js loaded");
const button =
document.getElementById("verifyBtn");

button.addEventListener("click",
async () => {

    const text =
    document.getElementById("newsInput").value;

    const response =
    await fetch(
        "http://localhost:5000/verify",
        {
            method:"POST",
            headers:{
                "Content-Type":
                "application/json"
            },
            body:JSON.stringify({
                text:text
            })
        }
    );

    const data =
    await response.json();

    document.getElementById(
        "result"
    ).innerText =
    data.message;
});