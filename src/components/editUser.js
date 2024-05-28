import { View, Image, TouchableOpacity, StyleSheet, Text, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from 'react';
import { useAuth } from "./AuthContext";
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import { useNavigation } from '@react-navigation/native';

export default function EditUser() {

    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);

    const [editIdStudent, setEditIdStudent] = useState("");
    const [editIdUser, setEditIdUser] = useState("");
    const [editFullName, setEditFullName] = useState("");
    const [editFecha_nacimiento, setEditFecha_nacimiento] = useState("");
    const [editDireccion, setEditDireccion] = useState("");
    const [editCarreraProfesional, setEditaCarreraProfesional] = useState("");
    const [editPhoto, setEditPhoto] = useState("");

    const [usuario, setUsuario] = useState(null);
    const { obtenerDatosUsuario } = useAuth();
    const { eliminarDatosUsuario } = useAuth();
    const { guardarDatosUsuario } = useAuth();

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

    const [image, setImage] = useState(null);
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            // Verificar si hay elementos en la matriz assets antes de acceder a la URI
            if (result.assets && result.assets.length > 0) {
                setImage(result.assets[0].uri);
            } else {
                console.error('La matriz "assets" está vacía.');
            }
        }
    };

    const updateUser = async () => {
        setLoading(true);

        const formData = new FormData();

        try {
            const fecha = new Date(usuario.fecha_nacimiento);
            const anio = fecha.getFullYear();
            const mes = fecha.getMonth() + 1; // Sumamos 1 para obtener el mes real
            const dia = fecha.getDate();
            const fechaFormateada = `${anio}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
            formData.append("idStudent", usuario.idStudent);
            formData.append("idUser", usuario.idUser);
            formData.append("fullname", usuario.fullname);
            formData.append("fecha_nacimiento", fechaFormateada);
            formData.append('distrito', usuario.distrito);
            formData.append("carreraProfesional", usuario.carreraProfesional);
            formData.append('photo', {
                uri: image,
                name: 'photo.jpg',
                type: 'image/jpeg',
            });
            const response = await axios.put('http://192.168.1.39:9000/api/students', formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data) {
                eliminarDatosUsuario();
                guardarDatosUsuario(response.data);
                console.log(response.data);
                //navigation.navigate('Inicio');
            }

        } catch (error) {
            console.error('Error al enviar datos:', error);
            if (error.response && error.response.status === 401) {
                // Manejar el error 401 aquí
                return "¡Error no se pudo actualizar!";
            }
        } finally {
            setTimeout(() => {
                setLoading(false); // Cuando la tarea finalice, ocultar el efecto de carga
            }, 4000);
        }
    };

    return (
        <View style={styles.contenedorPadre}>
            {loading ? (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.1)', justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color="#FF9F43" />
                </View>
            ) : (
                <View style={{gap: 20}}>
                    <View style={styles.contenedorFotos}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <View>
                                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Foto de perfil</Text>
                            </View>
                            <View>
                                <Text style={{ fontSize: 17, color: "#FF9F43" }} onPress={pickImage}>Editar</Text>
                            </View>
                        </View>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            {image === null ? (
                                <Image
                                    source={usuario ? { uri: `data:image/png;base64,${usuario.photo}` } : "no hay foto"}
                                    style={{ width: 160, height: 160, borderRadius: 80 }}
                                />
                            ) : (
                                image && (
                                    <View style={{ justifyContent: "center", alignItems: "center", gap: 10 }}>
                                        <Image
                                            source={{ uri: image }}
                                            style={{ width: 160, height: 160, borderRadius: 80 }}
                                        />
                                        <TouchableOpacity style={{ backgroundColor: "#FF9F43", width: "auto", paddingRight: 20, paddingLeft: 20, paddingTop: 5, paddingBottom: 5, borderRadius: 5 }}>
                                            <Text style={{ color: "white" }} onPress={updateUser}>Guardar</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            )}
                        </View>
                    </View>
                    <View style={styles.contenedorFotos}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <View>
                                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Foto de portada</Text>
                            </View>
                            <View>
                                <Text style={{ fontSize: 17, color: "#FF9F43" }} onPress={pickImage}>Editar</Text>
                            </View>
                        </View>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <Image
                                source={require('../../assets/portada.jpg')}
                                style={{ width: "100%", height: 210, borderRadius: 10 }}
                            />
                        </View>
                    </View>
                </View>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    contenedorPadre: {
        padding: 10,
        flex: 1,
        flexDirection: "column",
        gap: 20,
        backgroundColor: "white"
    },

    contenedorFotos: {
        justifyContent: "center",
        alignItems: "start",
        gap: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#DCE1E1",
        paddingBottom: 20
    },
})