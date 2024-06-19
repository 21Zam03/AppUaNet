import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Modal } from "react-native";
import PostUser from "./PostUser";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconIon from 'react-native-vector-icons/Ionicons';
import { useState, useRef, useEffect } from "react";
import axios from 'axios';
import ModalComment from "./ModalComment";
import { TextInput } from "react-native-gesture-handler";
import { useAuth } from "./AuthContext";
import { Buffer } from 'buffer';

export default function Post({ idPost, message, photo, datePublished, idStudent, likes, type, studentStorage }) {

    //Logica para la animacion del like y manejo del estado liked
    const userHasLiked = (idStudent, likes) => {
        return likes.includes(idStudent);
    };

    const [liked, setLiked] = useState(userHasLiked(studentStorage.idStudent, likes));
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const [likeCount, setLikeCount] = useState(likes.length);
    const [listLikes, setListLikes] = useState(likes);
    const handlePress = (idStudent) => {
        if (liked) {
            setLikeCount(likeCount => likeCount - 1);
            setListLikes(listLikes.filter(l => l !== idStudent));
        } else {
            setListLikes([...listLikes, idStudent]);
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

    //Logica para manejar los comentarios
    const [listComments, setListComments] = useState([]);
    const [isCommentVisible, setCommentVisible] = useState(false);
    const openComment = async () => {
        try {
            const response = await axios.get(`http://192.168.1.39:9000/api/comments/post/${idPost}`);
            if (response.data) {
                setListComments(response.data);
            }
        } catch (error) {
            console.error('Error al obtener los comentarios:', error);
        }
        setCommentVisible(true);
    }
    const closeComment = () => setCommentVisible(false);

    const [isInitialized, setIsInitialized] = useState(false);

    //
    const updatePost = async () => {
        console.log("Se ejecuto el metodo");
        const formatDate = (inputDate) => {
            const date = new Date(inputDate);
            const year = date.getFullYear();
            const month = ('0' + (date.getMonth() + 1)).slice(-2); // Añade ceros a la izquierda si es necesario
            const day = ('0' + date.getDate()).slice(-2);
            const hours = ('0' + date.getHours()).slice(-2);
            const minutes = ('0' + date.getMinutes()).slice(-2);
            const seconds = ('0' + date.getSeconds()).slice(-2);

            // Formato deseado: yyyy-MM-dd HH:mm:ss
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        };
        const formattedDate = formatDate(datePublished);
        const formData = new FormData();
        try {
            formData.append("idPost", idPost);
            formData.append("idStudent", idStudent);
            formData.append("message", message);
            formData.append("datePublished", formattedDate);
            formData.append("likes", JSON.stringify(listLikes));
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
                //console.log("Publicacion actualizada: ");
                //console.log(response.data.likes);
            }
        } catch (error) {
            console.error('Error al tratar de actualizar la publicacion:', error);
        }
    };

    useEffect(() => {
        // Ejecutar updatePost solo cuando likeCount y liked hayan sido actualizados
        if (isInitialized) {
            updatePost();
        } else {
            setIsInitialized(true);
        }
    }, [likeCount]);

    const [student, setStudent] = useState();
    useEffect(() => {
        axios.get(`http://192.168.1.39:9000/api/students/${idStudent}`)
            .then(response => {
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
                console.log("Respuesta: "+JSON.stringify(response.data));
                setListComments(prevComments => [...prevComments, response.data]);
                setCommentUser("");
            }
        } catch (error) {
            console.error('Error al enviar datos:', error);
        }
    };

    return (
        <View style={styles.container}>
            <PostUser student={student} idPost={idPost} datePublished={datePublished} studentStorage={studentStorage}/>
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
            <View style={{padding: 10, gap: 8}}>
                <View style={{ flexDirection: "row", alignItems: "start", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", gap: 20, alignItems: "start", justifyContent: "center" }}>
                        <View style={{ justifyContent: "start", alignItems: "center" }}>
                            <TouchableOpacity onPress={() => handlePress(studentStorage.idStudent)}>
                                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                                    <IconIon
                                        name={liked ? "heart" : "heart-outline"}
                                        size={25}
                                        color={liked ? "red" : "black"}
                                    />
                                </Animated.View>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity onPress={openComment}>
                                <IconIon name="chatbubble-outline" size={22} color="#000" style={styles.icon} />
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
                                            <IconIon name={"heart-outline"} size={22} color={"black"}></IconIon>
                                            <Text>{likes.length} likes</Text>
                                        </View>
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
                                    <View style={{backgroundColor: "white",  position: "absolute", bottom: 0, width: "100%", flexDirection: "row", padding: 10, justifyContent: "space-around", borderTopWidth: 1, borderTopColor: "#DBDAD8", alignItems: "start"}}>
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
                            </View>
                        </Modal>
                    </View>
                    <View>
                        <TouchableOpacity>
                            <IconIon name="bookmark-outline" size={23} color="black" />
                        </TouchableOpacity>
                    </View>
                </View >
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <TouchableOpacity><Text style={{ fontSize: 13 }}>{likeCount} likes</Text></TouchableOpacity>
                    <TouchableOpacity onPress={openComment}>
                        <Text style={{ fontSize: 13, color: "gray" }}>{listComments.length} comentarios</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 4,
        paddingTop: 10,
        borderColor: "#E7E1E0",
        backgroundColor: "white"
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