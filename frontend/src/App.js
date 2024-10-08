import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { auth, store } from "./firebase/base";
import { collection, query, where, getDocs } from "firebase/firestore";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import AdminDashboard from "./scenes/admindashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import RecipientForm from "./scenes/recipient-form";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";

import RecipientProfile from "./pages/RecipientProfile";
import DonorProfile from "./pages/DonorProfile";

import SignIn from "./pages/signIn";

import Onboarding from "./scenes/onboarding";

import PastRequests from "./scenes/recipient/PastRequests";
import MatchNotification from './components/MatchNotification';
import Matches from "./scenes/matches";
import Donor from "./scenes/donor"
import Tracking from "./scenes/tracking";



function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
 


  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/tracking" element={<Tracking />} />
              <Route path="/feedback" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />

              <Route path="/profile" element={<RecipientProfile />} />
              <Route path="/donorprofile" element={<DonorProfile />} />

              <Route path="/recipient-form" element={<RecipientForm />} />
              <Route path="/pastrequests" element={<PastRequests />} />
              <Route path="/notifications" element={<MatchNotification />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/donor" element={<Donor />} />

            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
