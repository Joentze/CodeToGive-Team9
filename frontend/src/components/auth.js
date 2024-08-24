import { auth, googleProvider } from "../firebase/base";
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { useState } from "react";

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

//   console.log(auth.currentUser.email)

  const signIn = async () => {
    try {
        await createUserWithEmailAndPassword(auth, email, password)
    } catch (err) {
        console.error(err)
    }
  };

  const googleSignIn = async () => {
    try {
        await signInWithPopup(auth, googleProvider)
    } catch (err) {
        console.error(err)
    }
  };

  const logout = async () => {
    try {
        await signOut(auth)
    } catch (err) {
        console.error(err)
    }
  };
  
  return (
    <div>
      <input
        placeholder="Email... "
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password... "
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={signIn}>Sign In</button>
      <button onClick={googleSignIn}>Sign In With Google</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
