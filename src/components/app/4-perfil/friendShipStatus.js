import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FriendshipStatus = ({ userId1, userId2 }) => {
    const [friendStatus, setFriendStatus] = useState(null);
    const [botonSolicitud, setBotonSolicitud] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);

    useEffect(() => {
        fetchFriendStatus();
    }, []);

    const fetchFriendStatus = async () => {
        try {
            let response = await axios.get(`http://192.168.1.35:9000/api/friends/listFriends/${userId1}/${userId2}`);
            if (response.data.idFriend === null) {
                response = await axios.get(`http://192.168.1.35:9000/api/friends/listFriends/${userId2}/${userId1}`);
            }
            if (response.data && response.data.idFriend !== null) {
                setFriendStatus(response.data);
            } else {
                setFriendStatus(null); // No hay conexión
            }
        } catch (error) {
            console.error(error);
        }
    };

    const sendFriendRequest = async (userId1, userId2) => {
        setBotonSolicitud(!botonSolicitud)
        try {
            const friend = {
                userId1: userId1,
                userId2: userId2,
                status: "Pendiente"
            };
            await axios.post('http://192.168.1.35:9000/api/friends', friend);
            fetchFriendStatus();
        } catch (error) {
            console.error(error);
        }
    };

    const cancelFriendRequest = async (idFriend) => {
        setBotonSolicitud(!botonSolicitud)
        try {
            await axios.delete(`http://192.168.1.35:9000/api/friends/${idFriend}`);
            fetchFriendStatus();
        } catch (error) {
            console.error(error);
        }
    };

    const acceptFriendRequest = async (userId1, userId2, idFriend) => {
        setModalVisible(false);
        const friend = {
            idFriend: idFriend,
            userId1: userId1,
            userId2: userId2,
            status: "Aceptado"
        };
        try {
            await axios.put('http://192.168.1.35:9000/api/friends', friend);
            fetchFriendStatus();
        } catch (error) {
            console.error(error);
        }
    };

    const rejectFriendRequest = async (idFriend) => {
        setModalVisible(false);
        try {
            await axios.delete(`http://192.168.1.35:9000/api/friends/${idFriend}`);
            fetchFriendStatus();
        } catch (error) {
            console.error(error);
        }
    };

    const removeFriend = async () => {
        try {
            await axios.post(`/api/remove-friend`, { userId1, userId2 });
            fetchFriendStatus();
        } catch (error) {
            console.error(error);
        }
    };

    const renderButton = () => {
        if (!friendStatus) {
            return (
                <TouchableOpacity style={[!botonSolicitud ? styles.botonSolicitudNo : styles.botonSolicitudSi]} onPress={() => sendFriendRequest(userId1, userId2)}>
                    <Text style={[!botonSolicitud ? styles.textSolicitudNo : styles.textSolicitudSi]}>Enviar Solicitud
                    </Text>
                </TouchableOpacity>
            );
        } else if (friendStatus.status === 'Pendiente') {
            if (friendStatus.userId1 === userId1) {
                return (
                    <TouchableOpacity style={[!botonSolicitud ? styles.botonSolicitudSi : styles.botonSolicitudNo]} onPress={() =>  cancelFriendRequest(friendStatus.idFriend)}>
                        <Text style={[!botonSolicitud ? styles.textSolicitudSi : styles.textSolicitudNo]}>Cancelar Solicitud</Text>
                    </TouchableOpacity>
                );
            } else if (friendStatus.userId2 === userId1) {
                return (
                    <View>
                        <TouchableOpacity style={[!botonSolicitud ? styles.botonSolicitudNo : styles.botonSolicitudSi]} onPress={() => setModalVisible(true)}>
                            <Text style={[!botonSolicitud ? styles.textSolicitudNo : styles.textSolicitudSi]}>Responder</Text>
                        </TouchableOpacity>
                    </View>
                );
            }
        } else if (friendStatus.status === 'Aceptado') {
            return (
                <TouchableOpacity style={[!botonSolicitud ? styles.botonSolicitudSi : styles.botonSolicitudNo]} onPress={() => setModalVisible2(true)}>
                    <Icon name="account-multiple" size={20} color="black"/>
                </TouchableOpacity>
            );
        }

        return <></>
    };

    return (
        <View>
            {renderButton()}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalView}>
                    <TouchableOpacity style={styles.button} onPress={() => acceptFriendRequest(userId1, userId2, friendStatus.idFriend)}>
                        <Text style={styles.buttonText}>Aceptar Solicitud</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => rejectFriendRequest(friendStatus.idFriend)}>
                        <Text style={styles.buttonText}>Rechazar Solicitud</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible2}
                onRequestClose={() => {
                    setModalVisible2(!modalVisible2);
                }}
            >
                <View style={styles.modalView}>
                    <TouchableOpacity style={[!botonSolicitud ? styles.botonSolicitudNo : styles.botonSolicitudSi]} onPress={removeFriend}>
                        <Text style={[!botonSolicitud ? styles.textSolicitudNo : styles.textSolicitudSi]}>Eliminar Amistad</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        margin: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
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
    button: {
        backgroundColor: '#FF9F43',
        padding: 10,
        margin: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});

export default FriendshipStatus;