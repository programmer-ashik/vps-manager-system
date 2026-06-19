import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import Home from '../pages/dashboard/Home';
import UsersList from '../pages/users/UsersList';
import UserCreate from '../pages/users/UserCreate';
import UserEdit from '../pages/users/UserEdit';
import ServerRequestsList from '../pages/server-requests/ServerRequestsList';
import ServerRequestDetail from '../pages/server-requests/ServerRequestDetail';
import PartnerPaymentsList from '../pages/partner-payments/PartnerPaymentsList';
import PartnerPaymentDetail from '../pages/partner-payments/PartnerPaymentDetail';
import VpsServersList from '../pages/vps-servers/VpsServersList';
import VpsServerCreate from '../pages/vps-servers/VpsServerCreate';
import VpsServerDetail from '../pages/vps-servers/VpsServerDetail';
import VpsUsersList from '../pages/vps-users/VpsUsersList';
import VpsUserCreate from '../pages/vps-users/VpsUserCreate';
import VpsUserDetail from '../pages/vps-users/VpsUserDetail';
import Login from '../pages/auth/Login';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/new" element={<UserCreate />} />
          <Route path="/users/:id" element={<UserEdit />} />
          <Route path="/vps-servers" element={<VpsServersList />} />
          <Route path="/vps-servers/new" element={<VpsServerCreate />} />
          <Route path="/vps-servers/:id" element={<VpsServerDetail />} />
          <Route path="/vps-users" element={<VpsUsersList />} />
          <Route path="/vps-users/new" element={<VpsUserCreate />} />
          <Route path="/vps-users/:id" element={<VpsUserDetail />} />
          <Route path="/server-requests" element={<ServerRequestsList />} />
          <Route path="/server-requests/:id" element={<ServerRequestDetail />} />
          <Route path="/partner-payments" element={<PartnerPaymentsList />} />
          <Route path="/partner-payments/:id" element={<PartnerPaymentDetail />} />
        </Route>
      </Route>

      <Route path="/register" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
