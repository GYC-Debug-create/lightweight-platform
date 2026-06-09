import './App.css';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import DesktopHeader from './components/DesktopHeader';

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      <DesktopHeader isAdminPage={isAdminPage} />
      <Outlet />
      {!isAdminPage && <BottomNav />}
    </div>
  );
}

export default App;
