import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Inicio from './src/components/inicio';
import Login from './src/components/login';
import Autenticacion from './src/components/autenticacion';
import SignUpName from './src/components/SignUpName';
import SignUpIntro from './src/components/SignUpIntro';
import SignUpBirthday from './src/components/SignUpBirthday';
import SignUpGender from './src/components/SignUpGender';
import SignUpEmail from './src/components/SignUnEmail';
import SignUpCode from './src/components/SignUpCode';
import SignUpPassword from './src/components/SignUpPassword';
import SignUpCarreer from './src/components/SignUpCarreer';
import SignUpLocation from './src/components/SignUpLocation';
import SignUpNickname from './src/components/SignUpNickname';

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
          <AuthStack.Screen name="SignUpIntro" component={SignUpIntro} options={{ title: '', headerShown: true}} />
          <AuthStack.Screen name="SignUpName" component={SignUpName} options={{ title: '', headerShown: true}} />
          <AuthStack.Screen name="SignUpBirthday" component={SignUpBirthday} options={{ title: '', headerShown: true}} />
          <AuthStack.Screen name="SignUpGender" component={SignUpGender} options={{ title: '', headerShown: true}} />
          <AuthStack.Screen name="SignUpCarreer" component={SignUpCarreer} options={{ title: '', headerShown: true}} />
          <AuthStack.Screen name="SignUpLocation" component={SignUpLocation} options={{ title: '', headerShown: true}} />
          <AuthStack.Screen name="SignUpEmail" component={SignUpEmail} options={{ title: '', headerShown: true}} />
          <AuthStack.Screen name="SignUpCode" component={SignUpCode} options={{ title: '', headerShown: true}} />
          <AuthStack.Screen name="SignUpNickname" component={SignUpNickname} options={{ title: '', headerShown: true}} />
          <AuthStack.Screen name="SignUpPassword" component={SignUpPassword} options={{ title: '', headerShown: true}} />
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