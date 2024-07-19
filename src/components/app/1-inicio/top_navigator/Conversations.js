import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import axios from 'axios';
import React, { useState, useEffect } from "react";
import { Image as ImageFast } from "expo-image";
import { useNavigation } from "@react-navigation/native";

export default function Conversations({ item, usuario }) {
    const otherUserId = item.students.filter(id => id !== usuario.idStudent)[0];
    const [photo, setPhoto] = useState([]);
    useEffect(() => {
        const loadPhoto = async () => {
            try {
                const response = await axios.get(`http://192.168.253.48:9000/api/students/photo/${otherUserId}`, {
                    responseType: "blob"
                });
                if (response.status === 200) {
                    const base64Image = await blobToBase64(response.data);
                    setPhoto(base64Image);
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setPhoto(null);
                } else {
                    console.log("Ha ocurrido un error obteniendo la foto");
                }
            }
        }
        loadPhoto();
    }, [otherUserId])

    const navigation = useNavigation();
    const openChat = (idChat) => {
        navigation.navigate('ChatStack', {
            idStudent: otherUserId,
            photo: photo,
            idChat: idChat
        });
    }

    const [student, setStudent] = useState(null);
    useEffect(() => {
        const getStudent = async () => {
            try {
                const response = await axios.get(`http://192.168.253.48:9000/api/students/${otherUserId}`);
                setStudent(response.data);
            } catch (error) {
                console.error('Error al obtener al estudiante:', error);
            }
        };
        getStudent();
    }, []);

    return (
        <TouchableOpacity style={styles.chatTouchable} onPress={() => openChat(item.idChat)}>
            <View style={styles.contenedorImagen}>
                <ImageFast
                    source={{ uri: `data:image/png;base64,${photo}` }}
                    style={styles.imagen}
                    contentFit="cover"
                    transition={100}
                    placeholder={require('../../../../../assets/photo-perfil.png')}
                />
            </View>
            <View style={styles.contenedorChat}>
                <Text style={styles.name}>{student ? student.fullname : "...."}</Text>
                <Text style={styles.message}>{item.lastMessage.senderId === usuario.idStudent? "Tu: " : ""}{item.lastMessage.text}</Text>
            </View>
        </TouchableOpacity>
    );
}

const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result.split(',')[1]); // Solo el contenido base64
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

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
        overflow: "hidden",
        flexDirection: "row",
        justifyContent: "start",
        alignItems: "center",
        gap: 10
    },

    imagen: {
        width: 60,
        height: 60,
        borderRadius: 80
    },

    mensaje: {
        color: "gray"
    },

    chatTouchable: {
        flexDirection: "row",
        gap: 10
    },

    contenedorChat: {
        justifyContent: "center",
        alignItems: "flex-start"
    }
});