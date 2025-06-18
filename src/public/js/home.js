//DOM Elements
const elements = {
  createGroupBtn: document.getElementById("createGroupBtn"),
  chatBox: document.getElementById("chatBox"),
  currentGroupName: document.getElementById("currentGroupName"),
  groupList: document.getElementById("groupList"),
  inviteBtn: document.getElementById("inviteBtn"),
  loadMore: document.getElementById("loadMore"),
  messageInput: document.getElementById("messageInput"),
  personalChat: document.getElementById("personal-chat"),
  sendBtn: document.getElementById("sendBtn"),
};

//Event listeners
elements.createGroupBtn.addEventListener("click", createGroup);
elements.inviteBtn.addEventListener("click", inviteToGroup);
elements.sendBtn.addEventListener("click", sendMessage);
elements.loadMore.addEventListener("click", loadOlderMessages);
// elements.personalChat.addEventListener("click", loadOlderMessages);
document.addEventListener("DOMContentLoaded", loadOnRefresh);
window.addEventListener("scroll", () => {
  const chatBox = document.getElementById("chatBox");

  if (chatBox.scrollTop === 0) {
    // ✅ User scrolled to the top
    loadOlderMessages(); // Fetch older messages
  }
});

//Global variables
const KEY_ACCESS_TOKEN = "access_token";
const authenticatedAxios = createAuthenticatedAxios();
let selectedReceiverId = null; // For personal chat
let selectedGroupId = null; // For group chat
let selectedGroupName = "";
const MAX_STORED_MESSAGES = 10;
let isLoadingOlderMessages = false;

//message on localStorage
const getChatStorageKey = () => {
  if (selectedGroupId) return `chatMessages_group_${selectedGroupId}`;
  if (selectedReceiverId) return `chatMessages_dm_${selectedReceiverId}`;
  return `chatMessages_default`;
};
//lastmessageId on localStorage
const getLastMessageIdKey = () => {
  if (selectedGroupId) return `lastMessageId_group_${selectedGroupId}`;
  if (selectedReceiverId) return `lastMessageId_dm_${selectedReceiverId}`;
  return `lastMessageId_default`;
};
const chatKey = getChatStorageKey();
const lastIdKey = getLastMessageIdKey();

//setup axios
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

//create a group
async function createGroup() {
  const name = prompt("Enter group name:");
  if (!name) return;

  const about = prompt("Optional: group description");

  try {
    const response = await authenticatedAxios.post("/groups/create", {
      name,
      about,
    });
    alert("Group created!");
    loadGroups();
  } catch (error) {
    console.error("Failed to create group", error);
    alert("Failed to create group");
  }
}

// invite to the group
async function inviteToGroup() {
  if (!selectedGroupId) {
    alert("Please select a group first.");
    return;
  }

  const email = prompt("Enter email of user to invite:");
  if (!email) return;
  try {
    const response = await authenticatedAxios.post(
      `/groups/invite?email=${encodeURIComponent(
        email
      )}&groupId=${selectedGroupId}`
    );

    alert("User invited successfully!");
  } catch (error) {
    console.error("Invite failed:", error.response.data.message);
    if (error.response.data.statusCode === 404) {
      alert("User not found with the email id");
    } else {
      alert("Failed to invite user");
    }
  }
}

//Load all groups
async function loadGroups() {
  try {
    const response = await authenticatedAxios.get("groups/my-groups");
    elements.groupList.innerHTML = "";

    response.data.data.groups.forEach((group) => {
      const li = document.createElement("li");
      li.textContent = group.name;
      li.onclick = () => selectGroup(group.id, group.name);
      elements.groupList.appendChild(li);
    });
  } catch (error) {
    console.error("Error loading groups", error);
  }
}

//Select a group
function selectGroup(groupId, groupName) {
  selectedGroupId = groupId;
  selectedGroupName = groupName;
  elements.currentGroupName.textContent = groupName;
  loadOnRefresh(); // reload group messages
}

//send message
async function sendMessage() {
  const message = elements.messageInput.value.trim();
  if (!message) return alert("Please enter a message");

  try {
    let url = "messages/send-message";
    let payload = { message };

    if (selectedGroupId) {
      url += `?groupId=${selectedGroupId}`;
    } else if (selectedReceiverId) {
      payload.receiverId = selectedReceiverId;
    }

    const response = await authenticatedAxios.post(url, payload);
    console.log("Message saved:", response.data.data);
    elements.messageInput.value = "";
  } catch (error) {
    handleError(error);
  }
}

//Render messages on UI
function renderMessages(messages) {
  elements.chatBox.innerHTML = "";

  messages.forEach((msg) => {
    const isGroupMessage = selectedGroupId !== null;

    const messageElement = document.createElement("p");
    let senderName = msg.Sender?.name || "You";
    senderName = senderName.split(" ")[0];

    messageElement.innerHTML = isGroupMessage
      ? `<strong>${senderName}:</strong> ${msg.message}`
      : `You: ${msg.message}`;

    elements.chatBox.appendChild(messageElement);
  });
}

//get all messages
async function fetchMessages() {
  try {
    const chatKey = getChatStorageKey();
    const lastIdKey = getLastMessageIdKey();

    let storedMessages = JSON.parse(localStorage.getItem(chatKey)) || [];
    const lastMessageId = localStorage.getItem(lastIdKey) || 0;

    let url = `/messages/get-messages?lastMessageId=${lastMessageId}`;
    if (selectedGroupId) {
      url += `&groupId=${selectedGroupId}`;
    } else if (selectedReceiverId) {
      url += `&receiverId=${selectedReceiverId}`;
    }

    const response = await authenticatedAxios.get(url);

    if (response.data.success) {
      let newMessages = response.data.data.messages;

      // Merge new messages on top of old ones available in locastorage
      storedMessages = [...storedMessages, ...newMessages];

      // Keep only the latest MAX_STORED_MESSAGES messages
      if (storedMessages.length > MAX_STORED_MESSAGES) {
        storedMessages = storedMessages.slice(-MAX_STORED_MESSAGES);
      }

      // Save the updated messages in localStorage
      localStorage.setItem(chatKey, JSON.stringify(storedMessages));

      // Update lastMessageId with the latest message ID
      if (storedMessages.length > 0) {
        localStorage.setItem(
          lastIdKey,
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
    if (isLoadingOlderMessages) return; // Prevent duplicate calls
    isLoadingOlderMessages = true;

    const chatKey = getChatStorageKey();
    let storedMessages = JSON.parse(localStorage.getItem(chatKey)) || [];

    const oldMessageId = storedMessages.length > 0 ? storedMessages[0].id : 0;
    if (!oldMessageId) {
      isLoadingOlderMessages = false;
      return;
    }

    let url = `messages/get-older-messages?oldMessageId=${oldMessageId}`;
    if (selectedGroupId) {
      url += `&groupId=${selectedGroupId}`;
    } else if (selectedReceiverId) {
      url += `&receiverId=${selectedReceiverId}`;
    }

    const response = await authenticatedAxios.get(url);

    if (response.data.success) {
      const oldMessages = response.data.data.messages;

      //merge old messages to the localstorage
      storedMessages = [...oldMessages, ...storedMessages];

      // Keep only the limited messages in localstorage
      if (storedMessages.length > MAX_STORED_MESSAGES) {
        storedMessages = storedMessages.slice(0, MAX_STORED_MESSAGES).reverse();
      }

      // Save the updated messages in localStorage
      localStorage.setItem(chatKey, JSON.stringify(storedMessages));

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
  } finally {
    isLoadingOlderMessages = false;
  }
}

function loadOnRefresh() {
  loadGroups();
  const messages = JSON.parse(localStorage.getItem(getChatStorageKey())) || [];
  renderMessages(messages);
  fetchMessages(); // Then fetch newer messages
}

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
