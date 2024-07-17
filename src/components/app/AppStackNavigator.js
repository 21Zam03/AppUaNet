import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Inicio from './1-inicio/inicio';
import Search from './2-buscador/Search';
import MakePost from './3-postear/MakePost';
import PerfilStackNavigator from './4-perfil/PerfilStackNavigator';
import ChatUser from './1-inicio/top_navigator/ChatUser';

const AppStack = createStackNavigator();

function AppStackNavigator() {

    return (
        <AppStack.Navigator>
            <AppStack.Screen name='Inicio' component={Inicio} options={{ headerShown: false }} />
            <AppStack.Screen
                name='Buscador'
                component={Search}
                options={({ navigation }) => ({
                    headerShown: false,
                })}
            />
            <AppStack.Screen 
                name='Postear' 
                component={MakePost} 
                options={({ navigation }) => ({
                    headerShown: false,
                })}
            />
            <AppStack.Screen name='PerfilStack' component={PerfilStackNavigator} options={{ headerShown: false }} />
            <AppStack.Screen 
                name='ChatStack' 
                component={ChatUser} 
                options={({ navigation }) => ({
                    headerShown: false,
                })}
            />
        </AppStack.Navigator>
    );
}

export default AppStackNavigator;