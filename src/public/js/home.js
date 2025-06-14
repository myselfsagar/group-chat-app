const KEY_ACCESS_TOKEN = "access_token";
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

document.getElementById("sendBtn").addEventListener("click", async () => {
  const message = document.getElementById("messageInput").value.trim();

  if (!message) return alert("Please enter a message");

  try {
    const token = localStorage.getItem(KEY_ACCESS_TOKEN);

    const response = await authenticatedAxios.post("send-message", {
      message,
    });

    console.log("Message saved:", response.data.data);
    document.getElementById("messageInput").value = "";
  } catch (error) {
    handleError(error);
  }
});

function handleError(error) {
  if (error.response?.data?.statusCode === 401) {
    localStorage.removeItem(KEY_ACCESS_TOKEN);
    alert(error.response.data.message);
    window.location.replace("auth/login");
  } else {
    console.error("Error:", error);
  }
}
