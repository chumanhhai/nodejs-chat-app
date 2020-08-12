const socket = io();

const form = document.getElementById("form");
const shareBtn = document.getElementById("shareBtn");
const chatSection = document.getElementById("chatSection");
const listUser = document.getElementById("listUser");
const roomTitle = document.getElementById("roomTitle");

// information 
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

roomTitle.innerHTML = room.trim().toLowerCase();

socket.emit("join", { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = "/";
    }
});

socket.on("sideBar", (users) => {
    listUser.innerHTML = "";
    listUser.innerHTML += createSideBar(users);
})

socket.on("notification", (notification) => {
    chatSection.innerHTML += createNotification(notification);
    scrollToBotoom(chatSection);
})

socket.on("message", (message) => {
    chatSection.innerHTML += createChatMessage(message);
    scrollToBotoom(chatSection);
})

form.addEventListener("submit", (event) => {
    event.preventDefault();
    socket.emit("sendMessage", { text: form.message.value, type: "chat" }, () => {
        console.log("Delivered.");
    });
    form.message.value = "";
    form.message.focus();

})

shareBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("The browser does not support geolocation service.");
    }

    shareBtn.setAttribute("disabled", "disabled");
    navigator.geolocation.getCurrentPosition((position) => {
        const link = `https://google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`
        socket.emit("sendMessage", { text: link, type: "location" }, () => {
            shareBtn.removeAttribute("disabled");
        });
    })
})



function createChatMessage (message) {
    let html =  `<div class="chat-wrapper">
                <div class="chat-message yours-or-mine">
                    <div class="header">
                        <span class="username">${message.username}</span>
                        <span class="time">${moment(message.createdAt).format("k:m")}</span>
                    </div>
                    <div class="chat-content">chat-or-location</div>
                </div>
            </div>`
    if (message.type === "chat") {
        html = html.replace("chat-or-location", `${message.text}`);
    } else {
        html = html.replace("chat-or-location", `<a href="${message.text}" target="_blank">My location</a>`);
    }
    if (message.username === username.trim().toLowerCase()) {
        html = html.replace("yours-or-mine", "mine");
    }
    return html;
}

function createNotification (notification) {
    let html = `<div class="notification-wrapper">${moment(notification.createdAt).format("k:m")} - ${notification.text}</div>`
    return html;
}

function createSideBar (users) {
    let html = "";
    users.forEach((user) => {
        html += `<li>${user.username}</li>`;
    })
    return html;
}

function scrollToBotoom (element) {
    element.scrollTop = element.scrollHeight - element.clientHeight
}


