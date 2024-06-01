import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from "react-native";
import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function PostUser({ idStudent, idPost }) {

    const [isModalVisible, setModalVisible] = useState(false);
    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);

    const navigation = useNavigation();
    const handlePress1 = () => {
        navigation.navigate('Perfil', {
            idStudent: idStudent,
        })
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

    const deletePost = async () => {
        try {
            const response = await axios.delete(`http://192.168.1.39:9000/api/posts/${idPost}`);
            if (response.data) {
                closeModal();
                console.log("Publicacion eliminada: ",idPost);
                navigation.navigate('Inicio');
            }
        } catch (error) {
            console.error('Error al tratar de eliminar la publicacion:', error);
        }
    };
    
    return (
        <View style={styles.contenedorPadre}>
            <TouchableOpacity onPress={handlePress1}>
                {student && student.photo ? (
                    <View style={styles.contenedorImagen}>
                        <Image
                            source={student ? { uri: `data:image/png;base64,${student.photo}` } : "No hay foto"}
                            style={styles.imagen}
                        />
                    </View>
                ) : (
                    <View style={styles.contenedorImagen}>
                        <Image
                            source={require('../../assets/photo-perfil.png')}
                            style={styles.imagen}
                        />
                    </View>
                )}
            </TouchableOpacity>
            <View style={styles.contenedorInput} >
                <Text style={styles.textInput}>{student ? student.fullname : 'valor predeterminado'}</Text>
                <Text style={styles.textInput}>1h</Text>
            </View>
            <View style={styles.contenedorOpciones} >
                <TouchableOpacity onPress={openModal} style={{ padding: 8 }}>
                    <Icon name="ellipsis-horizontal" size={20} color="black"/>
                </TouchableOpacity>
                <Modal
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={closeModal}
                    animationType="slide"
                >
                    <View style={styles.overlay}>
                        <View style={styles.menuContainer}>
                            <TouchableOpacity style={styles.menuItem} onPress={() => { onDelete(idStudent); closeModal(); }}>
                                <View>
                                    <Icon
                                        name="bookmark"
                                        size={28}
                                        color="black"
                                    />
                                </View>
                                <View>
                                    <Text style={[styles.menuItemText, { fontWeight: "bold", fontSize: 17 }]}>Guardar</Text>
                                    <Text style={styles.menuItemText}>Añadelo a tus videos guardados</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItem} onPress={() => { /* Otras funciones */ closeModal(); }}>
                                <View>
                                    <Icon name="link" size={26} color="black" />
                                </View>
                                <View>
                                    <Text style={[styles.menuItemText, { fontWeight: "bold", fontSize: 17 }]}>Copiar Link</Text>
                                    <Text style={styles.menuItemText}>Copie el link y compartalo con amigos</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItem} onPress={deletePost}>
                                <View>
                                    <Icon name="trash" size={26} color="black" />
                                </View>
                                <View>
                                    <Text style={[styles.menuItemText, { fontWeight: "bold", fontSize: 17 }]}>Eliminar</Text>
                                    <Text style={styles.menuItemText}>Elimine la publicacion de manera permanente</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedorPadre: {
        paddingRight: 14,
        paddingLeft: 14,
        flexDirection: "row",
        justifyContent: "start",
        alignItems: "center",
        gap: 20,
    },

    contenedorImagen: {
        width: 35, // Ancho del contenedor
        height: 35, // Alto del contenedor
        borderRadius: 50, // Mitad del ancho/alto para hacerlo circular
        overflow: "hidden",
    },

    imagen: {
        width: 35, // Ancho del contenedor
        height: 35, // Alto del contenedor
    },

    contenedorInput: {
        width: "65%",
    },

    contenedorOpciones: {
        position: "relative",
        width: "10%",
        justifyContent: "start",
        alignItems: "center"
    },

    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 0
    },

    menuContainer: {
        position: "absolute",
        bottom: 0,
        backgroundColor: "white",
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        padding: 15,
        gap: 15,
        width: "100%"
    },

    menuItem: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center"
    },

    menuItemText: {

    },

    icon: {
        borderWidth: 2, // Ancho del borde
        borderColor: '#000', // Color del borde
        borderRadius: 5, // Bordes redondeados
        padding: 5, // Espacio interno del icono
    },


})