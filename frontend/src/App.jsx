import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Signup } from "./pages/Signup";
import { Profile } from "./components/profile";
import { Signin } from "./pages/Signin";
import { Dashboard } from "./pages/Dashboard";
import { Send } from "./pages/SendMoney";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          {" "}
        </Route>
        <Route path="/signup" element={<Signup />}>
          {" "}
        </Route>
        <Route path="/signin" element={<Signin />}></Route>

        <Route path="/profile" element={<Profile />}>
          {" "}
        </Route>
        <Route path="/dashboard" element={<Dashboard />}>
          {" "}
        </Route>
        <Route path="/send" element={<Send />}>
          {" "}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
