import { store } from "../firebase/base";

export const postFeedback = async (name, email, feedback) => {
  store
    .collection("feedback")
    .add({
      name,
      email,
      feedback,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => console.error(error));
};
