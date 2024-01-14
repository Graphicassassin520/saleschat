// JavaScript code for your Sales Chat App

document.addEventListener("DOMContentLoaded", function () {
    const messageInput = document.getElementById("message-input");
    const imageInput = document.getElementById("image-input");
    const sendButton = document.getElementById("send-button");
    const messagesContainer = document.getElementById("messages");
    const usernameInput = document.getElementById("username-input");
    const passwordInput = document.getElementById("password-input");
    const loginButton = document.getElementById("login-button");
    const statusElement = document.getElementById("status");
    const onlineUsersList = document.getElementById("online-users");

    // Create a WebSocket connection (change the URL to your WebSocket server)
    const socket = new WebSocket("ws://your-websocket-server-url");

    // Create a variable to store the current user's username and avatar (for demonstration purposes)
    let currentUser = null;
    let currentUserAvatar = "avatar.png"; // Replace with the URL to the user's avatar

    // Function to add a message to the chat
    function addMessage(messageText, isCurrentUser, avatar) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.classList.toggle("current-user", isCurrentUser);

        if (avatar) {
            const avatarElement = document.createElement("img");
            avatarElement.classList.add("avatar");
            avatarElement.src = avatar;
            messageElement.appendChild(avatarElement);
        }

        messageElement.innerHTML += messageText;
        messagesContainer.appendChild(messageElement);
    }

    // Function to handle sending a message
    function sendMessage() {
        const messageText = messageInput.value.trim();
        const selectedFile = imageInput.files[0];

        if (messageText || selectedFile) {
            const formData = new FormData();

            if (selectedFile) {
                formData.append("image", selectedFile);
            }

            // Send the message (text or image) to the WebSocket server
            formData.append("user", currentUser);
            formData.append("message", messageText);

            socket.send(JSON.stringify({ user: currentUser, message: messageText }));

            // Clear the input fields
            messageInput.value = "";
            imageInput.value = null;
        }
    }

    // Event listener for the Send button
    sendButton.addEventListener("click", sendMessage);

    // Event listener for pressing Enter key in the message input
    messageInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    // Event listener for selecting an image
    imageInput.addEventListener("change", function () {
        const selectedFile = imageInput.files[0];

        if (selectedFile) {
            const reader = new FileReader();

            reader.onload = function (event) {
                // Display the selected image as a message
                const imageSrc = event.target.result;
                addMessage(`<img src="${imageSrc}" alt="User Image" />`, true, currentUserAvatar);

                // Scroll to the bottom to show the latest message
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            };

            reader.readAsDataURL(selectedFile);
        }
    });

    // Event listener for the Log In button
    loginButton.addEventListener("click", function () {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (username && password) {
            // Simulate a basic username and password authentication
            // In a real application, use secure authentication methods
            if (username === "demo" && password === "password") {
                // Save the current user's username
                currentUser = username;

                // Update the user status
                statusElement.textContent = `Status: Online (${currentUser})`;

                // Hide the login section and display the chat
                document.querySelector(".user-login").style.display = "none";
                document.querySelector(".chat-container").style.display = "block";
            } else {
                alert("Invalid username or password. Please try again.");
            }

            // Clear the password input
            passwordInput.value = "";
        }
    });

    // Event listener for WebSocket messages
    socket.addEventListener("message", function (event) {
        const messageData = JSON.parse(event.data);

        // Display the received message in the chat
        addMessage(`${messageData.user}: ${messageData.message}`, false);

        // Scroll to the bottom to show the latest message
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Update the list of online users
        updateOnlineUsers(messageData.onlineUsers);
    });

    // Event listener for WebSocket connection errors
    socket.addEventListener("error", function (event) {
        console.error("WebSocket error:", event);
    });

    // Close the WebSocket connection when the page is unloaded
    window.addEventListener("beforeunload", function () {
        socket.close();
    });

    // Function to update the list of online users
    function updateOnlineUsers(onlineUsers) {
        onlineUsersList.innerHTML = ""; // Clear the list

        onlineUsers.forEach((user) => {
            const listItem = document.createElement("li");
            listItem.textContent = user;
            onlineUsersList.appendChild(listItem);
        });
    }
});
