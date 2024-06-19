import { createStackNavigator } from '@react-navigation/stack';
import Inicio from './inicio';
import SearchBar from './SearchBar';
import Search from './Search';
import MakePost from './MakePost';
import UserProfile from './UserProfile'
import React, { useState, useEffect } from 'react';
import { useAuth } from "./AuthContext";
import EditUser from './editUser';
import EditDistrito from './EditDistrito';
import EditBio from './EditBio';
import EditGenero from './EditGenero';
import EditIA from './Edit_IA';
import EditHobbies from './EditHobbies';
import { View, Text } from 'react-native';

const Looktab = createStackNavigator();

export default function Navegacion1() {

    const [usuario, setUsuario] = useState(null);
    const { obtenerDatosUsuario } = useAuth();

    useEffect(() => {
        // Función para cargar los datos del usuario
        const cargarDatosUsuario = async () => {
            try {
                const usuario = await obtenerDatosUsuario();
                setUsuario(usuario);
            } catch (error) {
                console.error('Error al cargar los datos del usuario:', error);
            }
        };

        // Llamar a la función para cargar los datos del usuario cuando el componente se monte
        cargarDatosUsuario();
    }, []);

    function cuerpo() {
        return (
            <View>
                <Text style={{textAlign: "center", fontWeight: "bold", fontSize: 18}}>Perfil</Text>
            </View>
        );
    }

    return (
        <Looktab.Navigator>
            <Looktab.Screen name='Inicio' component={Inicio} options={{ headerShown: false }}></Looktab.Screen>
            <Looktab.Screen name='Buscador' component={Search} options={{ headerTitle: props => <SearchBar {...props} /> }}></Looktab.Screen>
            <Looktab.Screen name='Postear' component={MakePost} options={{ headerTitle: "Crea una publicacion" }}></Looktab.Screen>
            <Looktab.Screen name='Perfil' component={UserProfile} options={{headerTitle: cuerpo, headerTitleAlign: 'center'}}
            ></Looktab.Screen>
            <Looktab.Screen name='EditarPerfil' component={EditUser} options={{headerTitle: "Editar perfil"}}></Looktab.Screen>
            <Looktab.Screen name='EditarDistrito' component={EditDistrito} options={{headerTitle: "Editar Distrito"}}></Looktab.Screen>
            <Looktab.Screen name='EditarBio' component={EditBio} options={{headerTitle: "Editar Bio"}}></Looktab.Screen>
            <Looktab.Screen name='EditarGenero' component={EditGenero} options={{headerTitle: "Editar Genero"}}></Looktab.Screen>
            <Looktab.Screen name='EditarIA' component={EditIA} options={{headerTitle: "Editar Intereses"}}></Looktab.Screen>
            <Looktab.Screen name='EditarHobbies' component={EditHobbies} options={{headerTitle: "Editar Hobbies"}}></Looktab.Screen>
        </Looktab.Navigator>
    );
}