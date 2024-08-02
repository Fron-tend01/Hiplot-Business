// App.tsx
import { BrowserRouter as Router, Route, Navigate } from 'react-router-dom';
import './App.css'

import RoutesWithNotFonud from './utils/routes-with-not-found';
import { PrivateRoutes, PublicRoutes } from './models/routes';
import AuthGuard from './guards/auth.guard';
import { Suspense, lazy } from 'react';
import Dashboard from './pages/Private/Dashboard/Dashboard';
import { useThemeStore } from './zustand/ThemeStore';


const Login = lazy(() => import('./pages/login/Login'))
const RouteProtector = lazy(() => import('./pages/Private/RouteProtector'))

function App() {

  const { theme } = useThemeStore();

  document.documentElement.style.setProperty('--text-sidebar-color', theme === 'light' ? '' : '#f5f6f7');

  //Sidebar 

  document.documentElement.style.setProperty('--text-sidebar-color', theme === 'light' ? '' : '#f5f6f7');
  document.documentElement.style.setProperty('--sidebar-hover-color', theme === 'light' ? '' : '#5d35b0');
  
  //Main 
  document.documentElement.style.setProperty('--background-main', theme === 'light' ? '' : '#0a0c12');
 
  // Sections 
  document.documentElement.style.setProperty('--background-sections', theme === 'light' ? '' : '#0e1119');

  //Modales
  document.documentElement.style.setProperty('--background-modal', theme === 'light' ? '' : '#13171f');


  // Generales
  document.documentElement.style.setProperty('--input-color', theme === 'light' ? '' : '#2d3338');
  document.documentElement.style.setProperty('--close-color', theme === 'light' ? '' : '#f5f6f7');

  document.documentElement.style.setProperty('--background-select-content', theme === 'light' ? '' : '#252a36');

  document.documentElement.style.setProperty('--placeholder-color', theme === 'light' ? '' : '#bfbfbf');

  document.documentElement.style.setProperty('--svg-color', theme === 'light' ? '' : '#f5f6f7');
  document.documentElement.style.setProperty('--sidebar-svg-color', theme === 'light' ? '' : '#f5f6f7');
  
  document.documentElement.style.setProperty('--text-color', theme === 'light' ? '' : '  ');
  document.documentElement.style.setProperty('--input-color', theme === 'light' ? '' : '#252a36');
  document.documentElement.style.setProperty('--text-select-color', theme === 'light' ? '' : '#f5f6f7');
  document.documentElement.style.setProperty('--sidebar-color', theme === 'light' ? '' : '#13171f');
  document.documentElement.style.setProperty('--header-color', theme === 'light' ? '' : '#0a0c12');

  // tabla

  document.documentElement.style.setProperty('--table-color', theme === 'light' ? '' : '#252a36');
  document.documentElement.style.setProperty('--two-table-color', theme === 'light' ? '' : '#13171f');
  document.documentElement.style.setProperty('--text-table-color', theme === 'light' ? '' : '#f5f6f7');
  
  return (
    <div className='App'>
      <Suspense fallback={<>Cargando</>}>
          <Router>
            <RoutesWithNotFonud>
              <Route path="/" element={<Navigate to={PrivateRoutes.PRIVATE} />} />
              <Route path={PublicRoutes.LOGIN} element={<Login />} />
              <Route element={<AuthGuard privateValidation={true}/>}>
                <Route path={`${PrivateRoutes.PRIVATE}/*`} element={<RouteProtector />} />
              </Route>
              <Route>
                <Route path={PrivateRoutes.DASHBOARD} element={<Dashboard />} />
              </Route>
            </RoutesWithNotFonud>
          </Router>
      </Suspense>
    </div>
  );
}

export default App;
