import './App.css';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav';

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      <Outlet />
      {!isAdminPage && <BottomNav />}
    </div>
  );
}

export default App;
