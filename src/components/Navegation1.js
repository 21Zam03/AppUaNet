import { createStackNavigator } from '@react-navigation/stack';
import Inicio from './inicio';
import SearchBar from './SearchBar';
import Search from './Search';
import MakePost from './MakePost';
import UserProfile from './UserProfile'
import React, { useState, useEffect } from 'react';
import { useAuth } from "./AuthContext";

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

    return (
        <Looktab.Navigator>
            <Looktab.Screen name='Inicio' component={Inicio} options={{ headerShown: false }}></Looktab.Screen>
            <Looktab.Screen name='Buscador' component={Search} options={{ headerTitle: props => <SearchBar {...props} /> }}></Looktab.Screen>
            <Looktab.Screen name='Postear' component={MakePost} options={{ headerTitle: "Crea una publicacion" }}></Looktab.Screen>
            <Looktab.Screen name='Perfil' component={UserProfile} options={{headerTitle: usuario ? usuario.fullname : 'No hay usuario'}}
            ></Looktab.Screen>
        </Looktab.Navigator>
    );
}