import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from 'react';
import { useAuth } from "../../AuthContext";
import { TextInput } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import ModalSelector from 'react-native-modal-selector';
import { Video } from 'expo-av';
import HeaderMakePost from "./HeaderMakePost";

export default function MakePost() {
    const navigation = useNavigation();
    const [usuario, setUsuario] = useState(null);
    const { obtenerDatosUsuario } = useAuth();
    const [messagePost, setMessagePost] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);

    const data = [
        { key: 0, label: 'Informativo', value: 'Info' },
        { key: 1, label: 'Diversion', value: 'Diver' },
        { key: 2, label: 'Encuesta', value: 'Encues' },
        // Agrega más opciones según sea necesario
    ];

    useEffect(() => {
        const cargarDatosUsuario = async () => {
            try {
                const usuario = await obtenerDatosUsuario();
                setUsuario(usuario);
            } catch (error) {
                console.error('Error al cargar los datos del usuario:', error);
            }
        };
        cargarDatosUsuario();
    }, []);

    const handleButtonPress = async () => {
        //const now = new Date();
        // const formattedDateTime = now.toISOString().slice(0, 19).replace('T', ' ');
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
                formData.append('photo', {
                    uri: video,
                    name: 'video',
                    type: 'video/mp4',
                });
            }
            const response = await axios.post('http://192.168.1.35:9000/api/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    withCredentials: true,
                },
            });
            if (response.data) {
                //console.log(response.data);
                navigation.navigate('Inicio');
            }
        } catch (error) {
            console.error('Error al publicar:', error);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [5, 5],
            quality: 0.3,
        });
        if (!result.cancelled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    const pickVideo = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 0.5,
        });
        if (!result.cancelled && result.assets && result.assets.length > 0) {
            setVideo(result.assets[0].uri);
        }
    };

    const deleteFile = () => {
        setImage(null);
        setVideo(null);
    }

    return (
        <View style={styles.contenedor}>
            <HeaderMakePost messagePost={messagePost} image={image} video={video} handleButtonPress={handleButtonPress}/>
            <View style={styles.header}>
                <TouchableOpacity style={styles.contenedorImagen}>
                    {usuario && usuario.photo ? (
                        <Image
                            source={{ uri: `data:image/png;base64,${usuario.photo}` }}
                            style={styles.imagen}
                        />
                    ) : (
                        <Image
                            source={require('../../../../assets/photo-perfil.png')}
                            style={styles.imagen}
                        />
                    )}
                </TouchableOpacity>
                <View>
                    <Text>{usuario ? usuario.fullname : "No hay nombre"}</Text>
                    <Text>friends</Text>
                </View>
            </View>
            <View style={styles.content}>
                <TextInput
                    style={styles.textInput}
                    value={messagePost}
                    onChangeText={setMessagePost}
                    placeholder="What's on your mind?"
                    autoFocus={true}
                />
                <View>
                    {image === null && video === null ? null : image != null && video === null ? (
                        <View style={styles.mediaContainer}>
                            <Image
                                source={{ uri: image }}
                                style={styles.image}
                            />
                            <TouchableOpacity onPress={deleteFile} style={{borderRadius: 50, borderColor: "white", borderWidth: 1, height: 30, width: 30, position: "absolute", top: 5, right: 5, justifyContent: "center", alignItems: "center"}}><Icon name="times" size={20} color="white" /></TouchableOpacity>
                        </View>
                    ) : (
                        video && (
                            <>
                                <Video
                                source={{ uri: video }}
                                style={styles.video}
                                useNativeControls
                                resizeMode="cover"
                            />
                            <TouchableOpacity onPress={deleteFile} style={{borderRadius: 50, borderColor: "black", borderWidth: 1, height: 30, width: 30, position: "absolute", top: 5, right: 5, justifyContent: "center", alignItems: "center"}}><Icon name="times" size={20} color="black" /></TouchableOpacity>
                            </>
                        )
                    )}
                </View>
            </View>
            <View style={styles.footer}>
                <View style={styles.addMedia}>
                    <View style={{backgroundColor: "#FF9F43", padding: 10, borderRadius: 50}}>
                        <TouchableOpacity onPress={pickImage}><Icon name="image" size={20} color="white" /></TouchableOpacity>
                    </View>
                    <View style={{backgroundColor: "#FF9F43", padding: 10, borderRadius: 50}}>
                        <TouchableOpacity onPress={pickVideo}><Icon name="video-camera" size={20} color="white" /></TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        backgroundColor: 'white',
        flex: 1,
    },
    header: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        padding: 15,
    },
    contenedorImagen: {
        width: 45,
        height: 45,
        borderRadius: 50,
        overflow: "hidden",
    },
    imagen: {
        width: 45,
        height: 45,
    },
    content: {
        height: "50%",
        gap: 20,
    },
    textInput: {
        fontSize: 20,
        paddingLeft: 15
    },
    mediaContainer: {
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    video: {
        width: '100%',
        height: "100%",
        backgroundColor: "white",
    },
    footer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
    },
    addMedia: {
        borderBottomColor: "gray",
        borderBottomWidth: 1,
        padding: 15,
        width: "100%",
        flexDirection: "row",
        gap: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    modalSelect: {
        backgroundColor: 'black',
    },
    modalOptionText: {
        color: "white",
    },
    modalButton: {
        padding: 8,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
    },
    modalButtonText: {
        textAlign: "center",
    },
    botonEnabled: {
        padding: 15,
        backgroundColor: "#FF9F43",
        borderRadius: 7,
    },
    botonDisabled: {
        backgroundColor: "#FED77C",
        padding: 15,
        borderRadius: 7,
    },
    botonText: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
    },
});
