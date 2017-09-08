const battleController = require('../model/battle/controller');

function socketModule(io) {
    let usersList = [];
    io.on('connection', function (socket) {
        console.log('a user connected');

        socket.on('disconnect', (reason, a) => {
            console.log('a user disconnected by ' + reason + a);

            usersList = usersList.filter(
                (item) => {
                    return item.socketId !== socket.id;
                }
            );

            console.log('disconnect  ', usersList, socket.id);

            io.emit('change list', {users: usersList});
        });

        socket.on('add to list', (data) => {
            if (!data.user) {
                io.to(socket.id).emit('error', {message: 'No user provided'});
                return;
            }

            let user = data.user,
                exist = false;
            user.socketId = socket.id;

            if (Object.keys(socket.rooms).length > 1) {
                user.busy = true;
            }else {
                user.busy = false;
            }

            usersList.forEach((item, i, arr) => {
               if (item._id === user._id) {
                   arr[i] = user;
                   exist = true;
               }
            });

            if (!exist) {
                usersList.push(user);
            }

            console.log('add to list ', exist, Object.keys(socket.rooms));

            io.emit('change list', {users: usersList});
        });

        socket.on('ask battle', (data) => {
            data.me.socketId = socket.id;

            io.to(data.user.socketId).emit('ask battle', {battle: data.battle, user: data.me});

            /*
                say to other users that this 2 guy busy for a time
             */
            data.user.busy = true;
            data.me.busy = true;
            io.emit('busy users', {users: [data.user, data.me]});
        });

        socket.on('battle response', (data) => {
            let answer = data.answer,
                player1 = data.user,
                player2 = data.me;

            player2.socketId = socket.id;

            console.log('battle response1', data);

            if (answer) {
                console.log('battleController ', battleController);

                battleController.create({player1: player1._id, player2: player2._id, status: 'in progress'})
                    .then(
                    (success) => {
                        let battleId = success._id;

                        console.log('battle _id', battleId, player1.socketId, player2.socketId);

                        io.to(player1.socketId ).emit('go to battle', {battleId: battleId});
                        io.to(player2.socketId ).emit('go to battle', {battleId: battleId});
                        player1.busy = true;
                        player2.busy = true;

                        usersList.forEach((item) => {
                            if (item._id === player1._id || item._id === player2._id) {
                                item.busy = true;
                            }
                        });
                        io.emit('busy users', {users: [player1, player2]});
                    }
                );

            }else {
                io.to(player2.socketId).emit('battle response', {answer: data.answer});
                /*
                 say to other users that this 2 guy busy for a time
                 */
                player1.busy = false;
                player2.busy = false;
                io.emit('busy users', {users: [player1, player2]});
            }

        });

        socket.on('battle move', (data) => {
            let roomId = Object.keys(socket.rooms)[1],
                move = data.move;

            if (roomId) {
                io.of('/').in(roomId).clients((error, clients) => {
                    let clientsInRoom = 0;
                    if (error) throw error;
                    console.log('clients2 ', clients, clients.length); // => [Anw2LatarvGVVXEIAAAD]
                    clientsInRoom = clients.length;


                    if (clientsInRoom < 2) {
                        console.log('before join ', clientsInRoom);
                        socket.join(data.battle, () => {
                            socket.to(data.battle).emit('user connected', {message: 'User ' + data.username + ' is connected'});
                        });
                    } else {
                        console.log('socket.id ', socket.id);
                        io.to(socket.id).emit('room full', {message: 'Room is full'});
                    }
                });


            }
        });

        socket.on('leave room', (data) => {
            let roomId = Object.keys(socket.rooms)[1];

            socket.leave(data.roomId);

            io.of('/').in(roomId).emit('leave room', {message: 'Opponent leave the battle or disconnected'});
            console.log('leave room ', roomId);
        });


    });

}

module.exports = socketModule;