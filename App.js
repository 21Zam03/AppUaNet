import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Inicio from './src/components/inicio';
import Login from './src/components/login';
import Autenticacion from './src/components/autenticacion';
import SignUp from './src/components/signUp';

import { AuthProvider, useAuth } from './src/components/AuthContext';
import Navegacion1 from './src/components/Navegation1';

const AuthStack = createStackNavigator();
const MainTab = createStackNavigator();


const AppContent = () => {

  const {autenticado} = useAuth();

  return (
    <NavigationContainer>
      {autenticado ? (
        <MainTab.Navigator>
          <MainTab.Screen name='Navegacion1' component={Navegacion1} options={{ headerShown: false }}></MainTab.Screen>
        </MainTab.Navigator>
      ) : ( 
        <AuthStack.Navigator>
          <AuthStack.Screen name="Auth" component={Autenticacion} options={{ headerShown: false }} />
          <AuthStack.Screen
            name="Login"
            component={Login}
            options={{ title: 'Inicia Sesión', headerTransparent: true, headerShown: false}} />
          <AuthStack.Screen name="SignUp" component={SignUp} options={{ title: 'Create una cuenta', headerTransparent: true, headerShown: false }} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}