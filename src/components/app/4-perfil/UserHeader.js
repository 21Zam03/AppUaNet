import { useAuth } from "../../AuthContext";
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from "react-native";
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { Image as ImageFast } from "expo-image";
import FriendshipStatus from "./friendShipStatus";

export default function UserHeader({idStudent, openOptions}) {

    //Logica para dirigirse al editarPerfil con el useNavigation
    const navigation = useNavigation();
    const handlePress1 = () => {
        navigation.navigate('EditarPerfil')
    };

    //Logica para obtener el usuario del assynStorage
    const { obtenerDatosUsuario } = useAuth();
    const [studentTest, setStudentTest] = useState(null);
    useEffect(() => {
        const cargarDatosUsuario = async () => {
            const datosUsuario = await obtenerDatosUsuario();
            setStudentTest(datosUsuario);
        };
        cargarDatosUsuario();
    }, []);

    //Logica para ver el modal o no
    const [isModalVisible, setModalVisible] = useState(false);
    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);

    //Logica para obtener los likes del usuario
    const [likesTotal, setLikesTotal] = useState();
    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const response = await axios.get(`http://192.168.253.48:9000/api/posts/likes/${idStudent}`);
                setLikesTotal(response.data);
            } catch (error) {
                console.error('Error al obtener los likes:', error);
            }
        };
        fetchLikes();
    }, []);


    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            // Cuando la lectura del Blob está completa, resolver la promesa con el resultado Base64
            reader.onloadend = () => {
                // `result` contiene el contenido en formato Data URL
                const base64String = reader.result.split(',')[1]; // Eliminar el prefijo 'data:image/jpeg;base64,'
                resolve(base64String);
            };

            // Manejar errores durante la lectura
            reader.onerror = (error) => reject(error);

            // Leer el Blob como una URL de datos
            reader.readAsDataURL(blob);
        });
    };

    //Logica para obtener la foto del usuario
    const [photo, setPhoto] = useState([]);
    useEffect(() => {
        const fetchPhoto = async () => {
            try {
                const response = await axios.get(`http://192.168.253.48:9000/api/students/photo/${idStudent}`, {
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
        };
        fetchPhoto();
    }, []);

    //Logica para obtener los datos de biografia y nickname
    const [biografia, setBiografia] = useState("");
    const [nickname, setNickname] = useState("");
    useEffect(() => {
        const fetchPhoto = async () => {
            try {
                const response = await axios.get(`http://192.168.253.48:9000/api/students/nickAndBio/${idStudent}`);
                setBiografia(response.data.biografia);
                setNickname(response.data.nickname);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };
        fetchPhoto();
    }, []);

    //Obtener la cantidad posts
    const [cantPosts, setCantPosts] = useState(0);
    useEffect(() => {
        const fetchPhoto = async () => {
            try {
                const response = await axios.get(`http://192.168.253.48:9000/api/posts/countPosts/${idStudent}`);
                setCantPosts(response.data);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };
        fetchPhoto();
    }, []);

    //Obtener la cantidad amigos
    const [cantFriends, setCantFriends] = useState(0);
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axios.get(`http://192.168.253.48:9000/api/friends/countFriends/${idStudent}`);
                setCantFriends(response.data);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };
        fetchFriends();
    }, []);

    const [enable, setEnable] = useState(false);
    const clickEnable = () => {
        openOptions();
        setEnable(!enable);
    };

    const goToSendMessage = () => {
        navigation.navigate('ChatUser', {
            idStudent: idStudent,
            photo: photo
        });
    };

    return (
        <View style={styles.contenedorFotos}>
            <View style={styles.contenedorImagen}>
                {studentTest && photo ? (
                    <View>
                        <TouchableOpacity onPress={openModal}>
                            <ImageFast
                                source={{ uri: `data:image/png;base64,${photo}` }}
                                style={styles.imagen}
                                contentFit="cover"
                                transition={100}
                                placeholder={require('../../../../assets/photo-perfil.png')}
                            />
                        </TouchableOpacity>
                        {
                            idStudent === studentTest.idStudent ? (
                                <TouchableOpacity>
                                    <View style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: "white", width: 32, height: 32, borderRadius: 50, justifyContent: "center", alignItems: "center" }}>
                                        <Icon name="plus-circle" size={28} color="#7DB6F3" />
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <></>
                            )
                        }
                    </View>
                ) : (
                    <View>
                        <TouchableOpacity onPress={openModal}>
                            <Image
                                source={require('../../../../assets/photo-perfil.png')}
                                style={styles.imagen}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: "white", width: 32, height: 32, borderRadius: 50, justifyContent: "center", alignItems: "center" }}>
                                <Icon name="plus-circle" size={28} color="#7DB6F3" />
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 15, color: "gray" }}>{nickname ? "@" + nickname : '@nickname'}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 45 }}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>{cantPosts ? cantPosts : "---"}</Text>
                    <Text style={{ fontSize: 15 }}>Posts</Text>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>{cantFriends}</Text>
                    <Text style={{ fontSize: 15 }}>Friends</Text>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>{likesTotal}</Text>
                    <Text style={{ fontSize: 15 }}>likes</Text>
                </View>
            </View>
            {
                studentTest && idStudent ? (
                    studentTest.idStudent === idStudent ? (
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 }}>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <TouchableOpacity style={{ backgroundColor: "#E7F0EE", paddingTop: 12, paddingBottom: 12, paddingRight: 20, paddingLeft: 20, borderRadius: 6 }} onPress={handlePress1}>
                                    <Text style={{ textAlign: "center" }}>Editar Perfil</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <TouchableOpacity style={{ backgroundColor: "#E7F0EE", paddingTop: 12, paddingBottom: 12, paddingRight: 20, paddingLeft: 20, borderRadius: 6 }}>
                                    <Text style={{ textAlign: "center" }}>Compartir Perfil</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <TouchableOpacity style={{ backgroundColor: "#E7F0EE", paddingTop: 12, paddingBottom: 12, paddingRight: 20, paddingLeft: 20, borderRadius: 6 }} onPress={clickEnable}>
                                    <Icon2 name={enable? "up" : "down"} size={17} color="#000" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 }}>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <FriendshipStatus userId1={studentTest.idStudent} userId2={idStudent} />
                            </View>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <TouchableOpacity style={{ backgroundColor: "#E7F0EE", paddingTop: 12, paddingBottom: 12, paddingRight: 20, paddingLeft: 20, borderRadius: 6 }} onPress={goToSendMessage}>
                                    <Text style={{ textAlign: "center" }}>Mensaje</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <TouchableOpacity style={{ backgroundColor: "#E7F0EE", paddingTop: 12, paddingBottom: 12, paddingRight: 20, paddingLeft: 20, borderRadius: 6 }} onPress={clickEnable}>
                                    <Icon2 name={enable? "up" : "down"} size={17} color="#000" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                ) : (
                    <View><Text>Cargando.....</Text></View>
                )
            }
            <View>
                <View style={{ justifyContent: "center", alignItems: "center", width: "40%" }}>
                    <Text style={{ textAlign: "center", lineHeight: 20 }}>{biografia ? biografia : "Cargando..."}</Text>
                </View>
            </View>
            <Modal
                transparent={true}
                visible={isModalVisible}
                onRequestClose={closeModal}
                animationType="fade"
            >
                <View style={styles.overlay}>
                    <View style={styles.menuContainer}>
                        <View style={styles.menuItem}>
                            {photo ? (
                                <ImageFast
                                    source={{ uri: `data:image/png;base64,${photo}` }}
                                    style={styles.imagen2}
                                />
                            ) : (
                                <ImageFast
                                    source={require('../../../../assets/photo-perfil.png')}
                                    style={styles.imagen2}
                                />
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedorFotos: {
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },

    contenedorImagen: {
        overflow: "hidden",
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
        borderColor: "black",
        borderWidth: 1
    },

    imagen: {
        width: 100, // Ancho del contenedor
        height: 100, // Alto del contenedor
        borderRadius: 80
    },

    boton2: {
        backgroundColor: "#FF9F43",
        padding: 8,
        borderRadius: 15,
    },

    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },

    menuContainer: {
        width: "100%",
        gap: 10
    },

    menuItem: {
        backgroundColor: "white",
        borderRadius: 10,
    },

    imagen2: {
        width: "100%", // Ancho del contenedor
        height: 400, // Alto del contenedor
    },

    botonSolicitudNo: {
        backgroundColor: "#FF9F43",
        paddingTop: 12,
        paddingBottom: 12,
        paddingRight: 20,
        paddingLeft: 20,
        borderRadius: 6,
        width: "100%"
    },

    botonSolicitudSi: {
        backgroundColor: "#E7F0EE",
        paddingTop: 12,
        paddingBottom: 12,
        paddingRight: 20,
        paddingLeft: 20,
        borderRadius: 6,
        width: "100%"
    },

    textSolicitudNo: {
        color: "white", textAlign: "center"
    },

    textSolicitudSi: {
        color: "black", textAlign: "center"
    },
});