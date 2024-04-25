import { View, TextInput, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from 'react';
import { useAuth } from "./AuthContext";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const { handleLogin } = useAuth();

    const handleButtonPress = () => {
        setLoading(true);
        // Aquí colocarías la lógica para realizar alguna tarea que requiera tiempo
        setMessage(handleLogin(username, password));
        setTimeout(() => {
            setLoading(false); // Cuando la tarea finalice, ocultar el efecto de carga
        }, 4000);
    };

    return (
        <View style={login_styles.contenedor}>
            {loading ? (
                <ActivityIndicator size="large" color="#000000" />
            ) : (
                <View>
                    <View style={login_styles.username_contenedor}>
                        <Text style={login_styles.label}>Usuario:</Text>
                        <TextInput
                            style={login_styles.input}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Digita tu nombre de usuario"
                            autoCapitalize="none"
                        />
                    </View>
                    <View style={login_styles.password_contenedor}>
                        <Text style={login_styles.label}>Contraseña:</Text>
                        <TextInput
                            style={login_styles.input}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Digita tu contraseña"
                            secureTextEntry={true}
                            autoCapitalize="none"
                        />
                    </View>
                    <View>
                        <Text style={{textAlign: "center", color: "red"}}>{message}</Text>
                    </View>
                    <View>
                        <Text style={{ textAlign: 'center', marginBottom: 10 }}>¿Olvidastes la contraseña?</Text>
                    </View>
                    <View>
                        <TouchableOpacity style={login_styles.boton} onPress={() => handleButtonPress()}>
                            <Text style={{ color: '#ffffff', textAlign: 'center' }}>INICIAR SESIÓN</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const login_styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        paddingTop: 100,
        padding: 20,
        backgroundColor: "#FF9F43",
        gap: 15
    },

    username_contenedor: {
        gap: 10
    },

    password_contenedor: {
        gap: 10
    },

    input: {
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ffffff',
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 15,
        paddingBottom: 15,
        borderRadius: 7,
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
        backgroundColor: "#000000",
        padding: 20,
        borderRadius: 30
    }

});
