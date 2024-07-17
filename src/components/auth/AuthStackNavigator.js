import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './login';
import Autenticacion from './autenticacion';
import SignUpIntro from './SignUpIntro';
import SignUpName from './SignUpName';
import SignUpBirthday from './SignUpBirthday';
import SignUpGender from './SignUpGender';
import SignUpCarreer from './SignUpCarreer';
import SignUpLocation from './SignUpLocation';
import SignUpEmail from './SignUnEmail';
import SignUpCode from './SignUpCode';
import SignUpNickname from './SignUpNickname';
import SignUpPassword from './SignUpPassword';

const AuthStack = createStackNavigator();

function AuthStackNavigator() {
  return (
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
  );
}

export default AuthStackNavigator;