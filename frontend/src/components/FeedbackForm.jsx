import { useState } from "react";
import { postFeedback } from "../helpers/feedbackHelper";
import { Button, TextField, Box } from "@mui/material";

// To add in style
const FeedbackForm = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [name, setName] = useState(undefined);
  const [email, setEmail] = useState(undefined);
  const [feedback, setFeedback] = useState(undefined);

  function sendForm() {
    if (email && name && feedback) {
      setLoading(true);
      postFeedback(name, email, feedback);
      setSent(true);
      setLoading(false);
    } else {
      throw new Error("All fields must be filled");
    }
  }
  return (
    <>
      {sent ? (
        <>Thank You For Your Feedback!</>
      ) : (
        <>
          <Box mt="20px">
            <TextField
              placeholder="Your Name"
              onChange={(event) => setName(event.target.value)}
              fullWidth
            />
          </Box>
          <Box mt="20px">
            <TextField
              placeholder="Your Email"
              onChange={(event) => setEmail(event.target.value)}
              fullWidth
            />
          </Box>
          <Box mt="20px">
            <TextField
              placeholder="Your Feedback"
              onChange={(event) => setFeedback(event.target.value)}
              fullWidth
              multiline
              rows={6}
            />
          </Box>
          <Box display="flex" justifyContent="end" mt="20px">
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              onClick={sendForm}
              loading={loading}
            >
              Submit
            </Button>
          </Box>
        </>
      )}
    </>
  );
};

export default FeedbackForm;
