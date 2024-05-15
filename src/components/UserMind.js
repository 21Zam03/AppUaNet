import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { useAuth } from "./AuthContext";

export default function UserMind() {
    const navigation = useNavigation();
    const handlePress1 = () => {
        navigation.navigate('Perfil')
    };

    const handlePress2 = () => {
        navigation.navigate('Postear')
    };

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
        <View style={styles.contenedorPadre}>
            <TouchableOpacity style={styles.contenedorImagen} onPress={handlePress1}>
                <Image
                source={usuario ? { uri: `data:image/png;base64,${usuario.photo}` } : "No hay foto"}
                style={styles.imagen}
                />
            </TouchableOpacity>
            <View style={styles.contenedorBoton} >
                <TouchableOpacity style={styles.boton} onPress={handlePress2}><Text>What's in your mind?</Text></TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedorPadre: {
        backgroundColor: 'white',
        flexDirection: "row",
        gap: 14,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10
    },

    contenedorImagen: {
        width: 42, // Ancho del contenedor
        height: 42, // Alto del contenedor
        borderRadius: 50, // Mitad del ancho/alto para hacerlo circular
        overflow: "hidden"
    },

    imagen: {
        width: 42, // Ancho del contenedor
        height: 42, // Alto del contenedor
    },

    contenedorBoton: {
        width: "80%",
    },

    boton: {
        borderRadius: 30,
        paddingRight: 15,
        paddingLeft: 15,
        paddingTop: 11,
        paddingBottom: 11,
        backgroundColor: "#E6E4E3"
    }
    
})
