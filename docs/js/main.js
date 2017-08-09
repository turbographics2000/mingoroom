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

OAuth.popup('twitter')
  .done(result => {
    result.me()
      .done(function (response) {
        //this will display "John Doe" in the console
        console.log(response.name);
      })
      .fail(function (err) {
        //handle error with err
      });
  })
  .fail(err => {
    //handle error with err
  });