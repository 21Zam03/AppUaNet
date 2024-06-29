import { useAuth } from "./AuthContext";
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, ScrollView } from "react-native";
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import TopBarPerfil from "./TopBarPerfil";

export default function UserProfile() {

    //Logica para dirigirse al editarPerfil con el useNavigation
    const navigation = useNavigation();
    const handlePress1 = () => {
        navigation.navigate('EditarPerfil')
    };

    //Logica para obtener el estudiante a ver en el perfil
    const route = useRoute();
    const { idStudent } = route.params;
    const [student, setStudent] = useState(null);
    useEffect(() => {
        axios.get(`http://192.168.1.39:9000/api/students/${idStudent}`)
            .then(response => {
                // Actualizar el estado con la lista de publicaciones recibidas
                setStudent(response.data)
            })
            .catch(error => {
                console.error('Error al obtener al estudiante:', error);
            });
    }, []);

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

    //Logica para obtener las publicaciones del usuario
    const [listPost, setListPost] = useState([]);
    const [likesTotal, setLikesTotal] = useState();
    useEffect(() => {
        if (student) {
            const fetchPosts = async () => {
                try {
                    const response = await axios.get(`http://192.168.1.39:9000/api/posts/student/${student.idStudent}`);
                    // Ordenar los posts por fecha de publicación
                    const sortedPosts = response.data.sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished));
                    setListPost(sortedPosts);
                    const totalLikes = sortedPosts.reduce((acc, post) => acc + post.likes.length, 0);
                    setLikesTotal(totalLikes);
                } catch (error) {
                    console.error('Error al obtener la lista de publicaciones - userProfile:', error);
                }
            };
            fetchPosts();
        }
    }, [student]); // Este useEffect depende del `usuario`

    //Logica para obtener si existe una relacion entre el student y studentTest
    const [reloadComponent, setReloadComponent] = useState(false);
    const [relationInfo, setRelationInfo] = useState();
    const [relation, setRelation] = useState(false);
    const [relation2, setRelation2] = useState(false);
    useEffect(() => {
        if (student) {
            if (studentTest.idStudent != student.idStudent) {
                const fetchPosts = async () => {
                    try {
                        const response = await axios.get(`http://192.168.1.39:9000/api/friends/listFriends/${studentTest.idStudent}/${student.idStudent}`);
                        if (response.data.idFriend) {
                            setRelation(true);
                            setRelationInfo(response.data);
                        } else {
                            comprobacion();
                        }
                    } catch (error) {
                        console.error('Error al obtener la lista de friends del usuario1:', error);
                    }
                };
                fetchPosts();
            }
        }
    }, [student, reloadComponent]);

    //Logica para el boton de enviar solicitud
    const [bontonSolicitud, setBotonSolicitud] = useState(false);
    const botonSolicitudAction = async () => {
        setBotonSolicitud(!bontonSolicitud);
        const friend = {
            userId1: studentTest.idStudent,
            userId2: student.idStudent,
            status: "Pendiente"
        };
        try {
            const response = await axios.post('http://192.168.1.39:9000/api/friends', friend, {
                withCredentials: true,
            });
            if (response.data) {
                console.log(response.data);
                setReloadComponent(prevState => !prevState);
            }
        } catch (error) {
            console.error('Error al enviar datos:', error);
        }
    }

    const botonSolicitudActionNo = async () => {
        setBotonSolicitud(!bontonSolicitud);
        try {
            const response = await axios.delete(`http://192.168.1.39:9000/api/friends/${relationInfo.idFriend}`);
            if (response.data) {
                console.log(response.data);
            }
        } catch (error) {
            console.error('Error al enviar datos:', error);
        }
    }

    const comprobacion = async () => {
        try {
            const response = await axios.get(`http://192.168.1.39:9000/api/friends/listFriends/${student.idStudent}/${studentTest.idStudent}`);
            if (response.data.idFriend) {
                setRelationInfo(response.data);
                setRelation2(true);
            }
        } catch (error) {
            console.error('Error al obtener la lista de friends del usuario2:', error);
        }
    }

    // useEffect(() => {
    //     const calcularAmistades = async () => {

    //     };
    //     calcularAmistades();
    // }, []);

    return (
        <ScrollView>
            <View style={styles.contenedor}>
                <View style={styles.contenedorFotos}>
                    <View style={styles.contenedorImagen}>
                        {student && student.photo ? (
                            <View>
                                <TouchableOpacity onPress={openModal}>
                                    <Image
                                        source={student ? { uri: `data:image/png;base64,${student.photo}` } : "No hay foto"}
                                        style={styles.imagen}
                                    />
                                </TouchableOpacity>
                                {
                                    student.idStudent === studentTest.idStudent ? (
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
                                        source={require('../../assets/photo-perfil.png')}
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
                        <Text style={{ fontSize: 15, color: "gray" }}>{student ? "@" + student.nickname : '@nickname'}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 45 }}>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontSize: 15, fontWeight: "bold" }}>{listPost.length}</Text>
                            <Text style={{ fontSize: 15 }}>Posts</Text>
                        </View>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontSize: 15, fontWeight: "bold" }}>10</Text>
                            <Text style={{ fontSize: 15 }}>Friends</Text>
                        </View>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontSize: 15, fontWeight: "bold" }}>{likesTotal}</Text>
                            <Text style={{ fontSize: 15 }}>likes</Text>
                        </View>
                    </View>
                    {
                        studentTest && student ? (
                            studentTest.idStudent === student.idStudent ? (
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
                                </View>
                            ) : (
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 }}>
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                                        {
                                            relation ? (
                                                relationInfo ? (
                                                    relationInfo.status === "Pendiente" ? (
                                                        <TouchableOpacity style={[!bontonSolicitud ? styles.botonSolicitudSi : styles.botonSolicitudNo]} onPress={botonSolicitudActionNo}>
                                                            <Text style={[!bontonSolicitud ? styles.textSolicitudSi : styles.textSolicitudNo]}>Cancelar Solicitud
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ) : (
                                                        <TouchableOpacity style={styles.botonSolicitudSi} onPress={botonSolicitudActionNo}>
                                                            <Text style={styles.textSolicitudSi}>Eliminar Amistad
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )
                                                ) : (
                                                    <></>
                                                )
                                            ) : (
                                                relation2 ? (
                                                    <TouchableOpacity style={[!bontonSolicitud ? styles.botonSolicitudNo : styles.botonSolicitudSi]} onPress={botonSolicitudActionNo}>
                                                        <Text style={[!bontonSolicitud ? styles.textSolicitudNo : styles.textSolicitudSi]}>Rechazar Solicitud
                                                        </Text>
                                                    </TouchableOpacity>
                                                ) : (
                                                    <TouchableOpacity style={[!bontonSolicitud ? styles.botonSolicitudNo : styles.botonSolicitudSi]} onPress={botonSolicitudAction}>
                                                        <Text style={[!bontonSolicitud ? styles.textSolicitudNo : styles.textSolicitudSi]}>Enviar Solicitud
                                                        </Text>
                                                    </TouchableOpacity>
                                                )
                                            )
                                        }
                                    </View>
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                                        <TouchableOpacity style={{ backgroundColor: "#E7F0EE", paddingTop: 12, paddingBottom: 12, paddingRight: 20, paddingLeft: 20, borderRadius: 6 }}>
                                            <Text style={{ textAlign: "center" }}>Mensaje</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        ) : (
                            <View><Text>Cargando.....</Text></View>
                        )
                    }
                    <View>
                        <View style={{ justifyContent: "center", alignItems: "center", width: "40%", padding: 0, paddingBottom: 20 }}>
                            <Text style={{ textAlign: "center", lineHeight: 20 }}>{student ? student.biografia : "Cargando..."}</Text>
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
                                    {student && student.photo ? (
                                        <Image
                                            source={student ? { uri: `data:image/png;base64,${student.photo}` } : "No hay foto"}
                                            style={styles.imagen2}
                                        />
                                    ) : (
                                        <Image
                                            source={require('../../assets/photo-perfil.png')}
                                            style={styles.imagen2}
                                        />
                                    )}
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
                {listPost ? <TopBarPerfil student={student} listPost={listPost} /> : <></>}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: "white",
    },

    contenedorFotos: {
        justifyContent: "center",
        alignItems: "center",
        gap: 10
    },

    contenedorInfo: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 20,
        gap: 10
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
        width: 120, // Ancho del contenedor
        height: 120, // Alto del contenedor
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