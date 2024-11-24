import axios from 'axios';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

class PinterestService {
constructor() {
  this.baseURL = 'https://api.pinterest.com/v5';
}

async getAuthToken(userId) {
  const tokenDoc = await getDoc(
    doc(db, 'users', userId, 'pinterest_tokens', 'current')
  );
  if (!tokenDoc.exists()) {
    throw new Error('No Pinterest token found');
  }
  return tokenDoc.data().access_token;
}

async createPin(userId, pinData) {
  const token = await this.getAuthToken(userId);
  try {
    const response = await axios.post(
      \`\${this.baseURL}/pins\`,
      pinData,
      {
        headers: {
          Authorization: \`Bearer \${token}\`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(\`Failed to create pin: \${error.message}\`);
  }
}

async getBoards(userId) {
  const token = await this.getAuthToken(userId);
  try {
    const response = await axios.get(
      \`\${this.baseURL}/boards\`,
      {
        headers: {
          Authorization: \`Bearer \${token}\`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(\`Failed to fetch boards: \${error.message}\`);
  }
}

async schedulePin(userId, pinData, scheduledTime) {
  // Store scheduled pin in Firestore
  await db.collection('users')
    .doc(userId)
    .collection('scheduled_pins')
    .add({
      ...pinData,
      scheduledTime,
      status: 'pending',
      createdAt: new Date(),
    });
}
}

export default new PinterestService();