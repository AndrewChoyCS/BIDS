import { ref, onValue, DataSnapshot } from 'firebase/database';
import { db } from '../config/firebase';

interface UserData {
  // Define the structure of user data
  userID: string;
  username: string; // Corrected the typo in the interface
  email: string;
  // Add other fields as needed
}

async function getUserData(userUID: string): Promise<string | null> {
  const userRef = ref(db, `Users/${userUID}/username`);

  try {
    const snapshot = await new Promise<DataSnapshot>((resolve, reject) => {
      onValue(userRef, resolve, reject);
    });

    if (snapshot.exists()) {
      const username = snapshot.val();
      return username as string;
    } else {
      // Username not found
      return null;
    }
  } catch (error) {
    console.error('Error fetching username:', error);
    return null;
  }
}

export default getUserData;