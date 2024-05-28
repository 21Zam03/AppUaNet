import { View, TextInput, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpLocation () {
    const [location, setLocation] = useState("");

    const navigation = useNavigation();

    const redirectToLogin = () => {
        navigation.navigate('Login')
    }

    const redirectToSignUpEmail = async () => {
        try {
            await AsyncStorage.setItem('location', location);
            navigation.navigate('SignUpEmail')
        } catch (e) {
            console.error('Error guardando los datos', e);
        }
    }

    return (
        <View style={styles.contenedor}>
            <View style={styles.contenedorQuestion}>
                <Text style={styles.textQuestionName}>¿En que distrito vives?</Text>
                <Text>Digita el distrito real de tu residencia</Text>
            </View>
            <View style={styles.contenedorInputs}>
                <TextInput style={styles.inputs} value={location} onChangeText={setLocation} placeholder="Nombres"></TextInput>
            </View>
            <View>
                <TouchableOpacity style={[!location ? styles.botonDisabled : styles.botonEnabled]} onPress={redirectToSignUpEmail} disabled={!location}><Text style={styles.textBoton}>Siguiente</Text></TouchableOpacity>
            </View>
            <View style={{ position: "absolute", bottom: 20, right: 15, width: "100%" }}>
                <TouchableOpacity onPress={redirectToLogin}><Text style={styles.textCuenta}>¿Ya tienes una cuenta?</Text></TouchableOpacity>
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

    contenedorInputs: {
        flexDirection: "row",
        gap: 10,
    },

    textQuestionName: {
        fontSize: 25,
        fontWeight: "bold"
    },

    inputs: {
        borderRadius: 10,
        borderColor: "black",
        borderWidth: 1,
        padding: 10,
        width: "100%"
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