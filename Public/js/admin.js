const socket = io();

document.getElementById('noticeForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const message = document.getElementById('message').value;

  socket.emit('new-notice', { title, message });

  document.getElementById('title').value = '';
  document.getElementById('message').value = '';
});
