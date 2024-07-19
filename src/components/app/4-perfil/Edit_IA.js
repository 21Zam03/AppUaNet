import { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { useRoute } from '@react-navigation/native';

export default function EditIA() {
    const route = useRoute();
    const { usuario } = route.params;

    const [listTags, setListTags] = useState(usuario.intereses);
    const [tag, setTag] = useState('');

    const seleccionarTag = () => {
        if (tag.trim()) {
            setListTags([...listTags, tag.trim()]);
            setTag("");
        }
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

    const { eliminarDatosUsuario, guardarDatosUsuario } = useAuth();

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
            const response = await axios.put('http://192.168.253.48:9000/api/students', formData, {
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
                // Manejar el error 401 aquí
                return "¡Error no se pudo actualizar!";
            }
        }
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.textInput}
                placeholder="Digita tus intereses"
                value={tag}
                onChangeText={setTag}
                onSubmitEditing={seleccionarTag}
                ref={tagRef}
                returnKeyType="done"
            />
            <View style={styles.tagsContainer}>
                {listTags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                        <TouchableOpacity onPress={() => eliminarTag(tag)}>
                            <Icon name="close" size={20} color="#900" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, listTags.length === 0 && styles.buttonDisabled]}
                    disabled={listTags.length === 0}
                    onPress={guardarCambios}
                >
                    <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 10,
        gap: 20,
    },
    textInput: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderBottomColor: "black",
        borderBottomWidth: 1,
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
        alignItems: "center",
    },
    tagText: {
        fontSize: 15,
    },
    buttonContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        backgroundColor: "#FF9F43",
        padding: 15,
        borderRadius: 30,
        width: "100%",
    },
    buttonDisabled: {
        backgroundColor: "#FF9F43",
    },
    buttonText: {
        color: "white",
        textAlign: "center",
    },
});
