import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState, useRef, useEffect } from "react";
import axios from 'axios';

export default function ModalComment({ idStudent, idPost, comment, like }) {
    const [likedComment, setLikedComment] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    
    const handlePress2 = () => {
        setLikedComment(!likedComment);
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

    const [student, setStudent] = useState();
    useEffect(() => {
        // Realizar la petición Axios para obtener la lista de publicaciones
        axios.get(`http://192.168.1.35:9000/api/students/${idStudent}`)
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
                </View>
            ) : (
                <View style={styles.comentarioContainerImagen}>
                    <Image
                        source={require('../../../../../assets/photo-perfil.png')}
                        style={styles.comentarioImagen}
                    />
                </View>
            )}
            <View style={{ flex: 0.85 }}>
                <Text style={{ fontWeight: "bold" }}>{student ? student.fullname : 'No hay usuario'}</Text>
                <Text>{comment}</Text>
                <TouchableOpacity>
                    <Text style={{ color: "gray" }}>reply</Text>
                </TouchableOpacity>
            </View>
            <View style={{ justifyContent: "center" }}>
                <TouchableOpacity onPress={handlePress2}>
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                        <Icon
                            name={likedComment ? "heart" : "heart-outline"}
                            size={20}
                            color={likedComment ? "red" : "black"}
                        />
                    </Animated.View>
                </TouchableOpacity>
            </View>
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
        flex: 0.12
    },

    comentarioImagen: {
        width: 40, // Ancho del contenedor
        height: 40, // Alto del contenedor
        borderRadius: 50,
    },
});