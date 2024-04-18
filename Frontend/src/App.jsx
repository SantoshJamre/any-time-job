import Home from "./Home/Home";
import Login from "./Login/Login";
import SignUp from "./SignUp/SignUp"
import NewUser from "./NewUser/NewUser";
import UpdateProfile from "./UpdateProfile/UpdateProfile";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedHomeRoute, ProtectedOtpRoute } from "./Utils/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <ProtectedHomeRoute>
            <Home />
          </ProtectedHomeRoute>
        } />
         <Route path="/update-user" element={
          <ProtectedHomeRoute>
            <UpdateProfile />
          </ProtectedHomeRoute>
        } />
        <Route path="/create-user" element={
          <ProtectedOtpRoute>
            <NewUser />
          </ProtectedOtpRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;