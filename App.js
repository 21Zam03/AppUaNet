import { NavigationContainer } from '@react-navigation/native';
import AppStackNavigator from './src/components/app/AppStackNavigator';
import AuthStackNavigator from './src/components/auth/AuthStackNavigator';
import { AuthProvider } from './src/components/AuthContext';
import { useAuth } from './src/components/AuthContext';

const AppContent = () => {
  const {autenticado} = useAuth();
  return (
    <NavigationContainer>{autenticado ? <AppStackNavigator /> : <AuthStackNavigator/>}</NavigationContainer>
  );
};


export default function App() {
  return (
    <AuthProvider>
      <AppContent/>
    </AuthProvider>
  );
}

