const btn = document.getElementById("chat-button");
const widget = document.getElementById("chat-widget");
const chatBody = document.getElementById("chat-body");
const minimizeBtn = document.getElementById("minimize-chat");
const botOptions = document.getElementById("bot-options");
const quickOptions = document.getElementById("quick-options");
const userInput = document.getElementById("user-input");

// Debug: Check if elements are found
console.log("Chat button found:", !!btn);
console.log("Minimize button found:", !!minimizeBtn);
console.log("Widget found:", !!widget);
console.log("Initial widget state:", widget ? widget.classList.contains("hidden") : "widget not found");

btn.onclick = (e) => {
  e.preventDefault();
  console.log("Chat button clicked, current state:", widget.classList.contains("hidden"));
  
  if (widget.classList.contains("hidden")) {
    // Show the chat widget
    widget.classList.remove("hidden");
    userInput.focus();
    console.log("Showing chat widget");
  } else {
    // Hide the chat widget
    widget.classList.add("hidden");
    console.log("Hiding chat widget");
  }
};

// Handle minimize button click
function minimizeChat() {
  console.log("Minimizing chat widget");
  if (widget) {
    widget.classList.add("hidden");
  }
}

// Add event listener for minimize button
if (minimizeBtn) {
  minimizeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Minimize button clicked");
    minimizeChat();
  });
} else {
  console.error("Minimize button not found!");
}

let step = 0;
let userData = {};
let hasSelectedOption = false;

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = "message " + sender;
  msg.innerText = text;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function showTyping() {
  const typing = document.createElement("div");
  typing.className = "typing";
  typing.id = "typing";
  
  const dotsContainer = document.createElement("div");
  dotsContainer.className = "typing-dots";
  
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("div");
    dot.className = "typing-dot";
    dotsContainer.appendChild(dot);
  }
  
  typing.appendChild(dotsContainer);
  chatBody.appendChild(typing);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

function selectBotOption(option) {
  hasSelectedOption = true;
  botOptions.classList.add("hidden");
  quickOptions.classList.remove("hidden");
  
  let message = "";
  switch(option) {
    case 'ask_question':
      message = "ask_question";
      break;
    case 'contact_sales':
      message = "contact_sales";
      break;
    case 'learn_more':
      message = "learn_more";
      break;
  }
  
  addMessage(message, "user");
  handleBot(message);
}

function quickReply(text) {
  addMessage(text, "user");
  handleBot(text);
}

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;
  
  addMessage(text, "user");
  userInput.value = "";

  if (step === 1) {
    userData.name = text;
    addMessage("Nice to meet you " + text + "! Please share your email.", "bot");
    step = 2;
  } else if (step === 2) {
    userData.email = text;
    addMessage("Thanks! Our team will contact you soon.", "bot");

    fetch("http://127.0.0.1:5000/save-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    step = 0;
  } else {
    handleBot(text);
  }
}

async function handleBot(text) {
  showTyping();

  try {
    const response = await fetch("http://127.0.0.1:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();

    setTimeout(() => {
      removeTyping();
      addMessage(data.reply, "bot");
      
      if (data.reply.includes("name") || data.reply.includes("share your name")) {
        step = 1;
      }
    }, 700);
  } catch (error) {
    setTimeout(() => {
      removeTyping();
      addMessage("Sorry, I'm having trouble connecting. Please try again.", "bot");
    }, 700);
  }
}

// Enter key to send message
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// Mobile menu toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Initialize chat with welcome message
window.addEventListener('load', () => {
  setTimeout(() => {
    if (!hasSelectedOption) {
      addMessage("Hello! 👋 I'm here to help you. What would you like to do today?\n\n💬 Ask a Question\n📞 Contact Sales\nℹ️ Learn More", "bot");
    }
  }, 1000);
});

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
  } else {
    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
  }
});
