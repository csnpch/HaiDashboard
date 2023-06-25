import { createBrowserRouter } from 'react-router-dom';

// import App from '@/App';
import MainDashboardPage from '@/pages/dashboard/main';
// import UserManagePage from '@/pages/user_manage';
import HospitalDashboardPage from '@/pages/dashboard/hospital';
import AuthPage from '@/pages/Auth';
import RegisterInvitePage from '@/pages/RegisterInvite';
import ErrorInvitePage from '@/pages/error/Invite';
import ResetPasswordPage from '@/pages/ResetPassword';
import UserManagePage from '@/pages/user_manage';


export const routes = {
  root: {
    path: '/',
    element: <MainDashboardPage />,
  },
  auth: {
    path: '/auth',
    element: <AuthPage />,
  },
  register_invite: {
    path: '/register-invite',
    element: <RegisterInvitePage />,
  },

  error_invite: {
    path: '/error/invite/:stateError?',
    element: <ErrorInvitePage />,
  },

  reset_password: {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },

  dashbaord_main: {
    path: '/dashboard',
    element: <MainDashboardPage />,
    protect: true,
  },
  dashboard_hospital: {
    path: '/dashboard/hospital',
    element: <HospitalDashboardPage />,
    protect: true,
  },
  user_manage: {
    path: '/user-manage',
    element: <UserManagePage />,  
    protect: true,
  }
};



export const routerBrowser = createBrowserRouter(
  Object.entries(routes).map(([_, value]) => ({
    path: value.path,
    element: value.element,
  }))
);
