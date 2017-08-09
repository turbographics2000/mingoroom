db.version(1).stores({
    rooms: '[owner+time], course, holes, no',
    roomImages: '*owner, *tag, img',
    users: 'name, img'
});

// // バージョン2にアップグレード
// db.version(2).stores({
//     friends: "++id, [firstName+lastName], yearOfBirth, *tags", // Change indexes
//     gameSessions: null // Delete table

// }).upgrade(function () {
//     // Will only be executed if a version below 2 was installed.
//     return db.friends.modify(function (friend) {
//         friend.firstName = friend.name.split(' ')[0];
//         friend.lastName = friend.name.split(' ')[1];
//         friend.birthDate = new Date(new Date().getFullYear() - friend.age, 0);
//         delete friend.name;
//         delete friend.age;
//     });
// });