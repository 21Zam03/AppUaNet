import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useState } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const BottomSheetComponent = ({ idStudent, idStudentStorage, idPost, handleOutsidePress }) => {
    const navigation = useNavigation();
    const [modalDelete, setModalDelete] = useState(false);
    const openModal2 = () => setModalDelete(true);
    const closeModal2 = () => setModalDelete(false);
    const deletePost = async () => {
        try {
            const response = await axios.delete(`http://192.168.1.35:9000/api/posts/${idPost}`);
            if (response.data) {
                closeModal2();
                console.log("Publicacion eliminada: ", idPost);
                handleOutsidePress();
                navigation.navigate('Inicio');
            }
        } catch (error) {
            console.error('Error al tratar de eliminar la publicacion:', error);
        }
    };
    return (
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
            <TouchableOpacity style={styles.menuItem}>
                <View>
                    <Icon name="link" size={26} color="black" />
                </View>
                <View>
                    <Text style={[styles.menuItemText, { fontWeight: "bold", fontSize: 17 }]}>Copiar Link</Text>
                    <Text style={styles.menuItemText}>Copie el link y compartalo con amigos</Text>
                </View>
            </TouchableOpacity>
            {
                idStudent === idStudentStorage ? (
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
            }
            <Modal
                transparent={true}
                visible={modalDelete}
                onRequestClose={closeModal2}
                animationType="fade"
            >
                <View style={styles.overlay}>
                    <View style={{ backgroundColor: "white", borderRadius: 20, padding: 20, paddingTop: 30, paddingBottom: 30 }}>
                        <View style={{ width: "100%", gap: 10 }}>
                            <View>
                                <Text style={{ textAlign: "center", fontSize: 17, fontWeight: "bold" }}>¿Estas seguro que deseas eliminar esta publicación?</Text>
                                <Text style={{ textAlign: "center" }}>Esta publicación sera eliminado de manera permanente sin recuperacion alguna</Text>
                            </View>
                            <View style={{ flexDirection: "row", gap: 10, justifyContent: "center", alignItems: "center" }}>
                                <TouchableOpacity onPress={closeModal2}><Text style={{ color: "orange", textAlign: "center" }}>Cancelar</Text></TouchableOpacity>
                                <TouchableOpacity onPress={deletePost}><Text style={{ color: "orange" }}>Eliminar</Text></TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    menuContainer: {
        backgroundColor: "white",
        borderRadius: 5,
        padding: 20,
        paddingBottom: 15,
        paddingTop: 15,
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

    overlay: {
        padding: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },

})

export default BottomSheetComponent;