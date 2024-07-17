import { View, Text, StyleSheet } from 'react-native';
import IconFont from 'react-native-vector-icons/FontAwesome';
import React, { useEffect, useState } from "react";
import axios from 'axios';

export default function UserInfo({ idStudent }) {

    const [student, setStudent] = useState(null);
    useEffect(() => {
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
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <Text style={styles.title}>Información</Text>
                <View style={styles.infoRow}>
                    <IconFont name="user" size={22} color="#4E5050" style={styles.icon} />
                    <Text style={styles.infoText}>{student ? student.fullname : 'Cargando...'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <IconFont name="graduation-cap" size={22} color="#4E5050" style={styles.icon} />
                    <Text style={styles.infoText}>{student ? student.carreraProfesional : 'Cargando...'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <IconFont name="map-marker" size={22} color="#4E5050" style={styles.icon} />
                    <Text style={styles.infoText}>{student ? student.distrito : 'Cargando...'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <IconFont name="birthday-cake" size={22} color="#4E5050" style={styles.icon} />
                    <Text style={styles.infoText}>{student ? new Date(student.fecha_nacimiento).toLocaleDateString() : 'Cargando...'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <IconFont name="mars" size={22} color="#4E5050" style={styles.icon} />
                    <Text style={styles.infoText}>{student ? student.genre : 'Cargando...'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <IconFont name="envelope" size={22} color="#4E5050" style={styles.icon} />
                    <Text style={styles.infoText}>{student ? student.userDto.email : 'Cargando...'}</Text>
                </View>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.title}>Intereses Académicos</Text>
                <View style={styles.tagContainer}>
                    {
                        student ? (
                            student.intereses.map((interest, index) => (
                                <View style={styles.tag} key={index}>
                                    <Text style={styles.tagText}>{interest}</Text>
                                </View>
                            ))
                        ) : (
                            <></>
                        )
                    }
                </View>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.title}>Hobbies</Text>
                <View style={styles.tagContainer}>
                    {
                        student ? (
                            student.hobbies != null ? (
                                student.hobbies.map((hobbie, index) => (
                                    <View style={styles.tag} key={index}>
                                        <Text style={styles.tagText}>{hobbie}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text>No hay hobbies</Text>
                            )
                        ) : (
                            <></>
                        )
                    }
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: 15,
    },
    infoContainer: {
        paddingHorizontal: 10,
        paddingBottom: 20,
        gap: 10,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    icon: {
        width: "10%",
        justifyContent: "center",
        alignItems: "center",
    },
    infoText: {
        fontSize: 15,
    },
    title: {
        fontSize: 21,
        fontWeight: "bold",
    },
    tagContainer: {
        flexDirection: "row",
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: 10,
    },
    tag: {
        flexDirection: "row",
        backgroundColor: "#E9F0E5",
        padding: 10,
        borderRadius: 10,
        gap: 5,
    },
    tagText: {
        fontSize: 15,
    },
    postsTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
});