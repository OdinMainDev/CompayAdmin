import { AuthProvider } from "./app/api/auth/AuthProvider";
import { AppRouter } from "./app/router/AppRouter";

const App = () => {
  return (
    <AuthProvider> 
      <AppRouter />
    </AuthProvider>
  );
};
export default App;
