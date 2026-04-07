import { db, collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit, startAfter, endBefore } from './firestore.js';

const messageForm = document.getElementById('messageForm');
const messageBoard = document.getElementById('messageBoard');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const loadPrevBtn = document.getElementById('loadPrevBtn');
const woodBackgrounds = ['wood_bg1.jpg', 'wood_bg2.jpg', 'wood_bg3.jpg'];
const forbiddenWords = ['badword1', 'badword2', 'slur1'];

// Pagination variables
let lastVisible = null;
let firstVisible = null;

// Handle Form Submission
messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let rawUsername = document.getElementById('user').value || "Anonymous";
    let rawMessage = document.getElementById('text').value;

    // 1. Sanitize for Security
    const cleanUsername = sanitizeInput(rawUsername);
    const cleanMessage = sanitizeInput(rawMessage);

    // 2. Check for Profanity
    if (containsProfanity(cleanUsername) || containsProfanity(cleanMessage)) {
        alert("Please keep your wishes respectful. Offensive language is not allowed.");
        return; // Stop the function here
    }

    try {
        await addDoc(collection(db, "wishes"), {
            userName: cleanUsername,
            text: cleanMessage,
            createdAt: serverTimestamp()
        });
        
        messageForm.reset();
        alert("Your wish has been placed!");
    } catch (error) {
        console.error("Error:", error);
    }
});

function sanitizeInput(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML; // Converts < to &lt; and > to &gt;
}

function containsProfanity(str) {
    // The "i" flag makes it case-insensitive
    // The "\b" ensures it only catches whole words (not "grass" in "degreass")
    const pattern = new RegExp(`\\b(${forbiddenWords.join('|')})\\b`, 'i');
    return pattern.test(str);
}

// Resizing the message rendered on the plaque based on length
function getFontSize(text) {
    const length = text.length;
    if (length > 200) return '12px';
    if (length > 100) return '14px';
    return '16px'; // default size
}

async function loadWishes(cursor = null, direction = 'initial') {
    let q;
    if (direction === 'next' && cursor) {
        q = query(collection(db, "wishes"), orderBy("createdAt", "desc"), startAfter(cursor), limit(10));
    } else if (direction === 'prev' && cursor) {
        q = query(collection(db, "wishes"), orderBy("createdAt", "desc"), endBefore(cursor), limit(10));
    } else {
        q = query(collection(db, "wishes"), orderBy("createdAt", "desc"), limit(10));
    }
    const querySnapshot = await getDocs(q);
    
    // Clear the board before rendering
    messageBoard.innerHTML = '';

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Debugging log
        // console.log("Message data:", data); 
        // 1. Create the plaque container
        const plaque = document.createElement('div');
        plaque.className = 'ema-plaque';
        
        // 2. Randomize the background image
        const randomBg = woodBackgrounds[Math.floor(Math.random() * woodBackgrounds.length)];
        plaque.style.backgroundImage = `url('./assets/ema/${randomBg}')`;

        // 3. Convert Firestore Timestamp to readable date
        const date = data.createdAt?.toDate().toLocaleDateString() || "Unknown Date";

        // 4. Set the internal HTML
        plaque.innerHTML = `
            <div class="plaque-content">
                <span class="plaque-date">${date}</span>
                <p class="plaque-text" style="font-size: ${getFontSize(data.text)}">"${data.text}"</p>
                <span class="plaque-user">- ${data.userName}</span>
            </div>
        `;

        messageBoard.appendChild(plaque);
    });

    // Update pagination cursors
    if (!querySnapshot.empty) {
        firstVisible = querySnapshot.docs[0];
        lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    } else {
        firstVisible = null;
        lastVisible = null;
    }

    // Update button states based on direction and results
    if (direction === 'initial') {
        loadPrevBtn.disabled = true;
        loadMoreBtn.disabled = querySnapshot.size < 10;
    } else if (direction === 'next') {
        loadPrevBtn.disabled = false;
        loadMoreBtn.disabled = querySnapshot.size < 10;
    } else if (direction === 'prev') {
        loadPrevBtn.disabled = querySnapshot.size < 10;
        loadMoreBtn.disabled = false;
    }
}

// Call this when the page loads
function onPageLoad() {
    loadWishes();
}

// Event listeners for pagination buttons
loadMoreBtn.addEventListener('click', () => {
    if (!loadMoreBtn.disabled && lastVisible) {
        loadWishes(lastVisible, 'next');
    }
});

loadPrevBtn.addEventListener('click', () => {
    if (!loadPrevBtn.disabled && firstVisible) {
        loadWishes(firstVisible, 'prev');
    }
});

onPageLoad();
