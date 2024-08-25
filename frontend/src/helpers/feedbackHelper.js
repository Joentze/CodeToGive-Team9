import { store, collection, addDoc } from "../firebase/base";

export const postFeedback = async (name, email, feedback) => {
  try {
    await addDoc(collection(store, "feedback"), { name, email, feedback });
  } catch (e) {
    throw new Error("There was an error sending feedback");
  }
};
