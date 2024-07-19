import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import { useAuth } from "../AuthContext";
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
        const storedName = await AsyncStorage.getItem('name');
        const storedLastName = await AsyncStorage.getItem('lastName');
        const storedDate = await AsyncStorage.getItem('date');
        const storedGenre = await AsyncStorage.getItem('genre');
        const storedDistrict = await AsyncStorage.getItem('location')
        const storedCarreer = await AsyncStorage.getItem('carreer');
        const storedNickname = await AsyncStorage.getItem('nickname');

        const storedEmail = await AsyncStorage.getItem('email');
        const storedPassword = input;
        const storedRole = "Usuario";

        const student = {
            fullname: storedName + " " + storedLastName,
            fecha_nacimiento: storedDate,
            genre: storedGenre,
            distrito: storedDistrict,
            carreraProfesional: storedCarreer,
            photo: null,
            biografia: "",
            nickname: storedNickname,
        };

        const user = {
            email: storedEmail,
            password: storedPassword,
            rol: storedRole
        };

        const SignUpDTO = {
            student: student,
            user: user,
        };

        try {
            const response = await axios.post('http://192.168.253.48:9000/api/users/signUp', SignUpDTO);
            if (response.data) {
                guardarDatosUsuario(response.data);
                //navigation.navigate('Inicio');
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