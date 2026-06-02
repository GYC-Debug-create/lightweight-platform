import './App.css';
import { Outlet } from 'react-router';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <div className="App">
      <Outlet />
      <BottomNav />
    </div>
  );
}

export default App;
