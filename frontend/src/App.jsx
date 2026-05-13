import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import AuthPage from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

function App() {
  const { token } = useContext(AuthContext);

  return token ? <Dashboard /> : <AuthPage />;
}

export default App;
