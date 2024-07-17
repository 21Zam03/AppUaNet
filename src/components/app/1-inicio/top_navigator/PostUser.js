import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from "react-native";
import { useEffect, useState, useRef } from "react";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function PostUser({ student, idPost, datePublished, studentStorage, openBottomSheet }) {
    const [timeDiff, setTimeDiff] = useState(null);
    useEffect(() => {
        const currentDate = new Date();
        const targetDateTime = new Date(datePublished);
        const differenceMs = currentDate.getTime() - targetDateTime.getTime();
        // Calculating days, hours, minutes, seconds
        const days = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((differenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((differenceMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((differenceMs % (1000 * 60)) / 1000);
        if (days > 0) {
            setTimeDiff(`${days}d`);
        } else if (hours > 0) {
            setTimeDiff(`${hours}h`)
        } else if (minutes > 0) {
            setTimeDiff(`${minutes}m`)
        } else {
            setTimeDiff(`${seconds}s`)
        }
        // Format the output
        //const formattedDiff = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
        //setTimeDiff(formattedDiff);
    }, []);

    const navigation = useNavigation();
    const handlePress1 = () => {
        navigation.navigate('PerfilStack', {
            idStudent: student.idStudent,
        })
    };

    return (
        <View style={styles.contenedorPadre}>
            <TouchableOpacity onPress={handlePress1}>
                {student && student.photo ? (
                    <View style={styles.contenedorImagen}>
                        <Image
                            source={student ? { uri: `data:image/png;base64,${student.photo}` } : "No hay foto"}
                            style={styles.imagen}
                        />
                    </View>
                ) : (
                    <View style={styles.contenedorImagen}>
                        <Image
                            source={require('../../../../../assets/photo-perfil.png')}
                            style={styles.imagen}
                        />
                    </View>
                )}
            </TouchableOpacity>
            <View style={styles.contenedorInput} >
                <TouchableOpacity onPress={handlePress1}><Text style={styles.textInput}>{student ? student.fullname : 'valor predeterminado'}</Text></TouchableOpacity>
                <Text style={{ color: "gray" }}>{timeDiff}</Text>
            </View>
            <View style={styles.contenedorOpciones} >
                <TouchableOpacity onPress={() => openBottomSheet(student.idStudent, studentStorage, idPost, "", "options")} style={{ padding: 8 }}>
                    <Icon name="ellipsis-horizontal" size={15} color="gray" />
                </TouchableOpacity>
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
        position: "relative",
        width: "10%",
        justifyContent: "start",
        alignItems: "center"
    },

    overlay: {
        padding: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },

    menuContainer: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        paddingBottom: 40,
        paddingTop: 40,
        gap: 15,
        width: "100%"
    },

    menuItem: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center"
    },

    menuItemText: {

    },

    icon: {
        borderWidth: 2, // Ancho del borde
        borderColor: '#000', // Color del borde
        borderRadius: 5, // Bordes redondeados
        padding: 5, // Espacio interno del icono
    },


})