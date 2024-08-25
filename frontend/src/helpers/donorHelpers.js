import { store } from "../firebase/base";
import { doc, getDoc } from "firebase/firestore";

export async function getDonorById(donorId) {
    try {
      const donorDocRef = doc(store, 'donors', donorId);
      const donorDoc = await getDoc(donorDocRef);
      
      if (donorDoc.exists()) {
        const donorData = donorDoc.data();
        console.log('Donor Data:', donorData);
        return donorData;
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error fetching match:', error);
    }
  }