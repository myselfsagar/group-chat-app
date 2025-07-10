//Socket
const socket = io("http://localhost:5000");

//DOM Elements
const elements = {
  createGroupBtn: document.getElementById("createGroupBtn"),
  chatBox: document.getElementById("chatBox"),
  currentGroupName: document.getElementById("currentGroupName"),
  fileInput: document.getElementById("fileInput"),
  groupList: document.getElementById("groupList"),
  inviteBtn: document.getElementById("inviteBtn"),
  loadMore: document.getElementById("loadMore"),
  memberList: document.getElementById("memberList"),
  messageInput: document.getElementById("messageInput"),
  personalChat: document.getElementById("personal-chat"),
  sendBtn: document.getElementById("sendBtn"),
};

//Event listeners
elements.createGroupBtn.addEventListener("click", createGroup);
elements.currentGroupName.addEventListener("click", handleGroupNameClick);
elements.fileInput.addEventListener("change", handleFileUpload);
elements.messageInput.addEventListener("keydown", handleMessageInput);
elements.inviteBtn.addEventListener("click", inviteToGroup);
elements.sendBtn.addEventListener("click", sendMessage);
elements.loadMore.addEventListener("click", loadOlderMessages);
// elements.personalChat.addEventListener("click", loadOlderMessages);
document.addEventListener("DOMContentLoaded", loadOnRefresh);
// window.addEventListener("scroll", () => {
//   const chatBox = document.getElementById("chatBox");

//   if (chatBox.scrollTop === 0) {
//     // ✅ User scrolled to the top
//     loadOlderMessages(); // Fetch older messages
//   }
// });

//Global variables
const KEY_ACCESS_TOKEN = "access_token";
const authenticatedAxios = createAuthenticatedAxios();
let currentUserId = null;
let currentUserName = null;
let currentUserIsAdmin = false;
let isViewingMembers = false;
let pendingFile = null;
let selectedReceiverId = null; // For personal chat
let selectedGroupId = null; // For group chat
let selectedGroupName = "";
const MAX_STORED_MESSAGES = 20;
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
    await loadGroups();

    selectGroup(response.data.data.group.id, name);
    socket.emit("join_room", {
      groupId: response.data.data.group.id,
    });
  } catch (error) {
    handleError(error);
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
      li.onclick = () => {
        selectGroup(group.id, group.name);
        socket.emit("join_room", {
          groupId: group.id,
        });
      };

      elements.groupList.appendChild(li);
    });
  } catch (error) {
    handleError(error);
  }
}

//Select a group
function selectGroup(groupId, groupName) {
  selectedGroupId = groupId;
  selectedGroupName = groupName;
  elements.currentGroupName.textContent = groupName;
  loadOnRefresh(); // reload group messages
}

function handleGroupNameClick() {
  if (!selectedGroupId) return;

  isViewingMembers = !isViewingMembers;

  if (isViewingMembers) {
    // Hide chat, show members
    elements.chatBox.style.display = "none";
    elements.loadMore.style.display = "none";
    elements.messageInput.parentElement.style.display = "none";
    loadGroupMembers(selectedGroupId);
  } else {
    // Show chat, hide members
    elements.chatBox.style.display = "block";
    elements.loadMore.style.display = "block";
    elements.messageInput.parentElement.style.display = "";
    elements.memberList.innerHTML = "";
  }
}

//Load all group members
async function loadGroupMembers(groupId) {
  try {
    const response = await authenticatedAxios.get(`/groups/${groupId}/members`);
    const members = response.data.data.members;

    // Determine if current user is admin
    const me = members.find((m) => m.user.id === currentUserId);
    currentUserIsAdmin = me?.isAdmin || false;

    renderMemberList(members);
  } catch (error) {
    handleError(error);
  }
}

function renderMemberList(members) {
  const list = document.getElementById("memberList");
  list.innerHTML = "";

  members.forEach((entry) => {
    const { id, name, email } = entry.user;
    const isAdmin = entry.isAdmin;

    const li = document.createElement("li");
    li.className = "member-item";

    const nameSpan = document.createElement("span");
    nameSpan.innerHTML = `<strong>${name}</strong> <small>(${email})</small> ${
      isAdmin ? "👑" : ""
    }`;
    li.appendChild(nameSpan);

    if (currentUserIsAdmin && id !== currentUserId) {
      //  Add "Make Admin" if not already admin
      if (!isAdmin) {
        const makeAdminBtn = document.createElement("button");
        makeAdminBtn.textContent = "Make Admin";
        makeAdminBtn.onclick = () => makeUserAdmin(id);
        li.appendChild(makeAdminBtn);
      }

      // Always show "Remove"
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.onclick = () => removeUserFromGroup(id);
      li.appendChild(removeBtn);
    }

    list.appendChild(li);
  });
}

async function makeUserAdmin(userId) {
  try {
    await authenticatedAxios.post(`/groups/makeAdmin`, {
      userId,
      groupId: selectedGroupId,
    });
    alert("User promoted to admin");
    await loadGroupMembers(selectedGroupId);
  } catch (error) {
    handleError(error);
  }
}

async function removeUserFromGroup(userId) {
  try {
    await authenticatedAxios.post(`/groups/remove`, {
      userId,
      groupId: selectedGroupId,
    });
    alert("User has been removed from the group");
    await loadGroupMembers(selectedGroupId);
  } catch (error) {
    handleError(error);
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
    await loadGroupMembers(selectedGroupId);
  } catch (error) {
    handleError(error);
  }
}

function handleMessageInput(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

//send message
async function sendMessage() {
  const message = elements.messageInput.value.trim();

  // If a file is selected, send the file
  if (pendingFile && selectedGroupId) {
    const formData = new FormData();
    formData.append("file", pendingFile);

    try {
      const response = await authenticatedAxios.post(
        `/messages/send-file?groupId=${selectedGroupId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const msgData = response.data.data;

      socket.emit("send_message", {
        ...msgData,
        roomId: selectedGroupId,
      });

      // Optionally clear the input and pending file
      elements.fileInput.value = "";
      pendingFile = null;
    } catch (error) {
      handleError(error);
    }
    return; // Do not send text message if file is sent
  }

  // Otherwise, send the text message
  if (!message) return;

  try {
    let url = "messages/send-message";
    let payload = { message };

    if (selectedGroupId) {
      url += `?groupId=${selectedGroupId}`;
    } else if (selectedReceiverId) {
      payload.receiverId = selectedReceiverId;
    } else {
      return;
    }

    await authenticatedAxios.post(url, payload);

    //socket
    socket.emit("send_message", {
      roomId: selectedGroupId,
      message,
      senderId: currentUserId,
      name: currentUserName,
    });
    // socket.on("receive_message", (msg) => {
    //   addMessageToUI(msg);
    // });

    elements.messageInput.value = "";

    // fetchMessages();
  } catch (error) {
    handleError(error);
  }
}

async function handleFileUpload(e) {
  pendingFile = e.target.files[0] || null;
}

//Add message to UI
// function addMessageToUI(msg) {
//   const isGroupMessage = selectedGroupId !== null;

//   if (msg.isSystem) {
//     const systemMsg = document.createElement("p");
//     systemMsg.textContent = msg.message;
//     systemMsg.className = "system-message";
//     elements.chatBox.appendChild(systemMsg);
//     return;
//   }

//   if (msg.isFile) {
//     const link = document.createElement("a");
//     link.href = msg.message;
//     link.textContent = "📁 Download File";
//     link.target = "_blank";
//     elements.chatBox.appendChild(link);
//     return;
//   }

//   const messageElement = document.createElement("p");

//   let senderName;
//   if (msg.senderId === currentUserId) {
//     senderName = "You";
//   } else {
//     senderName = msg.name;
//   }

//   messageElement.innerHTML = isGroupMessage
//     ? `<strong>${senderName}:</strong> ${msg.message}`
//     : `You: ${msg.message}`;

//   elements.chatBox.appendChild(messageElement);
// }
function addMessageToUI(msg) {
  const isGroupMessage = selectedGroupId !== null;

  if (msg.isSystem) {
    const systemMsg = document.createElement("p");
    systemMsg.textContent = msg.message;
    systemMsg.style.textAlign = "center";
    systemMsg.style.color = "gray";
    systemMsg.style.fontStyle = "italic";
    elements.chatBox.appendChild(systemMsg);
    return;
  }

  const messageElement = document.createElement("div");
  messageElement.style.marginBottom = "10px";

  // File preview
  if (msg.isFile) {
    const url = msg.message;
    const extension = url.split(".").pop().toLowerCase();

    const senderName =
      msg.senderId === currentUserId
        ? "You"
        : msg.name || (msg.Sender && msg.Sender.name) || "User";
    const label = document.createElement("p");
    label.innerHTML = isGroupMessage
      ? `<strong>${senderName}:</strong>`
      : `You:`;
    label.style.marginBottom = "4px";
    messageElement.appendChild(label);

    // then append image/video/link as you're doing

    if (["png", "jpg", "jpeg", "gif", "webp"].includes(extension)) {
      const img = document.createElement("img");
      img.src = url;
      img.style.maxWidth = "250px";
      img.style.borderRadius = "8px";
      messageElement.appendChild(img);
    } else if (["mp4", "webm", "ogg"].includes(extension)) {
      const video = document.createElement("video");
      video.src = url;
      video.controls = true;
      video.style.maxWidth = "250px";
      messageElement.appendChild(video);
    } else {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.textContent = "📎 Download File";
      messageElement.appendChild(link);
    }

    elements.chatBox.appendChild(messageElement);
    return;
  }

  // Normal text message
  const senderName =
    msg.senderId === currentUserId
      ? "You"
      : msg.name || (msg.Sender && msg.Sender.name) || "User";
  messageElement.innerHTML = isGroupMessage
    ? `<strong>${senderName}:</strong> ${msg.message}`
    : `You: ${msg.message}`;

  elements.chatBox.appendChild(messageElement);
}

//Render messages on UI
function renderMessages(messages) {
  elements.chatBox.innerHTML = "";
  messages.forEach(addMessageToUI);
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
    handleError(error);
  } finally {
    isLoadingOlderMessages = false;
  }
}

socket.on("receive_message", (msg) => {
  addMessageToUI(msg);
});

async function loadOnRefresh() {
  await fetchCurrentUserId();

  loadGroups();
  const messages = JSON.parse(localStorage.getItem(getChatStorageKey())) || [];
  renderMessages(messages);
  fetchMessages(); // Then fetch newer messages
}

async function fetchCurrentUserId() {
  try {
    const res = await authenticatedAxios.get("/users/me");
    currentUserId = res.data.data.user.id;
    currentUserName = res.data.data.user.name;
  } catch (error) {
    handleError(error);
  }
}
function handleError(error) {
  if (error.response?.data?.statusCode === 401) {
    localStorage.removeItem(KEY_ACCESS_TOKEN);
    alert(error.response.data.message);
    window.location.replace("auth/login");
  } else {
    alert(error.response.data.message);
    console.error(error.response.data.message, error);
  }
}
