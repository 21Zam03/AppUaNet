import { View, TextInput, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from "./AuthContext";
import { Animated } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Login() {

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [emailTest, setEmailTest] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordTest, setPasswordTest] = useState(false);
    const [messageTest, setMessageTest] = useState(false);

    const { handleLogin } = useAuth();

    const handleButtonPress = async () => {
        if (password === "") {
            setPasswordTest(true);
        } else {
            setPasswordTest(false);
            setLoading(true);
            try {
                const resultMessage = await handleLogin(email, password);
                setMessageTest(resultMessage);
            } catch (error) {
                console.error('Error al manejar el inicio de sesión:', error);
            } finally {
                setTimeout(() => {
                    setLoading(false); // Cuando la tarea finalice, ocultar el efecto de carga
                }, 4000);
            }
        }

    };

    const emailRef = useRef(null);
    useEffect(() => {
        if (emailRef.current) {
            emailRef.current.focus();
        }
    }, []);

    const passwordInputRef = useRef(null);
    const handleEmailSubmitEditing = () => {
        if (email === "") {
            setEmailTest(true);
        } else {
            setEmailTest(false);
            passwordInputRef.current.focus();
        }
    };

    //Animacion de cargado
    const [isVisible, setIsVisible] = useState(true);
    const fadeAnim = new Animated.Value(1);

    useEffect(() => {
        const intervalId = setInterval(() => {
            // Toggle visibility
            setIsVisible((prev) => !prev);
        }, 500); // Intervalo de parpadeo en milisegundos (500ms)

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        // Configurar la animación de desvanecimiento
        if (loading) {
            Animated.loop(
                Animated.timing(fadeAnim, {
                    toValue: isVisible ? 0 : 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ).start();
        } else {
            // Detener la animación cuando loading sea falso
            fadeAnim.setValue(1); // Reiniciar opacidad a 1
        }
    }, [loading, isVisible]);

    return (
        <View style={login_styles.contenedor}>
            {loading ? (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.1)', justifyContent: 'center', alignItems: 'center', gap: 5 }]}>
                    <ActivityIndicator size="large" color="#FF9F43" />
                    <Animated.Text style={[{ fontStyle: 'italic', opacity: fadeAnim }]}>Cargando...</Animated.Text>
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <View style={login_styles.titulo_contenedor}>
                        <Image
                            source={require('../../assets/logo-autonoma.png')}
                            style={{ width: 70, height: 40 }}
                        />
                        <Text style={{ color: "white", fontSize: 20 }}>Soy Autónoma</Text>
                        <View style={login_styles.curve} />
                    </View>
                    <View style={{ paddingRight: 15, paddingLeft: 15, paddingTop: 15, paddingBottom: 15, flex: 1 }}>
                        <View style={login_styles.login_contenedor}>
                            <View>
                                <Text style={{ color: "#FF9F43", fontWeight: "bold", textAlign: "center", fontSize: 26 }}>INICIAR SESIÓN</Text>
                            </View>
                            <View style={{ gap: 20 }}>
                                <View style={login_styles.username_contenedor}>
                                    <Text style={login_styles.label}>Correo:</Text>
                                    <TextInput
                                        style={login_styles.input}
                                        placeholder="ejemplo@autonoma.edu.pe"
                                        value={email}
                                        onChangeText={setEmail}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        ref={emailRef}
                                        onSubmitEditing={handleEmailSubmitEditing}
                                        returnKeyType="next"
                                        autoFocus={true}
                                    />
                                    {
                                        emailTest ? (
                                            <View style={{ flexDirection: "row", alignItems: "center", gap: 10}}>
                                                <Icon name="exclamation-triangle" size={15} color="orange" />
                                                <Text style={{ color: "orange" }}>Digite su correo porfavor</Text>
                                            </View>
                                        ) : (
                                            <></>
                                        )
                                    }
                                </View>
                                <View style={login_styles.password_contenedor}>
                                    <Text style={login_styles.label}>Contraseña:</Text>
                                    <TextInput
                                        style={login_styles.input}
                                        value={password}
                                        onChangeText={setPassword}
                                        placeholder="ejemplo"
                                        secureTextEntry={true}
                                        autoCapitalize="none"
                                        ref={passwordInputRef}
                                        onSubmitEditing={handleButtonPress}
                                    />
                                    {
                                        passwordTest ? (
                                            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                                <Icon name="exclamation-triangle" size={15} color="orange" />
                                                <Text style={{ color: "orange" }}>Digite su contraseña porfavor</Text>
                                            </View>
                                        ) : (
                                            <></>
                                        )
                                    }
                                </View>
                            </View>
                            {
                                messageTest ? (
                                    <View style={{ gap: 10 }}>
                                        <View>
                                            <Text style={{ textAlign: "center", color: "red" }}>El correo u contraseña son incorrectas</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <></>
                                )
                            }
                            <View>
                                <TouchableOpacity style={[!email || !password ? login_styles.botonDisabled : login_styles.botonEnabled]} onPress={() => handleButtonPress()} disabled={!email || !password}>
                                    <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: "bold" }}>INGRESAR</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity>
                                    <Text style={{ textAlign: 'center', color: "gray" }}>¿Olvidastes la contraseña?</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const login_styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: "#F0F3F2",
        justifyContent: "center"
    },

    username_contenedor: {
        gap: 5,
        position: "relative",
    },

    password_contenedor: {
        gap: 5,
        position: "relative"
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
        gap: 30
    },

    input: {
        borderWidth: 1,
        borderColor: "#FF9F43",
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 10
    },

    label: {
        color: "orange",
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

    botonEnabled: {
        backgroundColor: "#FF9F43",
        padding: 20,
        borderRadius: 30
    },

    botonDisabled: {
        backgroundColor: "#FED77C",
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
