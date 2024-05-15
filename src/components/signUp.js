import { View, TextInput, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from 'react';
import { useAuth } from "./AuthContext";

export default function SignUp() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const { handleLogin } = useAuth();

    const handleButtonPress = async () => {
        setLoading(true);
        try {
            const resultMessage = await handleLogin(email, password);
            setMessage(resultMessage);
        } catch (error) {
            console.error('Error al manejar el inicio de sesión:', error);
        } finally {
            setTimeout(() => {
                setLoading(false); // Cuando la tarea finalice, ocultar el efecto de carga
            }, 4000);
        }
    };
    return(
        <View style={signUp.contenedor}>
            {loading ? (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.1)', justifyContent: 'center', alignItems: 'center'}]}>
                    <ActivityIndicator size="large" color="#ffffff"/>
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <View style={signUp.titulo_contenedor}>
                        <Image
                            source={require('../../assets/logo-autonoma.png')}
                            style={{ width: 70, height: 40 }}
                        />
                        <Text style={{ color: "white", fontSize: 20 }}>Soy Autónoma</Text>
                        <View style={signUp.curve} />
                    </View>
                    <View style={{ paddingRight: 15, paddingLeft: 15, paddingTop: 15, paddingBottom: 15, flex: 1 }}>
                        <View style={signUp.login_contenedor}>
                            <View style={{ marginBottom: 30 }}><Text style={{ color: "#FF9F43", fontWeight: "bold", textAlign: "center", fontSize: 26 }}>REGISTRATE</Text></View>
                            <View style={signUp.username_contenedor}>
                                <Text style={signUp.label}>Correo:</Text>
                                <TextInput
                                    style={signUp.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Digita tu correo"
                                    autoCapitalize="none"
                                />
                            </View>
                            <View style={signUp.password_contenedor}>
                                <Text style={signUp.label}>Contraseña:</Text>
                                <TextInput
                                    style={signUp.input}
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Digita tu contraseña"
                                    secureTextEntry={true}
                                    autoCapitalize="none"
                                />
                            </View>
                            <View style={signUp.password_contenedor}>
                                <Text style={signUp.label}>Vuelva escribir la Contraseña:</Text>
                                <TextInput
                                    style={signUp.input}
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Digita tu contraseña"
                                    secureTextEntry={true}
                                    autoCapitalize="none"
                                />
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <TouchableOpacity style={signUp.boton} onPress={() => handleButtonPress()}>
                                    <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: "bold" }}>CREAR CUENTA</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </View>
            )}
        </View>
    );
}

const signUp = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: "#F0F3F2",
        justifyContent: "center"
    },

    username_contenedor: {
        gap: 0
    },

    password_contenedor: {
        gap: 0
    },

    titulo_contenedor: {
        backgroundColor: "#FF9F43",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        paddingTop: 80,
        paddingBottom: 40,
    },

    login_contenedor: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 20,
        paddingTop: 50,
        paddingBottom: 50,
        paddingLeft: 20,
        paddingRight: 20,
    },

    input: {
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#FF9F43",
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: '#ffffff'
    },

    label: {
        fontWeight: 'bold',
    },

    contenedor_imagen: {
        alignItems: 'center',
        justifyContent: 'center'
    },

    logo: {
        width: 300,
        height: 70,
        marginBottom: 0,
    },

    boton: {
        backgroundColor: "#FF9F43",
        padding: 20,
        borderRadius: 30
    },

    curve: {
        width: '60%',
        height: 50, // Altura de la curva
        backgroundColor: '#FF9F43', // Mismo color que el fondo del contenedor
        borderBottomLeftRadius: 100, // Radio grande para la curva
        borderBottomRightRadius: 100, // Radio grande para la curva
        transform: [{ scaleX: 2 }], // Ampliar la curva para crear el efecto
        position: 'absolute', // Colocación absoluta para que la curva no afecte al contenido
        bottom: -50, // Posición para que la curva cubra el espacio agregado en marginBottom
    },

});