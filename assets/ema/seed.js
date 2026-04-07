import { db, collection, addDoc, serverTimestamp } from './firestore.js';
import { faker } from 'https://cdn.jsdelivr.net/npm/@faker-js/faker@10.4.0/+esm';

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

// Call this once, then delete the call or the file
// seedDatabase();