import logo from './logo.svg';
import './App.css';
import SignIn from './pages/signIn';

import Onboarding from './pages/Onboarding';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SignIn />
      </header>
      <Onboarding />
    </div>
  );
}

export default App;
