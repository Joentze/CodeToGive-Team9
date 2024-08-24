import logo from './logo.svg';
import './App.css';
import SignIn from './pages/signIn';
import { findOptimalAssignments } from './helpers/matching';

function App() {

  findOptimalAssignments();
  
  return (
    <div className="App">
      <header className="App-header">
        <SignIn />
      </header>
    </div>
  );
}

export default App;
