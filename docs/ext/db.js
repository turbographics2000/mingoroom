db.version(1).stores({
    rooms: '++id, *owner, *year, *month, *day, *hour, *minute, course, hole, no, desc',
    reserve: '*roomid, *userid',
    users: 'twitterid, mingolname, avatar'
});