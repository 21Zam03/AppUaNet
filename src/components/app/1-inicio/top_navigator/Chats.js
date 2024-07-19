import { View, StyleSheet, TouchableOpacity, Text, FlatList } from "react-native";
import axios from 'axios';
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../AuthContext";
import { Image as ImageFast } from "expo-image";
import Conversations from "./Conversations";

export default function Chats() {
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


    const [listChats, setListChats] = useState();
    useEffect(() => {
        if (usuario != null) {
            const loadChats = async () => {
                try {
                    const response = await axios.get(`http://192.168.253.48:9000/api/chats/${usuario.idStudent}`);
                    setListChats(response.data);
                } catch (error) {
                    console.error('Error al obtener al estudiante:', error);
                }
            };
            loadChats();
        }
    }, [usuario]);
    const ItemSeparator = () => (
        <View style={{ height: 20 }} />
    );
    return (
        <View style={styles.contenedorPadre}>
            <View style={styles.contenedorTitle}>
                <Text style={styles.title}>Chats</Text>
            </View>
            <FlatList
                data={listChats}
                keyExtractor={(item) => item.idChat}
                renderItem={({ item }) => <Conversations item={item} usuario={usuario} />}
                ItemSeparatorComponent={ItemSeparator}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    contenedorPadre: {
        flex: 1,
        padding: 10,
        backgroundColor: "white",
        gap: 20
    },

    name: {
        fontSize: 17,
        fontWeight: "bold",
    },

    message: {
        fontSize: 15,
        color: "gray"
    },

    contenedorTitle: {
        borderBottomColor: "#F0F6F4",
        borderBottomWidth: 1,
        paddingTop: 10,
        paddingBottom: 10
    },

    title: {
        fontSize: 20,
        fontWeight: "bold"
    },

    contenedorImagen: {
        flexDirection: "row",
        justifyContent: "start",
        alignItems: "center",
        gap: 10
    },

    imagen: {
        width: 50,
        height: 50
    },

    mensaje: {
        color: "gray"
    },

    chatTouchable: {
        flexDirection: "row",
        gap: 10
    },
});