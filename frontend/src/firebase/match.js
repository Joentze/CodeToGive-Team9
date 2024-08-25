import { doc, getDoc, getDocs, collection, addDoc } from "firebase/firestore";
import { store } from "./base.js";

async function storeMatchData(match) {
  try {
    const docRef = await addDoc(collection(store, "matches"), match);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function getData() {
  const donationsCollection = collection(store, "donations");
  const requestsCollection = collection(store, "foodRequests");

  let donations = [];
  let requests = [];

  try {
    const donationsData = await getDocs(donationsCollection);
    donations = donationsData.docs.map((doc) => doc.data());

    const requestsData = await getDocs(requestsCollection);
    requests = requestsData.docs.map((doc) => doc.data());
  } catch (err) {
    console.error(err);
  }

  return { donations, requests };
}

async function getMatchData() {
  const matchCollection = collection(store, "matches");

  let matches = [];

  try {
    const matchesData = await getDocs(matchCollection);
    matches = matchesData.docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }));

  } catch (err) {
    console.error(err);
  }

  return { matches };
}

async function getMatchById(matchId) {
  try {
    // Reference to the specific document
    const matchDocRef = doc(store, 'matches', matchId);
    const matchDoc = await getDoc(matchDocRef);
    
    if (matchDoc.exists()) {
      // Document data
      const matchData = matchDoc.data();
      console.log('Match Data:', matchData);
      return { id: matchId, data: matchData };
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching match:', error);
  }
}


export {storeMatchData, getData, getMatchData, getMatchById }