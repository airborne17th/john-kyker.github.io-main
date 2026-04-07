import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc, query, where } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

const firebaseConfig = {

  apiKey: "AIzaSyChRtiQWMZlisEQ-4_t0WNUVsYhvv2nlb8",

  authDomain: "cu-webapp.firebaseapp.com",

  databaseURL: "https://cu-webapp.firebaseio.com",

  projectId: "cu-webapp",

  storageBucket: "cu-webapp.firebasestorage.app",

  messagingSenderId: "124231609832",

  appId: "1:124231609832:web:9c39393889e24e1bcbc85d"

};



const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* Collection references:
Expense: date, number, userid.
Income: date, number, userid.
User: username, password, userid, currency.
*/

export { db, collection, getDocs, addDoc, doc, deleteDoc, query, where };