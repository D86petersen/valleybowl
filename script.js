// Initialize Lucide Icons
lucide.createIcons();

// Set Current Year
document.getElementById('year').textContent = new Date().getFullYear();

// Gemini API Configuration
const apiKey = ""; // Automatically provided by environment

// Navigation Scroll Effect
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const logoText = document.getElementById('logo-text');

// Helper to check if a link is active
function isLinkActive(link) {
    // Check if the link has the text-red-400 class manually added (for subpages)
    return link.classList.contains('text-red-400') && !link.classList.contains('hover:text-red-400');
}

window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.classList.remove('transparent-nav');
        navbar.classList.add('scrolled-nav');
        logoText.classList.remove('drop-shadow-md');
        
        navLinks.forEach(link => {
            if (!isLinkActive(link)) {
                link.classList.remove('drop-shadow-sm', 'text-white');
                link.classList.add('text-gray-200');
            }
        });
    } else {
        navbar.classList.add('transparent-nav');
        navbar.classList.remove('scrolled-nav');
        logoText.classList.add('drop-shadow-md');
        
        navLinks.forEach(link => {
            if (!isLinkActive(link)) {
                link.classList.add('drop-shadow-sm', 'text-white');
                link.classList.remove('text-gray-200');
            }
        });
    }
});

// Mobile Menu Logic
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');
const mobileLinks = document.querySelectorAll('.mobile-link');
let isMenuOpen = false;

mobileMenuBtn.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
        mobileMenu.classList.remove('hidden');
        menuIcon.setAttribute('data-lucide', 'x');
    } else {
        mobileMenu.classList.add('hidden');
        menuIcon.setAttribute('data-lucide', 'menu');
    }
    lucide.createIcons();
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        isMenuOpen = false;
        mobileMenu.classList.add('hidden');
        menuIcon.setAttribute('data-lucide', 'menu');
        lucide.createIcons();
    });
});

function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// --- GEMINI API LOGIC ---

async function callGemini(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ parts: [{ text: prompt }] }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Sorry, I'm having trouble connecting to the lanes right now. Try again later!";
    }
}

// --- FEATURE 1: AI Party Planner ---

async function generatePartyPlan() {
    const typeSelect = document.getElementById('event-type');
    const eventType = typeSelect.value;
    const messageBox = document.getElementById('contact-message');
    const btn = document.getElementById('ai-plan-btn');

    if (!eventType) {
        alert("Please select an event type first!");
        typeSelect.focus();
        return;
    }

    // UI Loading State
    const originalBtnText = btn.innerHTML;
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Planning...`;
    btn.disabled = true;

    const prompt = `Create a fun, brief party itinerary for a "${eventType}" at Valley Bowl Madera (a bowling alley). 
    Suggest a schedule (e.g. "Arrive & Shoes", "Bowling", "Food"). 
    Suggest specific food items from a typical bowling menu (Pizza, Nachos, Burgers, Soda Pitchers). 
    Keep it under 150 words. Format it as a message I can send to the alley to book it.`;

    const plan = await callGemini(prompt);

    // Typewriter effect for the textarea
    messageBox.value = "";
    let i = 0;
    const speed = 10; 
    function typeWriter() {
        if (i < plan.length) {
            messageBox.value += plan.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }
    typeWriter();

    // Reset Button
    btn.innerHTML = originalBtnText;
    lucide.createIcons();
    btn.disabled = false;
}


// --- FEATURE 2: AI Bowling Coach Chat ---

const chatWindow = document.getElementById('chat-window');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
let isChatOpen = false;

function toggleChat() {
    isChatOpen = !isChatOpen;
    if (isChatOpen) {
        chatWindow.classList.remove('hidden');
        chatInput.focus();
    } else {
        chatWindow.classList.add('hidden');
    }
}

function addMessage(text, sender) {
    const isUser = sender === 'user';
    
    const msgDiv = document.createElement('div');
    msgDiv.className = `flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`;

    const avatar = document.createElement('div');
    avatar.className = `w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-red-100' : 'bg-blue-100'}`;
    
    // Manually creating SVG string for Lucide icons to avoid async issues with createIcons
    if (isUser) {
        avatar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    } else {
        avatar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`;
    }

    const contentDiv = document.createElement('div');
    contentDiv.className = `flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 shadow-sm ${isUser ? 'bg-red-50 rounded-s-xl rounded-ee-xl' : 'bg-white rounded-e-xl rounded-es-xl'}`;
    
    const textP = document.createElement('p');
    textP.className = "text-sm font-normal text-gray-900";
    textP.innerText = text;

    contentDiv.appendChild(textP);
    msgDiv.appendChild(avatar);
    msgDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addLoadingIndicator() {
    const msgDiv = document.createElement('div');
    msgDiv.id = "loading-msg";
    msgDiv.className = "flex items-start gap-2.5";
    msgDiv.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
        </div>
        <div class="flex flex-col w-full max-w-[100px] leading-1.5 p-4 border-gray-200 bg-white rounded-e-xl rounded-es-xl shadow-sm">
                <div class="flex space-x-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
            </div>
        </div>
    `;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeLoadingIndicator() {
    const loader = document.getElementById('loading-msg');
    if (loader) loader.remove();
}

async function handleChatSubmit(e) {
    e.preventDefault();
    const userText = chatInput.value.trim();
    if (!userText) return;

    addMessage(userText, 'user');
    chatInput.value = '';
    addLoadingIndicator();

    const prompt = `You are a friendly, encouraging bowling coach at Valley Bowl Madera. 
    Keep your answers short (under 2 sentences) and fun. 
    The user asks: "${userText}". 
    If they ask about the location, we are at 12829 Highway 145, Madera, CA.
    If they ask about prices, refer them to the Rates section.`;

    const reply = await callGemini(prompt);
    
    removeLoadingIndicator();
    addMessage(reply, 'bot');
}