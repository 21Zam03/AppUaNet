import { View, Image, TouchableOpacity, StyleSheet, Text, ActivityIndicator, ScrollView } from "react-native";
import React, { useState, useEffect } from 'react';
import { useAuth } from "../../AuthContext";
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function EditUser() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [usuario, setUsuario] = useState(null);
    const { obtenerDatosUsuario, eliminarDatosUsuario, guardarDatosUsuario } = useAuth();
    const [image, setImage] = useState(null);

    useEffect(() => {
        const cargarDatosUsuario = async () => {
            try {
                const user = await obtenerDatosUsuario();
                setUsuario(user);
            } catch (error) {
                console.error('Error al cargar los datos del usuario:', error);
            }
        };

        cargarDatosUsuario();
    }, []);

    const pickImage = async () => {
        if (image != null) {
            setImage(null);
        } else {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [5, 5],
                quality: 0.3,
            });

            if (!result.cancelled && result.assets && result.assets.length > 0) {
                setImage(result.assets[0].uri);
                console.log(result.assets[0].fileSize)
            }
        }
    };

    const updateUser = async () => {
        setLoading(true);

        const formData = new FormData();

        try {
            const fecha = new Date(usuario.fecha_nacimiento);
            const anio = fecha.getFullYear();
            const mes = fecha.getMonth() + 1;
            const dia = fecha.getDate();
            const fechaFormateada = `${anio}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
            formData.append("idStudent", usuario.idStudent);
            formData.append("idUser", usuario.userDto.idUser);
            formData.append("fullname", usuario.fullname);
            formData.append("fecha_nacimiento", fechaFormateada);
            formData.append("genero", usuario.genre);
            formData.append('distrito', usuario.distrito);
            formData.append("carreraProfesional", usuario.carreraProfesional);
            if (image) {
                formData.append('photo', {
                    uri: image,
                    name: 'photo.jpg',
                    type: 'image/jpeg',
                });
            }
            formData.append('biografia', usuario.biografia ? usuario.biografia : " ");
            formData.append('intereses', JSON.stringify(usuario.intereses));
            formData.append('hobbies', JSON.stringify(usuario.hobbies));
            formData.append('nickname', usuario.nickname);

            const response = await axios.put('http://192.168.1.35:9000/api/students', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data) {
                eliminarDatosUsuario();
                guardarDatosUsuario(response.data);
            }

        } catch (error) {
            console.error('Error al enviar datos:', error);
            if (error.response && error.response.status === 401) {
                return "¡Error no se pudo actualizar!";
            }
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 4000);
        }
    };

    const handlePress = (screen) => {
        navigation.navigate(screen, { usuario });
    };

    return (
        <View style={styles.contenedorPadre}>
            <ScrollView>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FF9F43" />
                    </View>
                ) : (
                    <View style={styles.content}>
                        <View style={styles.contenedorFotos}>
                            <View style={styles.header}>
                                <Text style={styles.headerText}>Foto</Text>
                                <TouchableOpacity onPress={pickImage}>
                                    <Text style={styles.editText}>{image ? "Cancelar" : "Editar"}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.imageContainer}>
                                {image === null ? (
                                    usuario && usuario.photo ? (
                                        <Image
                                            source={{ uri: `data:image/png;base64,${usuario.photo}` }}
                                            style={styles.image}
                                        />
                                    ) : (
                                        <Image
                                            source={require('../../../../assets/photo-perfil.png')}
                                            style={styles.image}
                                        />
                                    )
                                ) : (
                                    image && (
                                        <View style={styles.imageWrapper}>
                                            <Image
                                                source={{ uri: image }}
                                                style={styles.image}
                                            />
                                            <TouchableOpacity style={styles.saveButton} onPress={updateUser}>
                                                <Text style={styles.saveButtonText}>Guardar</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                )}
                            </View>
                        </View>

                        <View style={styles.contenedorFotos}>
                            <View style={styles.header}>
                                <Text style={styles.headerText}>Bio</Text>
                                <TouchableOpacity onPress={() => handlePress('EditarBio')}>
                                    <Text style={styles.editText}>Editar</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.infoContainer}>
                                <View style={styles.infoRow}>
                                    <Icon name="user" size={22} color="#4E5050" />
                                    <Text>{usuario ? usuario.biografia : "Cargando..."}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.contenedorFotos}>
                            <View style={styles.header}>
                                <Text style={styles.headerText}>Distrito actual</Text>
                                <TouchableOpacity onPress={() => handlePress('EditarDistrito')}>
                                    <Text style={styles.editText}>Editar</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.infoContainer}>
                                <View style={styles.infoRow}>
                                    <Icon name="map-marker" size={22} color="#4E5050" />
                                    <Text style={styles.infoText}>{usuario ? usuario.distrito : 'No hay usuario'}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.contenedorFotos}>
                            <View style={styles.header}>
                                <Text style={styles.headerText}>Género</Text>
                                <TouchableOpacity onPress={() => handlePress('EditarGenero')}>
                                    <Text style={styles.editText}>Editar</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.infoContainer}>
                                <View style={styles.infoRow}>
                                    <Icon name="mars" size={22} color="#4E5050" />
                                    <Text>{usuario ? usuario.genre : 'No hay usuario'}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.contenedorFotos}>
                            <View style={styles.header}>
                                <Text style={styles.headerText}>Intereses Académicos</Text>
                                <TouchableOpacity onPress={() => handlePress('EditarIA')}>
                                    <Text style={styles.editText}>Editar</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.tagsContainer}>
                                {usuario ? (
                                    usuario.intereses.map((interest, index) => (
                                        <View style={styles.tag} key={index}>
                                            <Text style={styles.tagText}>{interest}</Text>
                                        </View>
                                    ))
                                ) : null}
                            </View>
                        </View>

                        <View style={styles.contenedorFotos}>
                            <View style={styles.header}>
                                <Text style={styles.headerText}>Hobbies</Text>
                                <TouchableOpacity onPress={() => handlePress('EditarHobbies')}>
                                    <Text style={styles.editText}>Editar</Text>
                                </TouchableOpacity>
                            </View>
                            {usuario ? (
                                usuario.hobbies != null ? (
                                    <View style={styles.tagsContainer}>
                                        {usuario.hobbies.map((hobbie, index) => (
                                            <View style={styles.tag} key={index}>
                                                <Text style={styles.tagText}>{hobbie}</Text>
                                            </View>
                                        ))}
                                    </View>
                                ) : (
                                    <Text>No hay hobbies</Text>
                                )
                            ) : null}
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedorPadre: {
        flex: 1,
        backgroundColor: "white",
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 10,
    },
    contenedorFotos: {
        borderBottomWidth: 1,
        borderBottomColor: "#DCE1E1",
        paddingBottom: 20,
        marginBottom: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    editText: {
        fontSize: 17,
        color: "#FF9F43",
    },
    imageContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 160,
        height: 160,
        borderRadius: 80,
    },
    imageWrapper: {
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },
    saveButton: {
        backgroundColor: "#FF9F43",
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 5,
    },
    saveButtonText: {
        color: "white",
    },
    infoContainer: {
        justifyContent: "center",
        alignItems: "start",
        gap: 6,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    infoText: {
        fontSize: 15,
    },
    tagsContainer: {
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
});
