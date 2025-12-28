import { AppRouter } from "./app/router/AppRouter";
import AuthProvider from "./auth/AuthContext";

const App = () => {
  return (
    <AuthProvider> 
      <AppRouter />
    </AuthProvider>
  );
};
export default App;
