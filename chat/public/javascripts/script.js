const ws = new WebSocket("ws://localhost:3000");

ws.onmessage = (msg) => {
  renderMessages(JSON.parse(msg.data));
};

const renderMessages = (data) => {
  const html = data.map((item) => `<p>${item.message}</p>`).join(" ");
  document.getElementById("messages").innerHTML = html;
};

const handleSubmit = (evt) => {
  evt.preventDefault();
  const message = document.getElementById("message");
  ws.send(JSON.stringify({ author: "author predeterminado", message: message.value, ts: 1 + Math.floor(Math.random() * 1000) }));
  message.value = "";
};

const form = document.getElementById("form");
form.addEventListener("submit", handleSubmit);