db.version(1).stores({
    rooms: 'id, *owner, *datetime, course, holes, no, desc',
    reserve: '*roomid, *userid',
    users: 'twitterid, mingolname, avatar'
});