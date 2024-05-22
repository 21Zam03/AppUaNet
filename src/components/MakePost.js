import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from 'react';
import { useAuth } from "./AuthContext";
import { TextInput } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/FontAwesome';


export default function MakePost() {
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
        <View style={styles.contenedor}>
            <View style={{flexDirection: "row", gap: 10, alignItems: "center"}}>
                <TouchableOpacity style={styles.contenedorImagen}>
                    <Image
                        source={usuario ? { uri: `data:image/png;base64,${usuario.photo}` } : "No hay foto"}
                        style={styles.imagen}
                    />
                </TouchableOpacity>
                <View>
                    <Text>
                        {usuario ? usuario.fullname : "No hay nombre"}
                    </Text>
                    <Text>
                        friends
                    </Text>
                </View>
            </View>
            <View style={{height: "50%", position: "relative"}}>
                <TextInput style={{fontSize: 20}} placeholder="What's on your mind?"></TextInput>
                <View style={{borderColor: "gray", borderWidth: 1, borderRadius: 5, padding: 15, position: "absolute", bottom: 60, width: "100%", flexDirection: "row", gap: 20}}>
                    <Text>Añade a tu publicación</Text>
                    <Icon name="image" size={20} color="#000" />
                    <Icon name="user" size={20} color="#000" />
                    <Icon name="smile-o" size={20} color="#000" />
                    <Icon name="map-marker" size={20} color="#000" />
                    <Icon name="video-camera" size={20} color="#000" />
                </View>
                <View style={{position: "absolute", bottom: 1, width: "100%"}}>
                    <TouchableOpacity style={{padding: 15, backgroundColor: "#FF9F43", borderRadius: 7}}><Text style={{color: "white", textAlign: "center", fontWeight: "bold"}}>Publicar</Text></TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        borderTopColor: "gray",
        borderTopWidth: 1,
        backgroundColor: 'white',
        flex: 1,
        padding: 15,
        gap: 20
    },
    contenedorImagen: {
        width: 45, // Ancho del contenedor
        height: 45, // Alto del contenedor
        borderRadius: 50, // Mitad del ancho/alto para hacerlo circular
        overflow: "hidden"
    },

    imagen: {
        width: 45, // Ancho del contenedor
        height: 45, // Alto del contenedor
    },

});
