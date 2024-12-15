import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Layout from "./pages/Layout/Layout";
import Flights from "./pages/Flights/Flights";
import Tickets from "./pages/Tickets/Tickets";
import Aircrafts from "./pages/Aircrafts/Aircrafts";
import News from "./pages/News/News";
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";
import ForgetPassword from "./pages/Auth/ForgetPassword/ForgetPassword";
import ResetPassword from "./pages/Auth/ForgetPassword/ResetPassword";

const isAuthenticated = () => {
  return (
    localStorage.getItem("accessToken") !== undefined &&
    localStorage.getItem("accessToken") !== null
  );
};

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* <Route index element={<Home />} /> */}
            <Route index element={<Navigate to="flights" replace />} />
            <Route path="flights" element={<Flights />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="aircrafts" element={<Aircrafts />} />
            <Route path="news" element={<News />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
