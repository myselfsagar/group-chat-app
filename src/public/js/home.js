const KEY_ACCESS_TOKEN = "access_token";
const MAX_STORED_MESSAGES = 10;

//setup axios
const authenticatedAxios = createAuthenticatedAxios();
function createAuthenticatedAxios() {
  const token = localStorage.getItem(KEY_ACCESS_TOKEN);
  if (token) {
    return axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } else {
    window.location.replace("/auth/login");
    return;
  }
}

//send message
async function sendMessage() {
  const message = document.getElementById("messageInput").value.trim();

  if (!message) return alert("Please enter a message");

  try {
    const token = localStorage.getItem(KEY_ACCESS_TOKEN);

    const response = await authenticatedAxios.post("messages/send-message", {
      message,
    });

    console.log("Message saved:", response.data.data);
    document.getElementById("messageInput").value = "";
  } catch (error) {
    handleError(error);
  }
}

//Render messages on UI
function renderMessages(messages) {
  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML = "";

  messages.forEach((msg) => {
    const messageElement = document.createElement("p");
    messageElement.innerHTML = `You: ${msg.message}`;
    chatBox.appendChild(messageElement);
  });
}

//get all messages
async function fetchMessages() {
  try {
    let storedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    const lastMessageId = localStorage.getItem("lastMessageId") || 0;

    const response = await authenticatedAxios.get(
      `/messages/get-messages?lastMessageId=${lastMessageId}`
    );

    if (response.data.success) {
      let newMessages = response.data.data.messages;

      // Merge new messages on top of old ones available in locastorage
      storedMessages = [...storedMessages, ...newMessages];

      // Keep only the latest MAX_STORED_MESSAGES messages
      if (storedMessages.length > MAX_STORED_MESSAGES) {
        storedMessages = storedMessages.slice(-MAX_STORED_MESSAGES);
      }

      // Save the updated messages in localStorage
      localStorage.setItem("chatMessages", JSON.stringify(storedMessages));

      // Update lastMessageId with the latest message ID
      if (storedMessages.length > 0) {
        localStorage.setItem(
          "lastMessageId",
          storedMessages[storedMessages.length - 1].id
        );
      }

      //Render messages on UI
      renderMessages(storedMessages);
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    alert("Failed to load chat messages");
    handleError(error);
  }
}

//get older messages
async function loadOlderMessages() {
  try {
    let storedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    const oldMessageId = storedMessages.length > 0 ? storedMessages[0].id : 0;
    if (!oldMessageId) return;

    const response = await authenticatedAxios.get(
      `messages/get-older-messages?oldMessageId=${oldMessageId}`
    );

    if (response.data.success) {
      const oldMessages = response.data.data.messages;

      //merge old messages to the localstorage
      storedMessages = [...oldMessages, ...storedMessages];

      // Keep only the limited messages in localstorage
      if (storedMessages.length > MAX_STORED_MESSAGES) {
        storedMessages = storedMessages.slice(0, MAX_STORED_MESSAGES);
      }

      // Save the updated messages in localStorage
      localStorage.setItem("chatMessages", JSON.stringify(storedMessages));

      // Preserve scroll position (so messages don't jump when new ones are added)
      const previousScrollHeight = chatBox.scrollHeight;

      //Render in UI
      renderMessages(storedMessages);

      // Maintain user's scroll position after messages are inserted
      chatBox.scrollTop = chatBox.scrollHeight - previousScrollHeight;
    }
  } catch (error) {
    console.error("Error fetching old messages:", error);
    alert("Failed to load old messages");
    handleError(error);
  }
}

function loadOnRefresh() {
  const storedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
  renderMessages(storedMessages); // Show cached messages instantly
  fetchMessages(); // Then fetch newer messages
}

//Event listeners
document.getElementById("sendBtn").addEventListener("click", sendMessage);
document
  .getElementById("loadMore")
  .addEventListener("click", loadOlderMessages);
document.addEventListener("DOMContentLoaded", loadOnRefresh);
window.addEventListener("scroll", () => {
  const chatBox = document.getElementById("chatBox");

  if (chatBox.scrollTop === 0) {
    // ✅ User scrolled to the top
    loadOlderMessages(); // Fetch older messages
  }
});

//error handling
function handleError(error) {
  if (error.response?.data?.statusCode === 401) {
    localStorage.removeItem(KEY_ACCESS_TOKEN);
    alert(error.response.data.message);
    window.location.replace("auth/login");
  } else {
    console.error("Error:", error);
  }
}
