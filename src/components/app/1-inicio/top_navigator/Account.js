import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useAuth } from "../../../AuthContext";
import { useState, useEffect } from "react";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/FontAwesome';

export default function Account() {
    const { handleLogout } = useAuth();

    const [usuario, setUsuario] = useState(null);
    const { obtenerDatosUsuario } = useAuth();

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

    return (
        <View style={styles.contenedorPadre}>
            <View style={styles.contenedorFirst}>
                {usuario && usuario.photo ? (
                    <Image
                        source={{ uri: `data:image/png;base64,${usuario.photo}` }}
                        style={styles.imagen}
                    />
                ) : (
                    <Image
                        source={require('../../../../../assets/photo-perfil.png')}
                        style={styles.imagen}
                    />
                )}
                <View>
                    <Text style={styles.texto}>{usuario ? usuario.fullname : ".........."}</Text>
                    <Text style={styles.nicknameText}>@{usuario ? usuario.nickname : "......"}</Text>
                </View>
            </View>
            <View style={styles.contenedorSecond}>
                <View style={styles.child}>
                    <TouchableOpacity style={styles.iconContainer}>
                        <Icon2 name="bookmark" size={25} color="#FF9F43" />
                        <Text>Guardados</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.child}>
                    <TouchableOpacity style={styles.iconContainer}>
                        <Icon name="user-friends" size={25} color="#FF9F43" />
                        <Text>Amigos</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.child}>
                    <TouchableOpacity style={styles.iconContainer}>
                        <Icon name="video" size={25} color="#FF9F43" />
                        <Text>Video</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.child}>
                    <TouchableOpacity style={styles.iconContainer}>
                        <Icon name="calendar-alt" size={25} color="#FF9F43" />
                        <Text>Eventos</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.logoutContainer}>
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedorPadre: {
        flex: 1,
        padding: 10,
        gap: 20
    },
    contenedorFirst: {
        padding: 15,
        borderRadius: 5,
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        backgroundColor: "white",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    contenedorSecond: {
        borderRadius: 5,
        flexDirection: "row",
        gap: 10,
        flexWrap: 'wrap',
        justifyContent: "space-between",
        alignItems: 'center',
    },
    child: {
        padding: 15,
        borderRadius: 5,
        width: "48%",
        backgroundColor: "white",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    imagen: {
        width: 45,
        height: 45,
        borderRadius: 50
    },
    texto: {
        fontWeight: "bold",
        fontSize: 18
    },
    nicknameText: {
        color: "gray"
    },
    iconContainer: {
        gap: 5
    },
    logoutContainer: {
        padding: 15,
        backgroundColor: "#E3E3DF",
        borderRadius: 5
    },
    logoutText: {
        textAlign: "center",
        fontWeight: "bold"
    }
});
