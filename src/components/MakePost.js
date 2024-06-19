import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from 'react';
import { useAuth } from "./AuthContext";
import { TextInput } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import ModalSelector from 'react-native-modal-selector';
import { Video } from 'expo-av';

export default function MakePost() {
    const navigation = useNavigation();
    const [usuario, setUsuario] = useState(null);
    const { obtenerDatosUsuario } = useAuth();
    const [messagePost, setMessagePost] = useState("");

    const [selectedItem, setSelectedItem] = useState(null);

    const data = [
        { key: 0, label: 'Informativo', value: 'Info' },
        { key: 1, label: 'Diversion', value: 'Diver' },
        { key: 2, label: 'Encuesta', value: 'Encues' },
        // Agrega más opciones según sea necesario
    ];

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

    const handleButtonPress = async () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        const formData = new FormData();
        try {
            formData.append("idStudent", usuario.idStudent);
            formData.append("message", messagePost);
            formData.append("likes", JSON.stringify([]));
            formData.append("type", selectedItem);
            formData.append("datePublished", formattedDateTime);
            if (image != null) {
                formData.append('photo', {
                    uri: image,
                    name: 'photo.jpg',
                    type: 'image/jpeg',
                });
            } else {
                formData.append('photo', null);
            }
            const response = await axios.post('http://192.168.1.39:9000/api/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    withCredentials: true,
                },
            });
            if (response.data) {
                console.log(response.data);
                navigation.navigate('Inicio');
            }
        } catch (error) {
            console.error('Error al publicar:', error);
        }
    };

    const [image, setImage] = useState(null);
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [5, 5],
            quality: 0.5,
        });
        //console.log(result);
        if (!result.cancelled) {
            console.log("Tamaño del imagen (en bytes):", result.assets[0].fileSize);
            // Verificar si hay elementos en la matriz assets antes de acceder a la URI
            if (result.assets && result.assets.length > 0) {
                setImage(result.assets[0].uri);
            }
        }
    };

    const [video, setVideo] = useState(null);
    const pickVideo = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            //aspect: [5, 5],
            quality: 0.5,
        });
        //console.log(result);
        if (!result.cancelled) {
            console.log("Tamaño del video (en bytes):", result.assets[0].fileSize);
            // Verificar si hay elementos en la matriz assets antes de acceder a la URI
            if (result.assets && result.assets.length > 0) {
                setVideo(result.assets[0].uri);
            }
        }
    };

    return (
        <View style={styles.contenedor}>
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                <TouchableOpacity style={styles.contenedorImagen}>
                    {usuario && usuario.photo ? (
                        <Image
                            source={usuario ? { uri: `data:image/png;base64,${usuario.photo}` } : "No hay foto"}
                            style={styles.imagen}
                        />
                    ) : (
                        <Image
                            source={require('../../assets/photo-perfil.png')}
                            style={styles.imagen}
                        />
                    )}
                </TouchableOpacity>
                <View>
                    <Text>
                        {usuario ? usuario.fullname : "No hay nombre"}
                    </Text>
                    <Text>
                        friends
                    </Text>
                </View>
            </View>
            <View style={{ height: "50%", position: "relative", gap: 20 }}>
                <TextInput
                    style={{ fontSize: 20 }}
                    value={messagePost}
                    onChangeText={setMessagePost}
                    placeholder="What's on your mind?"
                    autoFocus={true}
                >
                </TextInput>
                <View style={{}}>
                    {image === null && video === null ? (
                        <></>
                    ) : (
                        image != null && video === null? (
                            <View style={{ justifyContent: "center", alignItems: "center", gap: 10 }}>
                                <Image
                                    source={{ uri: image }}
                                    style={{ width: "100%", height: "100%" }}
                                />
                            </View>
                        ) :  (
                            video && (
                                <Video
                                  source={{ uri: video }}
                                  style={styles.video}
                                  useNativeControls
                                  resizeMode="contain"
                                />    
                            )
                        )
                    )}
                </View>
                <View style={{ gap: 10 }}>
                    <View style={{ borderColor: "gray", borderWidth: 1, borderRadius: 5, padding: 15, width: "100%", flexDirection: "row", gap: 20 }}>
                        <Text>Añade a tu publicación</Text>
                        <TouchableOpacity onPress={pickImage}><Icon name="image" size={20} color="blue" /></TouchableOpacity>
                        <TouchableOpacity onPress={pickVideo}><Icon name="video-camera" size={20} color="#79A4F9" /></TouchableOpacity>
                        <Icon name="user" size={20} color="green" />
                        <Icon name="smile-o" size={20} color="#E8F979" />
                        <Icon name="map-marker" size={20} color="red" />
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'start' }}>
                        <ModalSelector
                            data={data}
                            initValue="Select an option"
                            onChange={(option) => setSelectedItem(option.label)}
                            selectStyle={{ backgroundColor: 'black' }}
                            optionTextStyle={{ color: "white" }}
                        >
                            <TouchableOpacity style={{ padding: 8, borderWidth: 1, borderColor: 'black', borderRadius: 5 }}>
                                <Text style={{ textAlign: "center" }}>{selectedItem || 'Eliga una opcion'}</Text>
                            </TouchableOpacity>
                        </ModalSelector>
                    </View>
                    <View style={{ position: "", bottom: 1, width: "100%" }}>
                        <TouchableOpacity style={[!messagePost && !image && !video ? styles.botonDisabled : styles.botonEnabled]} onPress={handleButtonPress} disabled={!messagePost && !image && !video}><Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Publicar</Text></TouchableOpacity>
                    </View>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        borderTopColor: "gray",
        borderTopWidth: 1,
        backgroundColor: 'white',
        flex: 1,
        padding: 15,
        gap: 20
    },
    contenedorImagen: {
        width: 45, // Ancho del contenedor
        height: 45, // Alto del contenedor
        borderRadius: 50, // Mitad del ancho/alto para hacerlo circular
        overflow: "hidden"
    },

    imagen: {
        width: 45, // Ancho del contenedor
        height: 45, // Alto del contenedor
    },

    botonEnabled: {
        padding: 15,
        backgroundColor: "#FF9F43",
        borderRadius: 7
    },

    botonDisabled: {
        backgroundColor: "#FED77C",
        padding: 15,
        borderRadius: 7
    },
    video: {
        width: '100%',
        height: "100%",
        backgroundColor: "white",
    },
});
