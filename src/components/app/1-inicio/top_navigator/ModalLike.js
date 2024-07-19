import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState, useRef, useEffect } from "react";
import axios from 'axios';

export default function ModalLike({ idStudent }) {

    const [student, setStudent] = useState();
    useEffect(() => {
        // Realizar la petición Axios para obtener la lista de publicaciones
        axios.get(`http://192.168.253.48:9000/api/students/${idStudent}`)
            .then(response => {
                // Actualizar el estado con la lista de publicaciones recibidas
                setStudent(response.data)
            })
            .catch(error => {
                console.error('Error al obtener al estudiante:', error);
            });
    }, []);

    return (
        <View style={styles.comentarioContainer}>
            {student && student.photo ? (
                <View style={styles.comentarioContainerImagen}>
                    <Image
                        source={student ? { uri: `data:image/png;base64,${student.photo}` } : "No hay foto"}
                        style={styles.comentarioImagen}
                    />
                    <Text>{student.fullname}</Text>
                </View>
                
            ) : (
                <View style={styles.comentarioContainerImagen}>
                    <Image
                        source={require('../../../../../assets/photo-perfil.png')}
                        style={styles.comentarioImagen}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    comentarioContainer: {
        flexDirection: "row",
        justifyContent: "start",
        alignItems: "start",
        gap: 10,
        padding: 10,
    },

    comentarioContainerImagen: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 15
    },

    comentarioImagen: {
        width: 40, // Ancho del contenedor
        height: 40, // Alto del contenedor
        borderRadius: 50,
    },
});