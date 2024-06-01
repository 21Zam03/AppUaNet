import { useAuth } from "./AuthContext";
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, ScrollView } from "react-native";
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Post from "./Post";
import { useRoute } from '@react-navigation/native';

export default function UserProfile() {

    const route = useRoute();
    const { idStudent } = route.params;

    const [isModalVisible, setModalVisible] = useState(false);
    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);

    const [listPost, setListPost] = useState([]);
    const navigation = useNavigation();
    const handlePress1 = () => {
        navigation.navigate('EditarPerfil')
    };

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

    useEffect(() => {
        if (student) {
            const fetchPosts = async () => {
                try {
                    const response = await axios.get(`http://192.168.1.39:9000/api/posts/student/${student.idStudent}`);
                    // Ordenar los posts por fecha de publicación
                    const sortedPosts = response.data.sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished));
                    setListPost(sortedPosts);
                } catch (error) {
                    console.error('Error al obtener la lista de publicaciones:', error);
                }
            };
            fetchPosts();
        }
    }, [student]); // Este useEffect depende del `usuario`

    return (
        <View style={styles.contenedor}>
            <ScrollView>
            <View style={styles.contenedorFotos}>
                <Image
                    source={require('../../assets/portada.jpg')}
                    style={{ width: "100%", height: 210 }} />
                <View style={styles.contenedorImagen}>
                    {student && student.photo ? (
                        <TouchableOpacity onPress={openModal}>
                            <Image
                                source={student ? { uri: `data:image/png;base64,${student.photo}` } : "No hay foto"}
                                style={styles.imagen}
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={openModal}>
                            <Image
                                source={require('../../assets/photo-perfil.png')}
                                style={styles.imagen}
                            />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.contenedorEdicion}>
                    <TouchableOpacity onPress={openModal}><Icon name="camera" size={20} color="#4E5050" /></TouchableOpacity>
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
                            <View style={[styles.menuItem, { padding: 10, flexDirection: "row", gap: 10 }]}>
                                <TouchableOpacity style={{ backgroundColor: "#FF9F43", padding: 10, borderRadius: 10, flex: 0.5 }}><Text style={{ color: "white", textAlign: "center" }}>Cambiar foto</Text></TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: "#FF9F43", padding: 10, borderRadius: 10, flex: 0.5 }}><Text style={{ color: "white", textAlign: "center" }}>Eliminar foto</Text></TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
            <View style={styles.contenedorInfo}>
                <Text style={{ fontSize: 19, fontWeight: "bold" }}>{student ? student.fullname : 'No hay usuario'}</Text>
                <View style={{ flexDirection: "row", gap: 5 }}>
                    <View>
                        <Text style={{ fontSize: 15 }}>Conexiones</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>385</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row", gap: 5 }}>
                    <View>
                        <Text>{student ? new Date(student.fecha_nacimiento).toLocaleDateString() : 'No hay usuario'}</Text>
                    </View>
                    <View>
                        <Icon name="birthday-cake" size={18} color="#4E5050" />
                    </View>
                </View>
                <View style={{ flexDirection: "row", gap: 5 }}>
                    <View>
                        <Text>{student ? student.distrito : 'No hay usuario'}</Text>
                    </View>
                    <View>
                        <Icon name="map-marker" size={18} color="#4E5050" />
                    </View>
                </View>
                <View style={{ flexDirection: "row", gap: 5 }}>
                    <View>
                        <Text>{student ? student.carreraProfesional : 'No hay usuario'}</Text>
                    </View>
                    <View>
                        <Icon name="graduation-cap" size={18} color="#4E5050" />
                    </View>
                </View>
                <View style={{ flexDirection: "row", gap: 5 }}>
                    <View>
                        <Text>{student ? student.genre : 'No hay usuario'}</Text>
                    </View>
                    <View>
                        <Icon name="mars" size={18} color="blue" />
                    </View>
                </View>
                <View style={{ flexDirection: "row", gap: 4, marginTop: 10 }}>
                    <TouchableOpacity style={styles.boton} >
                        <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: "bold" }}>Añadir historia</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boton2} onPress={handlePress1} >
                        <Text style={{ color: 'black', textAlign: 'center', fontWeight: "bold" }}>Editar Perfil</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                {listPost.map((post, index) => (
                    <Post key={post.idPost || index} photo={post.photo} message={post.message} idStudent={post.idStudent} />
                ))}
            </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
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
});