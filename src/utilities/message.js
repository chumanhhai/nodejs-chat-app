function generateMessage (message) {
    return {
        text: message.text,
        type: message.type,
        username: message.username,
        createdAt: new Date().getTime()
    }
}

function generateNotification (notification) {
    return {
        text: notification,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateNotification
}