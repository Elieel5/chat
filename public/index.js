const socket = io();
let username = ' ';
let userList = [];

let loginPage = document.querySelector('#loginPage');
let chatPage = document.querySelector('#chatPage');

let loginInput = document.querySelector('#loginNameInput');
let textInput = document.querySelector('#chatTextInput');

loginPage.style.display = 'flex';
chatPage.style.display = 'none';

function renderUserList() {
  let ul = document.querySelector('.userList');
  ul.innerHTML=' ';

  userList.forEach(i => {
    ul.innerHTML += '<li>'+i+'</li>';
  });
};

function addMessage(type, user, msg) {
  let ul = document.querySelector('.chatList');

  switch(type) {
    case 'status':
      ul.innerHTML += '<li class="m-status">' +msg+'</li>';
    break;
    case 'msg':
      if(username == user) {
        ul.innerHTML += '<li class="m-txt"><span class="me">'+user+'</span> '+msg+'</li>';  
      } else {
       ul.innerHTML += '<li class="m-txt"><span>'+user+'</span> '+msg+'</li>';
      }
   break;
  }
  ul.scrollTop = ul.scrollHeight;
}

loginInput.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    let name =  loginInput.value.trim();

    if (name != ' ') {
      username = name;
      document.title = 'Chat (' +username+ ')';

      socket.emit('join-request', username)
    }
  }
});

textInput.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    let txt = textInput.value.trim();
    textInput.value = ' ';

    if (txt != ' ') {
      socket.emit('send-msg', txt);
    }
  }
});

socket.on('user-ok', (list) => {
  loginPage.style.display = 'none';
  chatPage.style.display = 'flex';
  textInput.focus();

  addMessage('status', null, 'Connected');

  userList = list;
  renderUserList();
});

socket.on('list-update', (data) => {
  if(data.joined) {
    addMessage('status', null, data.joined+' Joined the chat.');
  }

  if(data.left) {
    addMessage('status', null, data.left+' Left the chat.');
  }

  userList = data.list;
  renderUserList();
});

socket.on('show-msg', (data) => {
  addMessage('msg', data.username, data.message);
});

socket.on('disconnect', () =>{
  addMessage('status', null, 'You have been disconnected');
  userList = [];
  renderUserList();
});

socket.io.on('reconnect_error', () => {
  addMessage('status', null, 'Trying to reconnect');
});

socket.io.on('reconnect', () => {
  if (username != ' ') {
    socket.emit('join-request', username);
  }
});