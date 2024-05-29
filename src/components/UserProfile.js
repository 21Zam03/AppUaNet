import { useAuth } from "./AuthContext";
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from "react-native";
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

export default function UserProfile() {

    const [isModalVisible, setModalVisible] = useState(false);

    // Función para abrir el modal
    const openModal = () => setModalVisible(true);

    // Función para cerrar el modal
    const closeModal = () => setModalVisible(false);

    const navigation = useNavigation();
    const handlePress1 = () => {
        navigation.navigate('EditarPerfil')
    };

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
            <View style={styles.contenedorFotos}>
                <Image
                    source={require('../../assets/portada.jpg')}
                    style={{ width: "100%", height: 210 }} />
                <View style={styles.contenedorImagen}>
                    {usuario && usuario.photo ? (
                        <TouchableOpacity onPress={openModal}>
                            <Image
                                source={usuario ? { uri: `data:image/png;base64,${usuario.photo}` } : "No hay foto"}
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
                                {usuario && usuario.photo ? (
                                    <Image
                                        source={usuario ? { uri: `data:image/png;base64,${usuario.photo}` } : "No hay foto"}
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
                <Text style={{ fontSize: 19, fontWeight: "bold" }}>{usuario ? usuario.fullname : 'No hay usuario'}</Text>
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
                        <Text>{usuario ? new Date(usuario.fecha_nacimiento).toLocaleDateString() : 'No hay usuario'}</Text>
                    </View>
                    <View>
                        <Icon name="birthday-cake" size={18} color="#4E5050" />
                    </View>
                </View>
                <View style={{ flexDirection: "row", gap: 5 }}>
                    <View>
                        <Text>{usuario ? usuario.distrito : 'No hay usuario'}</Text>
                    </View>
                    <View>
                        <Icon name="map-marker" size={18} color="#4E5050" />
                    </View>
                </View>
                <View style={{ flexDirection: "row", gap: 5 }}>
                    <View>
                        <Text>{usuario ? usuario.carreraProfesional : 'No hay usuario'}</Text>
                    </View>
                    <View>
                        <Icon name="graduation-cap" size={18} color="#4E5050" />
                    </View>
                </View>
                <View style={{ flexDirection: "row", gap: 5 }}>
                    <View>
                        <Text>{usuario ? usuario.genre : 'No hay usuario'}</Text>
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
                <Text>Publicaciones</Text>
            </View>
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