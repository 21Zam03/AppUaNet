import { View, Text, StyleSheet, Image, TextInput } from "react-native";
import axios from 'axios';
import { useEffect, useState } from "react";


export default function PostUser({idStudent}) {
    const [student, setStudent] = useState();
    useEffect(() => {
        // Realizar la petición Axios para obtener la lista de publicaciones
        axios.get(`http://192.168.1.39:9000/api/students/${idStudent}`)
            .then(response => {
                // Actualizar el estado con la lista de publicaciones recibidas
                console.log("Se obtuvo al estudiante")
                setStudent(response.data)
            })
            .catch(error => {
                console.error('Error al obtener al estudiante:', error);
            });
    }, []);
    
    return (
        <View style={styles.contenedorPadre}>
            <View style={styles.contenedorImagen}>
                <Image
                    source={require('../../assets/loboPerfil.jpg')}
                    style={styles.imagen}
                />
            </View>
            <View style={styles.contenedorInput} >
                <Text style={styles.textInput}>{student ? student.fullname : 'valor predeterminado'}</Text>
                <Text style={styles.textInput}>1h</Text>
            </View>
            <View style={styles.contenedorOpciones} >
                <Text>...</Text>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    contenedorPadre: {
        paddingRight: 14,
        paddingLeft: 14,
        flexDirection: "row",
        justifyContent: "start",
        alignItems: "center",
        gap: 20,
    },

    contenedorImagen: {
        width: 35, // Ancho del contenedor
        height: 35, // Alto del contenedor
        borderRadius: 50, // Mitad del ancho/alto para hacerlo circular
        overflow: "hidden",
    },

    imagen: {
        width: 35, // Ancho del contenedor
        height: 35, // Alto del contenedor
    },

    contenedorInput: {
        width: "65%",
    },

    contenedorOpciones: {
        width: "10%",
        justifyContent: "start",
        alignItems: "center"
    },

})