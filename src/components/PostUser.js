import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from "react-native";
import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function PostUser({ student, idPost, datePublished, studentStorage }) {
    const [timeDiff, setTimeDiff] = useState(null);
    useEffect(() => {
        const currentDate = new Date();
        const targetDateTime = new Date(datePublished);
        const differenceMs = currentDate.getTime() - targetDateTime.getTime();
        // Calculating days, hours, minutes, seconds
        const days = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((differenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((differenceMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((differenceMs % (1000 * 60)) / 1000);
        if (days > 0) {
            setTimeDiff(`${days}d`);
        } else if (hours > 0) {
            setTimeDiff(`${hours}h`)
        } else if (minutes > 0) {
            setTimeDiff(`${minutes}m`)
        } else {
            setTimeDiff(`${seconds}s`)
        }
        // Format the output
        //const formattedDiff = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
        //setTimeDiff(formattedDiff);
    }, []);

    const [isModalVisible, setModalVisible] = useState(false);
    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);

    const [modalDelete, setModalDelete] = useState(false);
    const openModal2 = () => setModalDelete(true);
    const closeModal2 = () => setModalDelete(false);

    const navigation = useNavigation();
    const handlePress1 = () => {
        navigation.navigate('Perfil', {
            idStudent: student.idStudent,
        })
    };

    const deletePost = async () => {
        try {
            const response = await axios.delete(`http://192.168.1.39:9000/api/posts/${idPost}`);
            if (response.data) {
                closeModal();
                closeModal2();
                console.log("Publicacion eliminada: ", idPost);
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
                <TouchableOpacity onPress={handlePress1}><Text style={styles.textInput}>{student ? student.fullname : 'valor predeterminado'}</Text></TouchableOpacity>
                <Text style={{ color: "gray" }}>{timeDiff}</Text>
            </View>
            <View style={styles.contenedorOpciones} >
                <TouchableOpacity onPress={openModal} style={{ padding: 8 }}>
                    <Icon name="ellipsis-horizontal" size={15} color="gray" />
                </TouchableOpacity>
                <Modal
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={closeModal}
                    animationType="fade"
                >
                    <View style={styles.overlay}>
                        <View style={styles.menuContainer}>
                            <TouchableOpacity style={styles.menuItem}>
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
                            {
                                student && studentStorage ? (
                                    student.idStudent === studentStorage.idStudent ? (
                                        <TouchableOpacity style={styles.menuItem} onPress={openModal2}>
                                            <View>
                                                <Icon name="trash" size={26} color="black" />
                                            </View>
                                            <View>
                                                <Text style={[styles.menuItemText, { fontWeight: "bold", fontSize: 17 }]}>Eliminar</Text>
                                                <Text style={styles.menuItemText}>Elimine la publicacion de manera permanente</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ) : (
                                        <></>
                                    )
                                ) : (
                                    <></>
                                )
                            }
                        </View>
                    </View>
                </Modal>
                <Modal
                    transparent={true}
                    visible={modalDelete}
                    onRequestClose={closeModal2}
                    animationType="fade"
                >
                    <View style={styles.overlay}>
                        <View style={{ backgroundColor: "white", borderRadius: 20, padding: 20, paddingTop: 30, paddingBottom: 30 }}>
                            <View style={{ width: "100%", gap: 10 }}>
                                <View style={{ borderBottomColor: "gray", borderBottomWidth: 1 }}>
                                    <Text style={{ textAlign: "center", fontSize: 17, fontWeight: "bold" }}>¿Estas seguro que deseas eliminar esta publicación?</Text>
                                    <Text style={{ textAlign: "center" }}>Esta publicación sera eliminado de manera permanente sin recuperacion alguna</Text>
                                </View>
                                <View style={{ flexDirection: "row", gap: 10, justifyContent: "center", alignItems: "center" }}>
                                    <TouchableOpacity style={{ borderRightColor: "gray", borderRightWidth: 1 }} onPress={closeModal2}><Text style={{ color: "orange", textAlign: "center" }}>Cancelar</Text></TouchableOpacity>
                                    <TouchableOpacity onPress={deletePost}><Text style={{ color: "orange" }}>Eliminar</Text></TouchableOpacity>
                                </View>
                            </View>
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
        padding: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },

    menuContainer: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        paddingBottom: 40,
        paddingTop: 40,
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