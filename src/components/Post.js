import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Modal } from "react-native";
import PostUser from "./PostUser";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState, useRef, useEffect } from "react";
import axios from 'axios';
import ModalComment from "./ModalComment";
import { TextInput } from "react-native-gesture-handler";
import { useAuth } from "./AuthContext";
import { Buffer } from 'buffer';

export default function Post({ idPost, message, photo, datePublished, idStudent, likes, type }) {

    const [listComments, setListComments] = useState([]);
    const [isCommentVisible, setCommentVisible] = useState(false);
    const openComment = async () => {
        try {
            const response = await axios.get(`http://192.168.1.39:9000/api/comments/post/${idPost}`);
            if (response.data) {
                setListComments(response.data);
            }
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
        setCommentVisible(true);
    }

    const closeComment = () => setCommentVisible(false);
    const [liked, setLiked] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const [likeCount, setLikeCount] = useState(likes);

    const handlePress = () => {
        if (liked) {
            setLikeCount(likeCount => likeCount - 1);
        } else {
            setLikeCount(likeCount => likeCount + 1);
        }
        setLiked(!liked);
        // Iniciar la animación
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.5,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const updatePost = async () => {
        const formData = new FormData();
        try {
            formData.append("idPost", idPost);
            formData.append("idStudent", idStudent);
            formData.append("message", message);
            formData.append("datePublished", datePublished);
            formData.append("likes", likeCount);
            formData.append("type", type);
            if (photo != null) {
                formData.append('photo', {
                    uri: `data:image/png;base64,${photo}`,
                    type: 'photo/jpg',
                    name: 'photo.jpeg',
                });
            } else {
                formData.append('photo', null);
            }
            const response = await axios.put("http://192.168.1.39:9000/api/posts", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    withCredentials: true,
                },
            });
            if (response.data) {
                console.log("Publicacion actualizada: ");
                console.log(response.data.likes);
            }
        } catch (error) {
            console.error('Error al tratar de actualizar la publicacion:', error);
        }
    };

    useEffect(() => {
        // Ejecutar updatePost solo cuando likeCount y liked hayan sido actualizados
        updatePost();
    }, [likeCount, liked]);

    const [student, setStudent] = useState();
    useEffect(() => {
        // Realizar la petición Axios para obtener la lista de publicaciones
        axios.get(`http://192.168.1.39:9000/api/students/${idStudent}`)
            .then(response => {
                // Actualizar el estado con la lista de publicaciones recibidas
                setStudent(response.data)
            })
            .catch(error => {
                console.error('Error al obtener al estudiante:', error);
            });
    }, []);

    const [usuario, setUsuario] = useState();
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

    const [commentUser, setCommentUser] = useState("");

    const handleComment = async () => {
        const comentario = {
            idStudent: usuario.idStudent,
            idPost: idPost,
            comment: commentUser,
            like: false
        };

        try {
            const response = await axios.post('http://192.168.1.39:9000/api/comments', comentario, {
                withCredentials: true,
            });

            if (response.data) {
                setCommentUser("");
            }
        } catch (error) {
            console.error('Error al enviar datos:', error);
        }
    };

    return (
        <View style={styles.container}>
            <PostUser idStudent={idStudent} idPost={idPost} />
            <View style={styles.textContainer}>
                <Text>{message}</Text>
            </View>
            {photo === null ? (
                <></>
            ) : (
                <View style={{ width: "100%" }}>
                    <Image
                        source={{ uri: `data:image/png;base64,${photo}` }}
                        style={styles.imagen}
                    />
                </View>
            )}
            <View style={{ flexDirection: "row", alignItems: "start", justifyContent: "space-between", padding: 10 }}>
                <View style={{ flexDirection: "row", gap: 20, alignItems: "start" }}>
                    <View>
                        <TouchableOpacity onPress={handlePress}>
                            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                                <Icon
                                    name={liked ? "heart" : "heart-outline"}
                                    size={25}
                                    color={liked ? "red" : "black"}
                                />
                            </Animated.View>
                        </TouchableOpacity>
                        <Text style={{ textAlign: "center" }}>{likeCount} likes</Text>
                    </View>
                    <View>
                        <TouchableOpacity onPress={openComment}>
                            <Icon name="comment-outline" size={25} color="#000" style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                    <Modal
                        transparent={true}
                        visible={isCommentVisible}
                        onRequestClose={closeComment}
                        animationType="slide"
                    >
                        <View style={styles.overlay}>
                            <View style={styles.menuContainer}>
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10, borderColor: "#DBDAD8", borderBottomWidth: 1, paddingBottom: 10 }}>
                                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 5 }}>
                                        <Icon name={"heart"} size={25} color={"red"}></Icon>
                                        <Text>{likes} likes</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 5 }}>
                                        <Icon name="comment" size={20} color="#FF9F43" style={styles.icon} />
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
                                <View style={{ position: "absolute", bottom: 0, width: "100%", flexDirection: "row", padding: 10, justifyContent: "space-around", borderTopWidth: 1, borderTopColor: "#DBDAD8", alignItems: "start" }}>
                                    {usuario && usuario.photo ? (
                                        <View style={styles.comentarioContainerImagen}>
                                            <Image
                                                source={usuario ? { uri: `data:image/png;base64,${usuario.photo}` } : "No hay foto"}
                                                style={styles.comentarioImagen}
                                            />
                                        </View>
                                    ) : (
                                        <View style={styles.comentarioContainerImagen}>
                                            <Image
                                                source={require('../../assets/photo-perfil.png')}
                                                style={styles.comentarioImagen}
                                            />
                                        </View>
                                    )}
                                    <TextInput style={{ padding: 4, flex: 0.8 }} placeholder="Comenta para..... " value={commentUser} onChangeText={setCommentUser}></TextInput>
                                    <TouchableOpacity onPress={handleComment} style={{ justifyContent: "center", padding: 10 }}><Icon name="send" size={25} color="#FF9F43" /></TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
                <View>
                    <TouchableOpacity>
                        <Icon name="bookmark-outline" size={25} color="black" />
                    </TouchableOpacity>
                </View>
            </View >
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingTop: 10,
        borderColor: "#E7E1E0",
    },

    textContainer: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 14,
        paddingLeft: 14,
    },

    imagen: {
        width: "100%",
        height: 400,
    },

    iconLiked: {
        backgroundColor: "red",
        borderRadius: 30,
    },

    overlay: {
        paddingTop: 20,
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        flex: 1,
    },

    menuContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: "white",
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingTop: 20,
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

});