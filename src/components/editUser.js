import { View, Image, TouchableOpacity, StyleSheet, Text, ActivityIndicator, ScrollView } from "react-native";
import React, { useState, useEffect } from 'react';
import { useAuth } from "./AuthContext";
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function EditUser() {

    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);

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
        if (image != null) {
            setImage(null)
        } else {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [5, 5],
                quality: 0.3,
            });

            if (!result.cancelled) {
                // Verificar si hay elementos en la matriz assets antes de acceder a la URI
                if (result.assets && result.assets.length > 0) {
                    setImage(result.assets[0].uri);
                } else {
                    //console.log('La matriz "assets" está vacíaaaaaa.');
                }
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
            formData.append("idUser", usuario.userDto.idUser);
            formData.append("fullname", usuario.fullname);
            formData.append("fecha_nacimiento", fechaFormateada);
            formData.append("genero", usuario.genre);
            formData.append('distrito', usuario.distrito);
            formData.append("carreraProfesional", usuario.carreraProfesional);
            formData.append('photo', {
                uri: image,
                name: 'photo.jpg',
                type: 'image/jpeg',
            });
            formData.append('biografia', usuario.biografia ? usuario.biografia : " ");
            formData.append('intereses', JSON.stringify(usuario.intereses));
            formData.append('hobbies', JSON.stringify(usuario.hobbies));
            formData.append('nickname', usuario.nickname);
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

    const handlePress1 = () => {
        navigation.navigate('EditarBio', {
            usuario: usuario,
        })
    };

    const handlePress2 = () => {
        navigation.navigate('EditarDistrito', {
            usuario: usuario,
        })
    };

    const handlePress3 = () => {
        navigation.navigate('EditarGenero', {
            usuario: usuario,
        })
    };

    const handlePress4 = () => {
        navigation.navigate('EditarIA', {
            usuario: usuario,
        })
    };

    const handlePress5 = () => {
        navigation.navigate('EditarHobbies', {
            usuario: usuario,
        })
    };

    return (
        <View style={styles.contenedorPadre}>
            <ScrollView>
                {loading ? (
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.1)', justifyContent: 'center', alignItems: 'center' }]}>
                        <ActivityIndicator size="large" color="#FF9F43" />
                    </View>
                ) : (
                    <View style={{ gap: 20, padding: 10 }}>
                        <View style={styles.contenedorFotos}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <View>
                                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Foto</Text>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={pickImage}><Text style={{ fontSize: 17, color: "#FF9F43" }}>{image ? "Cancelar" : "Editar"}</Text></TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                {image === null ? (
                                    usuario && usuario.photo ? (
                                        <Image
                                            source={usuario ? { uri: `data:image/png;base64,${usuario.photo}` } : "no hay foto"}
                                            style={{ width: 160, height: 160, borderRadius: 80 }}
                                        />
                                    ) : (
                                        <Image
                                            source={require('../../assets/photo-perfil.png')}
                                            style={{ width: 160, height: 160, borderRadius: 80 }}
                                        />
                                    )
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
                                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Bio</Text>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={handlePress1}><Text style={{ fontSize: 17, color: "#FF9F43" }}>Editar</Text></TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ justifyContent: "center", alignItems: "start", gap: 6 }}>
                                <View style={{ flexDirection: "row" }}>
                                    <View style={{ width: "10%", justifyContent: "center", alignItems: "center" }}>
                                        <Icon name="user" size={22} color="#4E5050" />
                                    </View>
                                    <View>
                                        <Text>{usuario ? usuario.biografia : "Cargando..."}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.contenedorFotos}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <View>
                                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Distrito actual</Text>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={handlePress2}><Text style={{ fontSize: 17, color: "#FF9F43" }}>Editar</Text></TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ justifyContent: "center", alignItems: "start", gap: 6 }}>
                                <View style={{ flexDirection: "row" }}>
                                    <View style={{ width: "10%", justifyContent: "center", alignItems: "center" }}>
                                        <Icon name="map-marker" size={22} color="#4E5050" />
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: 15 }}>{usuario ? usuario.distrito : 'No hay usuario'}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.contenedorFotos}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <View>
                                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Género</Text>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={handlePress3}><Text style={{ fontSize: 17, color: "#FF9F43" }}>Editar</Text></TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ justifyContent: "center", alignItems: "start", gap: 6 }}>
                                <View style={{ flexDirection: "row" }}>
                                    <View style={{ width: "10%", justifyContent: "center", alignItems: "center" }}>
                                        <Icon name="mars" size={22} color="#4E5050" />
                                    </View>
                                    <View>
                                        <Text>{usuario ? usuario.genre : 'No hay usuario'}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.contenedorFotos}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <View>
                                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Intereses Académicos</Text>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={handlePress4}><Text style={{ fontSize: 17, color: "#FF9F43" }}>Editar</Text></TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", flexWrap: 'wrap', justifyContent: 'flex-start', gap: 10 }}>
                                {
                                    usuario ? (
                                        usuario.intereses.map((interest, index) => (
                                            <View style={{ flexDirection: "row", backgroundColor: "#E9F0E5", padding: 10, borderRadius: 10, gap: 5 }} key={index}>
                                                <View>
                                                    <Text style={{ fontSize: 15 }}>{interest}</Text>
                                                </View>
                                            </View>
                                        ))
                                    ) : (
                                        <></>
                                    )
                                }
                            </View>
                        </View>
                        <View style={styles.contenedorFotos}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <View>
                                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Hobbies</Text>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={handlePress5}><Text style={{ fontSize: 17, color: "#FF9F43" }}>Editar</Text></TouchableOpacity>
                                </View>
                            </View>
                            {
                                usuario ? (
                                    usuario.hobbies != null ? (
                                        <View style={{ flexDirection: "row", flexWrap: 'wrap', justifyContent: 'flex-start', gap: 10 }}>
                                            {
                                                usuario.hobbies.map((hobbie, index) => (
                                                    <View style={{ flexDirection: "row", backgroundColor: "#E9F0E5", padding: 10, borderRadius: 10, gap: 5 }} key={index}>
                                                        <View>
                                                            <Text style={{ fontSize: 15 }}>{hobbie}</Text>
                                                        </View>
                                                    </View>
                                                ))
                                            }
                                        </View>
                                    ) : (
                                        <Text>No hay hobbies</Text>
                                    )
                                ) : (
                                    <></>
                                )
                            }
                        </View>
                    </View>
                )
                }
            </ScrollView >
        </View >
    );
}

const styles = StyleSheet.create({
    contenedorPadre: {
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