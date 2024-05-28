import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";


export default function SignUpPassword() {
    const navigation = useNavigation();

    const [isValid, setIsValid] = useState(true);
    const [isEqual, setIsEqual] = useState(true);
    const [input, setInput] = useState('');
    const [input2, setInput2] = useState('');
    const { guardarDatosUsuario } = useAuth();

    const handleButtonPress = async () => {
        const formData = new FormData();
        try {
            const storedName = await AsyncStorage.getItem('name');
            const storedLastName = await AsyncStorage.getItem('lastName');
            const storedDate = await AsyncStorage.getItem('date');
            const storedGenre = await AsyncStorage.getItem('genre');
            const storedDistrict = await AsyncStorage.getItem('location')
            const storedCarreer = await AsyncStorage.getItem('carreer');

            const storedEmail = await AsyncStorage.getItem('email');
            const storedPassword = input;
            const storedRole = "Usuario"

            formData.append("fullname", storedName + " " + storedLastName);
            formData.append("fecha_nacimiento", storedDate);
            formData.append("genero", storedGenre);
            formData.append("distrito", storedDistrict);
            formData.append("carreraProfesional", storedCarreer);
            formData.append("photo", null);
            formData.append("email", storedEmail);
            formData.append("password", storedPassword);
            formData.append("rol", storedRole);

            const response = await axios.post('http://192.168.1.39:9000/api/students', formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data) {
                guardarDatosUsuario(response.data);
                console.log(response.data);
                navigation.navigate('Inicio');
            }
        } catch (e) {
            console.error('Error retrieving data', e);
        }
    };

    const handleInputChange = (text) => {
        setInput(text);
        setIsValid(text.length >= 7);
    };

    const handleInputChange2 = (text) => {
        setInput2(text);
        setIsEqual(text === input);
    };

    return (
        <View style={styles.contenedor}>
            <View style={styles.contenedorQuestion}>
                <Text style={styles.textQuestionName}>Crear una contraseña</Text>
                <Text>Cree una contraseña que contenga almenos 6 caracteres de longitud. Una contraseña segura es una combinación de letras, numeros y tildes.</Text>
            </View>
            <View style={styles.contenedorInputs}>
                <TextInput style={styles.inputs} onChangeText={handleInputChange} value={input} placeholder="Contraseña" secureTextEntry={true}></TextInput>
                {!isValid ? (
                    <View>
                        <Text style={styles.errorText}>Ingresa al menos 7 caracteres</Text>
                    </View>
                ) : (
                    <Text style={styles.validText}>Contraseña válida</Text>
                )}
            </View>
            <View style={styles.contenedorInputs}>
                <TextInput style={styles.inputs} onChangeText={handleInputChange2} value={input2} placeholder="Repetir caontraseña" secureTextEntry={true}></TextInput>
                {!isEqual ? (
                    <Text style={styles.errorText}>La contraseñas deben coincidir</Text>
                ) : (
                    <Text style={styles.validText}>Contraseñas coinciden</Text>
                )}
            </View>
            <View>
                <TouchableOpacity style={[!isValid || !isEqual ? styles.botonDisabled : styles.botonEnabled]} onPress={handleButtonPress} disabled={!isValid || !isEqual}><Text style={styles.textBoton}>Siguiente</Text></TouchableOpacity>
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
        gap: 10,
    },

    textQuestionName: {
        fontSize: 25,
        fontWeight: "bold"
    },

    contenedorInputs: {
        gap: 5,
    },

    inputs: {
        borderRadius: 10,
        borderColor: "black",
        borderWidth: 1,
        padding: 13,
        fontSize: 17
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
        textAlign: "center",
        fontSize: 16
    },

    textCuenta: {
        textAlign: "center",
        color: "#FF9F43",
        fontWeight: "bold",
    },

    errorText: {
        color: "#FF9F43",
        paddingLeft: 15
    },

    validText: {
        color: "green",
        paddingLeft: 15
    },

});