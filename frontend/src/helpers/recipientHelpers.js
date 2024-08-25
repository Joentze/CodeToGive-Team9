import { store } from "../firebase/base";
import { doc, getDoc } from "firebase/firestore";

export async function getRecipientById(recipientId) {
    try {
      const recipientDocRef = doc(store, 'recipients', recipientId);
      const recipientDoc = await getDoc(recipientDocRef);
      
      if (recipientDoc.exists()) {
        const recipientData = recipientDoc.data();
        console.log('Recipient Data:', recipientDoc);
        return recipientData;
        
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error fetching match:', error);
    }
  }