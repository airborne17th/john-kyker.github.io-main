import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { faker } from '@faker-js/faker';

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

const dummyWishes = Array.from({ length: 10 }, () => ({
    userName: faker.person.firstName(),
    text: faker.lorem.sentences({ min: 1, max: 3 }),
    createdAt: serverTimestamp()
}));

async function seedDatabase() {
    console.log("Starting seed...");

    for (const wish of dummyWishes) {
        try {
            await addDoc(collection(db, "wishes"), wish);
            console.log(`Added wish from ${wish.userName}`);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    console.log("Seeding complete!");
}

seedDatabase();