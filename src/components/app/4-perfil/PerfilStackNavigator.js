import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserProfile from './UserProfile';
import EditUser from './editUser';
import EditDistrito from './EditDistrito';
import EditBio from './EditBio';
import EditGenero from './EditGenero';
import EditIA from './Edit_IA';
import EditHobbies from './EditHobbies';
import { useRoute } from '@react-navigation/native';
import { View, Text} from "react-native";
import UserPost from './UserPost';
import ChatUser from '../1-inicio/top_navigator/ChatUser';

const PerfilStack = createStackNavigator();
    
function PerfilStackNavigator() {
    const route = useRoute();
    const { idStudent } = route.params;

    function cuerpo() {
        return (
            <View>
                <Text style={{textAlign: "center", fontWeight: "bold", fontSize: 18}}>Perfil</Text>
            </View>
        );
    }
    return (
        <PerfilStack.Navigator>
            <PerfilStack.Screen name='Perfil' component={UserProfile} options={{ headerTitle: cuerpo, headerTitleAlign: 'center' }} initialParams={{idStudent: idStudent}}/>
            <PerfilStack.Screen name='VerPublicaciones' component={UserPost} options={{ headerTitle: "Publicaciones" }}/>
            <PerfilStack.Screen name='EditarPerfil' component={EditUser} options={{ headerTitle: "Editar perfil" }}/>
            <PerfilStack.Screen name='EditarDistrito' component={EditDistrito} options={{ headerTitle: "Editar Distrito" }}/>
            <PerfilStack.Screen name='EditarBio' component={EditBio} options={{ headerTitle: "Editar Bio" }}/>
            <PerfilStack.Screen name='EditarGenero' component={EditGenero} options={{ headerTitle: "Editar Genero" }}/>
            <PerfilStack.Screen name='EditarIA' component={EditIA} options={{ headerTitle: "Editar Intereses" }}/>
            <PerfilStack.Screen name='EditarHobbies' component={EditHobbies} options={{ headerTitle: "Editar Hobbies" }}/>
            <PerfilStack.Screen 
                name='ChatUser' 
                component={ChatUser} 
                options={({ navigation }) => ({
                    headerShown: false,
                })}
            />
        </PerfilStack.Navigator>
    );
}

export default PerfilStackNavigator;