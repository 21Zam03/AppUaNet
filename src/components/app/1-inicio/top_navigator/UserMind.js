import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { useAuth } from "../../../AuthContext";

export default function UserMind() {
    
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


    const navigation = useNavigation();

    const handlePress1 = () => {
        navigation.navigate('PerfilStack', {
            idStudent: usuario.idStudent,
        })
    };

    const handlePress2 = () => {
        navigation.navigate('Postear')
    };

    const [usuario, setUsuario] = useState(null);
    const { obtenerDatosUsuario } = useAuth();

    return (
        <View style={styles.contenedorPadre}>
            <TouchableOpacity style={styles.contenedorImagen} onPress={handlePress1}>
                {usuario && usuario.photo ? (
                    <Image
                        source={{ uri: `data:image/png;base64,${usuario.photo}` }}
                        style={styles.imagen}
                    />
                ) : (
                    <Image
                        source={require('../../../../../assets/photo-perfil.png')}
                        style={styles.imagen}
                    />
                )}
            </TouchableOpacity>
            <View style={styles.contenedorBoton}>
                <TouchableOpacity style={styles.boton} onPress={handlePress2}><Text>¿Que tienes en mente?</Text></TouchableOpacity>
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
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 0,
        paddingRight: 0
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
        borderRadius: 40,
        paddingRight: 15,
        paddingLeft: 15,
        paddingTop: 10,
        paddingBottom: 10,
        borderColor: "#C9CFCE",
        borderWidth: 1
    }

})
