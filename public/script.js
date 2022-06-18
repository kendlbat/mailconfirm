async function formSend() {
    let fd = new FormData(document.querySelector("form#dataform"));
    let sendermail = fd.get("sender");
    let recievermail = fd.get("recipient");

    let mailregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!mailregex.test(sendermail)) {
        alert("Invalid sender mail");
        return;
    }

    if (!mailregex.test(recievermail)) {
        alert("Invalid reciever mail");
        return;
    }

    let subject = fd.get("subject");
    if (subject.length > 100) {
        alert("Subject too long");
        return;
    }

    // SEND AS JSON POST

    fetch("/api/newentry", {
        method: "POST",
        body: JSON.stringify({
            sender: sendermail,
            reciever: recievermail,
            subject: subject
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(data => {
        document.querySelector("#output").innerText = `<img src=\"${window.location.href.split("/").slice(0, -1).join("/")}${data.hashurl}\" style="visibility: hidden;">`;
    });
}

document.querySelector("form#dataform").addEventListener("submit", formSend);