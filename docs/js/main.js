var allRooms = {
  ritto: {
    '0100': {
      img: null,
      no: 999999
    },
    '0115': {
      img: null,
      no: 999999
    }
  },
  gtk2k: {
    '0100': {
      img: null,
      no: 999999
    },
    '0115': {
      img: null,
      no: 999999
    }
  },
};

function timeFormat(h, m, delim) {
  return ('0' + h).slice(-2) + (delim ? ':' : '') + ('0' + m).slice(-2);
}

for (var h = 0; h < 24; h++) {
  for (var m = 0; m < 60; m += 15) {
    var row = document.createElement('div');
    var rowHeader = document.createElement('div');
    var rowContainer = document.createElement('div');

    var time = timeFormat(h, m);
    row.id = 'row' + timeFormat(h, m);
    row.classList.add('timetable-row');
    rowContainer.id = row.id + 'Container';
    rowHeader.classList.add('timetable-rowheader');
    rowHeader.textContent = timeFormat(h, m, true);
    rowContainer.classList.add('timetable-rowcontainer');
    row.appendChild(rowHeader);
    row.appendChild(rowContainer);
    mingoroomContainer.appendChild(row);
  }
}

Object.keys(allRooms).sort().forEach(owner => {
  var roomsPerOwner = allRooms[owner];
  Object.keys(roomsPerOwner).forEach(time => {
    var data = roomsPerOwner[time];
    var rowContainer = window['row' + time + 'Container'];

    var room = document.createElement('div');
    var roomHeader = document.createElement('div');
    var course = document.createElement('div');
    var hole = document.createElement('div');
    var roomOwner = document.createElement('div');
    var roomNo = document.createElement('div');

    room.classList.add('room');
    roomHeader.classList.add('room-header');
    if (data.img) {
      roomHeader.style.backgroundImage = 'url(' + data.img + ')';
    }
    roomOwner.classList.add('room-owner');
    roomOwner.textContent = '主催者：' + owner;
    roomNo.classList.add('room-no');
    roomNo.textContent = ('00000' + data.no).slice(-6);

    room.appendChild(roomHeader);
    room.appendChild(roomOwner);
    room.appendChild(roomNo);

    rowContainer.appendChild(room);
  });
});


OAuth.initialize('yX1CCTTxmjkYiKN-OOcWyiIaxQE');
//OAuth.redirect('twitter', 'https://turbographics2000.github.io/mingoroom/');
OAuth.callback('twitter').done(function(result) {
  result.me()
    .done(res => {
        // res = {
        //   alias:"gtk2k"
        //   avatar:"https://pbs.twimg.com/profile_images/3505213319/b01e2067b3fa616659f3e9cd8e9bc0e7_normal.jpeg",
        //   bio:"とりあえず、プログラマーです。",
        //   id:"152128707",
        //   language:"ja",
        //   location:"",
        //   name:"mashroom23",
        //   raw:{id: 152128707, id_str: "152128707", name: "mashroom23", screen_name: "mashroom23", location: "", …}
        //   timezone:"Hawaii"
        //   url:"https://twitter.com/mashroom23"
        //   website:null
        // };
        console.log(response.name);

    });
}).fail(function(err) {
  //todo when the OAuth flow failed
});
// OAuth.popup('twitter')
//   .done(result => {
//     result.me()
//       .done(function (response) {
//       })
//       .fail(function (err) {
//         console.log(err);
//         //handle error with err
//       });
//   })
//   .fail(err => {
//     console.log(err);
//     //handle error with err
//   });