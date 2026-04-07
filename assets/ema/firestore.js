import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,        // Useful for sorting by time
  limit,          // Add this for limiting query results
  startAfter,     // Add this for pagination
  endBefore,      // Add this for pagination
  serverTimestamp // Add this
} from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

const firebaseConfig = {

  apiKey: "AIzaSyBK35oHwQwZIwe7y6R47tYuTGCRBfs5F7w",

  authDomain: "emaboard-524c1.firebaseapp.com",

  databaseURL: "https://emaboard-524c1-default-rtdb.firebaseio.com",

  projectId: "emaboard-524c1",

  storageBucket: "emaboard-524c1.firebasestorage.app",

  messagingSenderId: "304949316865",

  appId: "1:304949316865:web:18776e6fd0878115ea1f00",

  measurementId: "G-PJBWYWL615"

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, getDocs, addDoc, doc, deleteDoc, query, where, orderBy, limit, startAfter, endBefore, serverTimestamp };