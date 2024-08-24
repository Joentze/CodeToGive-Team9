import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import SignIn from "./pages/signIn";
import Onboarding from "./pages/Onboarding";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<SignIn/>} />
            <Route path="/onboarding" element={<Onboarding/>} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
