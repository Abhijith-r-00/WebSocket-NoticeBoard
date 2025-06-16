const socket = io();
const noticeContainer = document.getElementById('notices');

// Load existing notices
fetch('/notices')
  .then(res => res.json())
  .then(data => {
    data.forEach(notice => renderNotice(notice));
  });

// Listen for new notices
socket.on('new-notice', (notice) => {
  renderNotice(notice);
});

function renderNotice(notice) {
  const div = document.createElement('div');
  div.classList.add('notice');
  div.innerHTML = `<h3>${notice.title}</h3><p>${notice.message}</p><small>${new Date(notice.createdAt).toLocaleString()}</small>`;
  noticeContainer.prepend(div);
}
