const socket = io();

document.getElementById('noticeForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const message = document.getElementById('message').value;

  socket.emit('new-notice', { title, message });

  document.getElementById('title').value = '';
  document.getElementById('message').value = '';

  showToast("✅ Notice posted successfully!");
});

// Toast function
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
}
