import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/signup";
import Login from "./pages/login";
import VerifyPage from "./pages/verify";
import Dashboard from "./pages/dashboard";
import { useAppContext } from "./context/DataLayer";
import ResetPassword from "./pages/resetPassword";
import RequestResetPassword from "./pages/requestResetPassword";

const App = () => {
  const { auth } = useAppContext();
  console.log(auth);
  return (
    <Routes>
      <Route
        path="/"
        element={!auth ? <SignUp /> : <Navigate to="/dashboard" />}
      />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<RequestResetPassword />} />
      <Route
        path="/login"
        element={!auth ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route path="/verify" element={<VerifyPage />} />
      <Route
        path="/dashboard"
        element={auth ? <Dashboard /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default App;
