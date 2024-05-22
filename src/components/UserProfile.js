import { useAuth } from "./AuthContext";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

export default function UserProfile() {
    
    const navigation = useNavigation();
    const handlePress1 = () => {
        navigation.navigate('EditarPerfil')
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
        <View style={user_styles.contenedor}>
            <View style={user_styles.contenedorFotos}>
                <Image
                    source={require('../../assets/portada.jpg')}
                    style={{ width: "100%", height: 210 }} />
                <View style={user_styles.contenedorImagen}>
                    <Image
                        source={usuario ? { uri: `data:image/png;base64,${usuario.photo}` } : "No hay foto"}
                        style={user_styles.imagen}
                    />
                </View>
                <View style={user_styles.contenedorEdicion}> 
                    <TouchableOpacity><Icon name="camera" size={20} color="#4E5050" /></TouchableOpacity>
                </View>
            </View>
            <View style={user_styles.contenedorInfo}>
                <Text style={{fontSize: 19, fontWeight: "bold"}}>{usuario ? usuario.fullname : 'No hay usuario'}</Text>
                <View style={{flexDirection: "row", gap: 4}}>
                    <Text style={{fontSize: 15, fontWeight: "bold"}}>385</Text>
                    <Text style={{fontSize: 15}}>amigos</Text>
                </View>
                <View style={{flexDirection: "row", gap: 4}}>
                    <Icon name="birthday-cake" size={18} color="#4E5050" />
                    <Text>{usuario ? new Date(usuario.fecha_nacimiento).toLocaleDateString() : 'No hay usuario'}</Text>
                </View>
                <View style={{flexDirection: "row", gap: 4}}>
                    <Icon name="map-marker" size={18} color="#4E5050" />
                    <Text>{usuario ? usuario.direccion : 'No hay usuario'}</Text>
                </View>
                <View style={{flexDirection: "row", gap: 4}}>
                    <Icon name="graduation-cap" size={18} color="#4E5050" />
                    <Text>{usuario ? usuario.carreraProfesional : 'No hay usuario'}</Text>
                </View>
                <View style={{flexDirection: "row", gap: 4, marginTop: 10}}>
                    <TouchableOpacity style={user_styles.boton} >
                        <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: "bold" }}>Añadir historia</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={user_styles.boton2} onPress={handlePress1} >
                        <Text style={{ color: 'black', textAlign: 'center', fontWeight: "bold" }}>Editar Perfil</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const user_styles = StyleSheet.create({
    contenedor: {
        flex: 1,
    },

    contenedorFotos: {
        paddingBottom: 50
    },

    contenedorInfo: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 20
    },

    contenedorImagen: {
        position: "absolute",
        left: 10,
        top: 87,
        width: 160, // Ancho del contenedor
        height: 160, // Alto del contenedor
        borderRadius: 80, // Mitad del ancho/alto para hacerlo circular
        overflow: "hidden"
    },

    contenedorEdicion: {
        backgroundColor: "#F5FAF8", 
        flex: 1, 
        position: "absolute",
        borderRadius: 80,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: 'center',
        top: 200,
        left: 122,
        borderColor: "black",
        borderWidth: 1
    },

    imagen: {
        width: 160, // Ancho del contenedor
        height: 160, // Alto del contenedor
    },

    boton: {
        backgroundColor: "#FF9F43",
        padding: 10,
        borderRadius: 15,
    },

    boton2: {
        backgroundColor: "#D3DCDA",
        padding: 10,
        borderRadius: 15,
    }
});