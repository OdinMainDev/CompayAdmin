import { AuthProvider } from "./app/api/auth/components/AuthProvider";
import { AppRouter } from "./app/router/AppRouter";

const App = () => {
  return (
    <AuthProvider> 
      <AppRouter />
    </AuthProvider>
  );
};
export default App;
