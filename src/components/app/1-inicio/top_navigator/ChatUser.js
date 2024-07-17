import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Image as ImageFast } from "expo-image";
import { useAuth } from '../../../AuthContext';

export default function ChatUser() {
    const navigation = useNavigation();
    const route = useRoute();
    const { idStudent } = route.params;
    const { photo } = route.params;
    const { idChat = null } = route.params || {};

    const [student, setStudent] = useState(null);
    useEffect(() => {
        const getStudent = async () => {
            try {
                const response = await axios.get(`http://192.168.1.35:9000/api/students/${idStudent}`);
                setStudent(response.data);
            } catch (error) {
                console.error('Error al obtener al estudiante:', error);
            }
        };
        getStudent();
    }, []);

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

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    // Simula la carga de mensajes
    useEffect(() => {
        let isMounted = true;
        const fetchMessages = async () => {
            if (usuario != null) {
                try {
                    const response = await axios.get(`http://192.168.1.35:9000/api/messages/chat/${idChat}`);
                    if (isMounted) {
                        setMessages(response.data);
                    }
                } catch (error) {
                    console.error('Error al obtener los mensajes:', error);
                }
            }
        };
        fetchMessages();
        return () => {
            isMounted = false;
        };
    }, [usuario, idChat]);

    const renderItem = ({ item }) => (
        <View style={[styles.messageContainer, item.senderId === usuario.idStudent ? styles.myMessage : styles.otherMessage]}>
            <Text style={[styles.messageText, item.senderId === usuario.idStudent ? "" : styles.otherText]}>{item.text}</Text>
        </View>
    );

    const sendMessage = async () => {
        if (newMessage.trim()) {
            const newMsg = {
                id: (messages.length + 1).toString(),
                senderId: usuario.idStudent,
                text: newMessage,
                createdAt: new Date()
            };
            setMessages([...messages, newMsg]);
            setNewMessage('');
            if (idChat === null) {
                const chatEntity = {
                    students: [idStudent, usuario.idStudent],
                    lastMessage: newMsg,
                    createdAt: new Date()
                }
                try {
                    const response = await axios.post(`http://192.168.1.35:9000/api/chats`, chatEntity);
                } catch (error) {
                    console.error('Error al enviar el mensaje:', error);
                }
            } else {
                const messageEntity = {
                    idChat: idChat,
                    senderId: usuario.idStudent,
                    text: newMessage,
                    createdAt: new Date()
                }
                try {
                    const response = await axios.post(`http://192.168.1.35:9000/api/messages`, messageEntity);
                } catch (error) {
                    console.error('Error al enviar el mensaje:', error);
                }
            }
        }
    }
    return (
        <>
            <View style={styles.contenedorBarra}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon2 name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <View>
                    <TouchableOpacity>
                        <ImageFast
                            source={{ uri: `data:image/png;base64,${photo}` }}
                            style={styles.imagen}
                            contentFit="cover"
                            transition={100}
                            placeholder={require('../../../../../assets/photo-perfil.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    <Text>{student ? student.fullname : "..."}</Text>
                    <Text style={styles.textNickName}>{student ? student.nickname : "..."}</Text>
                </View>
            </View>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <FlatList
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.idMessage}
                    contentContainerStyle={styles.messagesList}
                />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Escribe un mensaje..."
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                        <Icon name="arrowup" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F6F4',
    },

    contenedorBarra: {
        paddingTop: StatusBar.currentHeight,
        paddingBottom: 10,
        backgroundColor: "white",
        paddingLeft: 8,
        flexDirection: "row",
        justifyContent: "start",
        alignItems: "center",
        gap: 10,
        borderColor: "#F0E9E9",
        borderWidth: 1,
    },

    textNickName: {
        color: "gray"
    },

    imagen: {
        width: 50, // Ancho del contenedor
        height: 50, // Alto del contenedor
        borderRadius: 80
    },

    messagesList: {
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    messageContainer: {
        padding: 10,
        borderRadius: 20,
        marginVertical: 5,
        maxWidth: '80%',
    },
    myMessage: {
        backgroundColor: '#7CBBE1',
        alignSelf: 'flex-end',
    },
    otherMessage: {
        backgroundColor: 'white',
        alignSelf: 'flex-start',
    },
    messageText: {
        color: '#fff',
    },

    otherText: {
        color: '#000',
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    textInput: {
        flex: 1,
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    sendButton: {
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
    },
    backButton: {
        padding: 5,
    },
});