import { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, ScrollView } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useRef, useEffect } from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useRoute } from '@react-navigation/native';

export default function EditIA() {
    const route = useRoute();
    const { usuario } = route.params;

    const [listTags, setListTags] = useState(usuario.intereses);
    const [tag, setTag] = useState();

    const seleccionarTag = () => {
        setListTags([...listTags, tag]);
        setTag("");
    }

    const eliminarTag = (tag) => {
        setListTags(listTags.filter(t => t !== tag));
    }

    const tagRef = useRef(null);
    useEffect(() => {
        if (tagRef.current) {
            tagRef.current.focus();
        }
    }, []);

    const { eliminarDatosUsuario } = useAuth();
    const { guardarDatosUsuario } = useAuth();

    const guardarCambios = async () => {
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
                uri: `data:image/jpeg;base64,${usuario.photo}`,
                name: 'photo.jpg',
                type: 'image/jpeg',
            });
            formData.append('biografia', usuario.biografia ? usuario.biografia : " ");
            formData.append('intereses', JSON.stringify(listTags));
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
        }
    }
    return (
        <View style={styles.contenedor}>
            <TextInput
                style={styles.textInput}
                placeholder="Digita tus intereses"
                value={tag}
                onChangeText={setTag}
                onSubmitEditing={seleccionarTag}
                ref={tagRef}
                returnKeyType="done"
            ></TextInput>
            <View style={{ flexDirection: "row", flexWrap: 'wrap', justifyContent: 'flex-start', gap: 10 }}>
                {listTags.map((tag, index) => (
                    <View key={index} style={{ flexDirection: "row", backgroundColor: "#E9F0E5", padding: 10, borderRadius: 10, gap: 5 }}>
                        <View>
                            <Text style={{ fontSize: 15 }}>{tag}</Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => eliminarTag(tag)}>
                                <Icon name="close" size={20} color="#900" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity style={[listTags.length === 0 ? styles.botonDisactive : styles.botonActive]} disabled={listTags.length === 0 ? true : false} onPress={guardarCambios}>
                    <Text style={styles.texto}>Guardar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        gap: 20,
        backgroundColor: "white",
        padding: 10
    },

    textInput: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 10,
        borderBottomColor: "black",
        borderWidth: 1
    },

    botonActive: {
        backgroundColor: "#FF9F43",
        padding: 15,
        borderRadius: 30,
        width: "100%"
    },

    botonDisactive: {
        backgroundColor: "#FF9F43",
        padding: 15,
        borderRadius: 30,
        width: "100%"
    },

    texto: {
        color: "white",
        textAlign: "center"
    }
});