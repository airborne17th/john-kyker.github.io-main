import { db, collection, getDocs, addDoc, doc, deleteDoc, query, where } from './firestore.js';

const currencySymbols = {
    USD: '$',
    CAD: 'C$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: 'CN¥'
};

const today = new Date().toISOString().split('T')[0];
document.getElementById('spending-entry-date').value = today;
document.getElementById('income-entry-date').value = today;

let currentUser = localStorage.getItem('budgetAppUser') || null;
let currentCurrency = localStorage.getItem('budgetAppCurrency') || 'USD';

async function loginUser(userId, password) {
    // Query to check if user exists
    const userQuery = query(collection(db, 'Users'), where('username', '==', userId));
    const userSnapshot = await getDocs(userQuery);
    
    if (userSnapshot.empty) {
        alert('User not found. Please sign up first.');
        return false;
    }
    
    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    
    if (userData.password !== password) {
        alert('Incorrect password.');
        return false;
    }
    
    // Set session
    currentUser = userId;
    currentCurrency = userData.currency || 'USD';
    localStorage.setItem('budgetAppUser', userId);
    localStorage.setItem('budgetAppCurrency', currentCurrency);
    updateAuthUI();
    loadData();
    return true;
}

async function registerUser(userId, password, currency = 'USD') {
    // Check if user already exists
    const userQuery = query(collection(db, 'Users'), where('username', '==', userId));
    const userSnapshot = await getDocs(userQuery);
    
    if (!userSnapshot.empty) {
        alert('User already exists. Please login instead.');
        return false;
    }
    
    try {
        await addDoc(collection(db, 'Users'), { username: userId, password, currency });
        alert('User registered.');
        
        // Set session after registration
        currentUser = userId;
        currentCurrency = currency;
        localStorage.setItem('budgetAppUser', userId);
        localStorage.setItem('budgetAppCurrency', currency);
        updateAuthUI();
        loadData();
        return true;
    } catch (err) {
        console.error('Failed to register user', err);
        alert('Could not register user.');
        return false;
    }
}

function clearSession() {
    currentUser = null;
    localStorage.removeItem('budgetAppUser');
    updateAuthUI();
    clearLists();
}

function updateAuthUI() {
    const authSection = document.getElementById('authSection');
    const registerSection = document.getElementById('RegisterContainer');
    const appSection = document.getElementById('appSection');
    const userInfo = document.getElementById('userInfo');

    if (!authSection || !registerSection || !appSection) return;

    if (currentUser) {
        authSection.style.display = 'none';
        registerSection.style.display = 'none';
        appSection.style.display = 'block';
        if (userInfo) userInfo.textContent = `Logged in as: ${currentUser}`;
    } else {
        authSection.style.display = 'block';
        registerSection.style.display = 'block';
        appSection.style.display = 'none';
        if (userInfo) userInfo.textContent = '';
    }
}

function clearLists() {
    document.getElementById('expenses-list').innerHTML = '';
    document.getElementById('incomes-list').innerHTML = '';
    document.getElementById('totalExpenses').textContent = '0';
    document.getElementById('totalIncome').textContent = '0';
    document.getElementById('netBudget').textContent = '0';
}

async function addExpense() {
    if (!currentUser) {
        alert('Please login first to add expenses.');
        return;
    }

    const date = document.getElementById('spending-entry-date').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid expense amount.');
        return;
    }

    const expense = {
        date,
        amount,
        userid: currentUser,
    };

    try {
        await addDoc(collection(db, 'Expense'), expense);
        alert('Expense saved.');
        loadData();
    } catch (err) {
        console.error('Failed to save expense', err);
        alert('Could not save expense.');
    }
}

async function addIncome() {
    if (!currentUser) {
        alert('Please login first to add incomes.');
        return;
    }

    const date = document.getElementById('income-entry-date').value;
    const amount = parseFloat(document.getElementById('income-amount').value);
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid income amount.');
        return;
    }

    const income = {
        date,
        amount,
        userid: currentUser,
    };

    try {
        await addDoc(collection(db, 'Income'), income);
        alert('Income saved.');
        loadData();
    } catch (err) {
        console.error('Failed to save income', err);
        alert('Could not save income.');
    }
}



async function loadData() {
    if (!currentUser) {
        clearLists();
        return;
    }

    const expenseQuery = query(collection(db, 'Expense'), where('userid', '==', currentUser));
    const incomeQuery = query(collection(db, 'Income'), where('userid', '==', currentUser));

    const expenseSnapshot = await getDocs(expenseQuery);
    const incomeSnapshot = await getDocs(incomeQuery);

    const expenses = expenseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const incomes = incomeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    renderEntries('expenses-list', 'Expense', expenses);
    renderEntries('incomes-list', 'Income', incomes);

    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalIncome = incomes.reduce((sum, i) => sum + (i.amount || 0), 0);
    const netBudget = totalIncome - totalExpenses;

    document.getElementById('totalExpenses').textContent = `${currencySymbols[currentCurrency] || '$'}${(Math.round(totalExpenses * 100) / 100).toFixed(2)}`;
    document.getElementById('totalIncome').textContent = `${currencySymbols[currentCurrency] || '$'}${(Math.round(totalIncome * 100) / 100).toFixed(2)}`;
    document.getElementById('netBudget').textContent = `${currencySymbols[currentCurrency] || '$'}${(Math.round(netBudget * 100) / 100).toFixed(2)}`;

    console.log('Expenses:', expenses);
    console.log('Incomes:', incomes);
    renderCharts(expenses, incomes);
}

function renderEntries(containerId, collectionName, records) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    if (records.length === 0) {
        container.innerHTML = `<li>No ${collectionName.toLowerCase()} records found.</li>`;
        return;
    }

    records.forEach(record => {
        const li = document.createElement('li');
        li.textContent = `Entry Date:  ${record.date} |  ${currencySymbols[currentCurrency] || '$'}${(Math.round(record.amount * 100) / 100).toFixed(2)}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.style.marginLeft = '10px';
        deleteBtn.onclick = () => deleteEntry(collectionName, record.id);

        li.appendChild(deleteBtn);
        container.appendChild(li);
    });
}

async function deleteEntry(collectionName, id) {
    try {
        await deleteDoc(doc(db, collectionName, id));
        alert(`${collectionName} entry deleted.`);
        loadData();
    } catch (error) {
        console.error('Delete failed:', error);
        alert('Unable to delete entry.');
    }
}

async function renderCharts(expenses = [], incomes = []) {
    // Placeholder for chart rendering logic using Chart.js or similar library
}

// Expose functions to inline HTML onclick handlers (module scope does not do this automatically)
window.addExpense = addExpense;
window.addIncome = addIncome;
window.logout = clearSession;
window.refreshEntries = loadData;

async function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        alert('Please enter username and password.');
        return;
    }

    const success = await loginUser(username, password);
    if (success) {
        alert(`Login successful. Logged in as ${username}`);
    }
}

function handleLogout() {
    clearSession();
    alert('Logged out.');
}

window.handleLogin = handleLogin;
window.handleLogout = handleLogout;

async function handleSignup() {
    const username = document.getElementById('signup-username').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const currency = document.getElementById('currency').value;

    if (!username || !password) {
        alert('Please enter a username and password to sign up.');
        return;
    }

    const success = await registerUser(username, password, currency);
    if (success) {
        alert(`Account created for ${username} (${currency}).`);
    }
}

window.handleSignup = handleSignup;

updateAuthUI();
loadData();

