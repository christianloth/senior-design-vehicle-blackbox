import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import DashboardApp from './pages/DashboardApp';
import NotFound from './pages/Page404';
import Login from "./pages/Login";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/trip1"/> },
        { path: 'dashboard', element: <Navigate to="/trip1"/> },
        { path: 'trip1', element: <DashboardApp tripNum={1}/> },
        { path: 'trip2', element: <DashboardApp tripNum={2}/> },
        { path: 'trip3', element: <DashboardApp tripNum={3}/> },
        { path: 'trip4', element: <DashboardApp tripNum={4}/> },
        { path: 'trip5', element: <DashboardApp tripNum={5}/> },
        { path: 'trip6', element: <DashboardApp tripNum={6}/> },
        { path: '404', element: <NotFound /> },
        { path: 'login', element: <Login /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
