import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();                                           // fix

  if (!user) return <Navigate to="/" replace />;                       // fix
  if (!user.emailVerified) return <Navigate to="/verify-email" replace />;

  return children;
};

export default ProtectedRoute;