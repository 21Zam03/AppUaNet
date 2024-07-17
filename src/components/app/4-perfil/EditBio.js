import { View, TextInput, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { useAuth } from "../../AuthContext";
import axios from "axios";

export default function EditBio() {
    const route = useRoute();
    const { usuario } = route.params;

    const [bio, setBio] = useState(usuario.biografia);

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
            formData.append("biografia", bio);
            formData.append('intereses', JSON.stringify(usuario.intereses));
            formData.append('hobbies', JSON.stringify(usuario.hobbies));
            formData.append('nickname', usuario.nickname);
            const response = await axios.put('http://192.168.1.35:9000/api/students', formData,
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
            <View style={styles.contenedorInputs}>
                <TextInput
                    style={styles.inputs}
                    value={bio}
                    onChangeText={setBio}
                    placeholder="Escribe una pequeña biografia"
                    multiline
                    maxLength={80}
                    autoFocus={true}
                    onSubmitEditing={guardarCambios}
                ></TextInput>
            </View>
            <View>
                <Text>{bio.length}/80</Text>
            </View>
            <View>
                <TouchableOpacity style={[!bio ? styles.botonDisabled : styles.botonEnabled]} onPress={guardarCambios} disabled={!bio}><Text style={styles.textBoton}>Guardar</Text></TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: "white",
        paddingRight: 14,
        paddingLeft: 14,
        gap: 20,
        position: "relative"
    },

    contenedorInputs: {
        height: 180,
        borderBottomWidth: 1,
        borderBottomColor: "gray"
    },

    inputs: {
        borderRadius: 10,
        borderColor: "black",
    },

    botonEnabled: {
        backgroundColor: "#FF9F43",
        padding: 15,
        borderRadius: 30
    },

    botonDisabled: {
        backgroundColor: "#FED77C",
        padding: 15,
        borderRadius: 30
    },

    textBoton: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
});