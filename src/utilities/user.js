users = [];

// addUser removeUser getUser getUserInRoom

function addUser ({ id, username, room }) {
    if (!username || !room) {
        return {
            error: "Please enter username and room."
        }
    }

    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();
    const isExisting = users.find((user) => {
        return user.username === username && user.room === room;
    })
    if (isExisting) {
        return {
            error: "User does exist."
        }
    }
    const user = { id, username, room }; 
    users.push(user);
    return { user };
}

function removeUser (id) {
    const index = users.findIndex((user) => {
        return user.id === id
    })
    let user;
    if (index != -1) {
        user = users[index];
       users.splice(index, 1);
    }
    return user;
    
}

function getUser (id) {
    const user = users.find(user => user.id === id);
    return user;
}

function getUserInRoom (room) {
    room = room.trim().toLowerCase();
    const usersInRoom = users.filter(user => user.room === room);
    return usersInRoom;
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}
