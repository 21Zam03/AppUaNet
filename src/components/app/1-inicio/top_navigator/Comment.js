import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Modal } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconIon from 'react-native-vector-icons/Ionicons';
import { useState, useRef, useEffect } from "react";
import axios from 'axios';
import ModalComment from "./ModalComment";
import { TextInput } from "react-native-gesture-handler";
import { Image as ImageFast } from "expo-image";

export default function Comment({ usuario, idPost }) {
    //Logica para manejar los comentarios
    const [listComments, setListComments] = useState([]);
    useEffect(() => {
        const cargarListaComentarios = async () => {
            try {
                const response = await axios.get(`http://192.168.253.48:9000/api/comments/post/${idPost}`);
                if (response.data) {
                    setListComments(response.data);
                }
            } catch (error) {
                console.error('Error al obtener los comentarios:', error);
            }
        };
        cargarListaComentarios();
    }, []);

    const [commentUser, setCommentUser] = useState("");
    const handleComment = async () => {
        const comentario = {
            idStudent: usuario.idStudent,
            idPost: idPost,
            comment: commentUser,
            like: false
        };

        try {
            const response = await axios.post('http://192.168.253.48:9000/api/comments', comentario, {
                withCredentials: true,
            });

            if (response.data) {
                //console.log("Respuesta: " + JSON.stringify(response.data));
                setListComments(prevComments => [...prevComments, response.data]);
                setCommentUser("");
            }
        } catch (error) {
            console.error('Error al enviar datos:', error);
        }
    };

    return (
        <View style={styles.menuContainer}>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10, borderColor: "#DBDAD8", borderBottomWidth: 1, paddingBottom: 10 }}>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 5 }}>
                    <IconIon name="chatbubble-outline" size={20} color="#000" style={styles.icon} />
                    <Text>{listComments.length} comentarios</Text>
                </View>
            </View>
            {listComments.length <= 0 ? (
                <View>
                    <Text style={{ textAlign: "center" }}>No hay comentarios</Text>
                </View>
            ) : (
                <View>
                    {listComments.map(comment => (
                        <ModalComment key={comment.idComment} idStudent={comment.idStudent} idPost={comment.idPost} comment={comment.comment} like={comment.like} />
                    ))}
                </View>
            )}
            <View style={{ backgroundColor: "white", position: 'absolute', bottom: 0, width: "100%", flexDirection: "row", padding: 10, justifyContent: "space-around", borderTopWidth: 1, borderTopColor: "#DBDAD8", alignItems: "start" }}>
                {usuario && usuario.photo ? (
                    <View style={styles.comentarioContainerImagen}>
                        <ImageFast
                            source={usuario ? { uri: `data:image/png;base64,${usuario.photo}` } : "No hay foto"}
                            style={styles.comentarioImagen}
                        />
                    </View>
                ) : (
                    <View style={styles.comentarioContainerImagen}>
                        <Image
                            source={require('../../../../../assets/photo-perfil.png')}
                            style={styles.comentarioImagen}
                        />
                    </View>
                )}
                <TextInput
                    style={{ padding: 4, flex: 0.8 }}
                    placeholder="Comenta para..... "
                    value={commentUser}
                    onChangeText={setCommentUser}
                    autoFocus={true}
                    onSubmitEditing={handleComment}
                ></TextInput>
                <TouchableOpacity onPress={handleComment} style={{ justifyContent: "center", padding: 10 }}><Icon name="send" size={25} color="#FF9F43" /></TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    menuContainer: {
        flex: 1,
        backgroundColor: "white",
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        gap: 10
    },

    menuItem: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center"
    },

    comentarioContainer: {
        flexDirection: "row",
        justifyContent: "start",
        alignItems: "start",
        gap: 10
    },

    comentarioContainerImagen: {
        flex: 0.1,
        //backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center"
    },

    comentarioImagen: {
        width: 45, // Ancho del contenedor
        height: 45, // Alto del contenedor
        borderRadius: 50,
    },

    heartContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -40,
        marginTop: -40,
    },
    heartShadowContainer: {
        padding: 0,
        borderRadius: 50,
    },

});