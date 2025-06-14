const KEY_ACCESS_TOKEN = "access_token";

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

//get all messages
async function fetchMessages() {
  try {
    const response = await authenticatedAxios.get("/messages/get-messages");

    if (response.data.success) {
      const messages = response.data.data.messages;
      const chatBox = document.getElementById("chatBox");
      chatBox.innerHTML = "";
      messages.forEach((msg) => {
        const messageElement = document.createElement("p");
        messageElement.innerHTML = `You: ${msg.message}`;
        chatBox.appendChild(messageElement);
      });
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    alert("Failed to load chat messages");
    handleError(error);
  }
}

//Event listeners
document.getElementById("sendBtn").addEventListener("click", sendMessage);
document.addEventListener("DOMContentLoaded", fetchMessages);

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
