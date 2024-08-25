import { auth, googleProvider } from "../firebase/base";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useState } from "react";
import { Button, TextField, Box } from "@mui/material";

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //   console.log(auth.currentUser.email)

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };

  const googleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      width="100%"
      maxWidth="900px"
      margin="auto"
    >
      <TextField
        label="Email"
        variant="outlined"
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        variant="outlined"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={signIn}>
        Sign In
      </Button>
      <Button variant="contained" color="secondary" onClick={googleSignIn}>
        Sign In With Google
      </Button>
      <Button variant="contained" color="secondary" onClick={googleSignIn}>
        Sign Up
      </Button>
      {/* <Button variant="outlined" color="error" onClick={logout}>
        Logout
      </Button> */}
    </Box>
  );
};
