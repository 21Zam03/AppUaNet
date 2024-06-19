import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState, useMemo } from "react";
import RadioGroup from 'react-native-radio-buttons-group';
import { useRoute } from '@react-navigation/native';
import { useAuth } from "./AuthContext";
import axios from "axios";

export default function EditGenero() {
    const route = useRoute();
    const { usuario } = route.params;

    const [selectedId, setSelectedId] = useState();

    const { eliminarDatosUsuario } = useAuth();
    const { guardarDatosUsuario } = useAuth();
    const guardarCambios = async () => {
        const selectedRadio = radioButtons.find(radio => radio.id === selectedId);
        if (selectedRadio) {
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
                formData.append("genero", selectedRadio.value);
                formData.append('distrito', usuario.distrito);
                formData.append("carreraProfesional", usuario.carreraProfesional);
                formData.append('photo', {
                    uri: `data:image/jpeg;base64,${usuario.photo}`,
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
            }
        }
    }

    const radioButtons = useMemo(() => ([
        {
            id: '1', // identificador único
            label: 'Femenino',
            value: 'femenino',
            selected: true, // Seleccionado por defecto
        },
        {
            id: '2', // identificador único
            label: 'Masculino',
            value: 'masculino',
        },
        {
            id: '3', // identificador único
            label: 'Más opciones',
            value: 'indefinido',
        },
    ]), []);

    return (
        <View style={styles.contenedor}>
            <View style={styles.contenedorRadioButton}>
                <RadioGroup
                    radioButtons={radioButtons}
                    onPress={setSelectedId}
                    containerStyle={styles.radioGroup}
                    selectedId={selectedId}
                />
            </View>
            <View>
                <TouchableOpacity style={[!selectedId ? styles.botonDisabled : styles.botonEnabled]} disabled={!selectedId} onPress={guardarCambios}><Text style={styles.textBoton}>Siguiente</Text></TouchableOpacity>
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

    contenedorQuestion: {
        gap: 10
    },

    textQuestionName: {
        fontSize: 25,
        fontWeight: "bold"
    },

    contenedorRadioButton: {
        alignItems: "center",
        flexDirection: "row",
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "black"
    },

    radioGroup: {
        justifyContent: "center",
        alignItems: "start",
    },

    selectedButton: {
        backgroundColor: 'lightblue', // Cambia el color de fondo cuando se selecciona
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

    textCuenta: {
        textAlign: "center",
        color: "#FF9F43",
        fontWeight: "bold",
    }

});