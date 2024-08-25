import { useState } from "react";
import { postFeedback } from "../helpers/feedbackHelper";
import { Button, TextField } from "@mui/material";
import Textarea from "@mui/joy/Textarea";

// To add in style
const FeedbackPage = () => {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");

  function sendForm() {
    postFeedback(name, email, feedback);
    setSent(true);
  }
  return (
    <>
      {sent ? (
        <>Thank You For Your Feedback!</>
      ) : (
        <>
          <TextField
            placeholder="Your Name"
            onInput={(event) => setName(event.target.value)}
          />
          <TextField
            placeholder="Your Email"
            onInput={(event) => setEmail(event.target.value)}
          />
          <Textarea
            placeholder="Your Feedback"
            onInput={(event) => setFeedback(event.target.value)}
          ></Textarea>
          <Button onClick={sendForm}>Submit</Button>
        </>
      )}
    </>
  );
};

export default FeedbackPage;
