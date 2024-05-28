import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState} from "react";

export default function SignUpEmail () {
    
    const [email, setEmail] = useState("");

    const navigation = useNavigation();

    const redirectToSignUpCode = async () => {
        try {
            await AsyncStorage.setItem('email', email);
            navigation.navigate('SignUpCode')
            //Guardar el codigo de confirmacion en el asyncStorage
        } catch (e) {
            console.error('Error guardando los datos', e);
        }
    }
    
    return (
        <View style={styles.contenedor}>
            <View style={styles.contenedorQuestion}>
                <Text style={styles.textQuestionName}>¿Cual es tu correo?</Text>
                <Text>Digita tu correo institucional para conectar a la plataforma</Text>
            </View>
            <View style={styles.contenedorInputs}>
                <TextInput style={styles.inputs} value={email} onChangeText={setEmail} placeholder="Correo institucional"></TextInput>
            </View>
            <View>
                <Text>Podrias recibir notificaciones y mensajes a tu correo institucional por parte de nosotros</Text>
            </View>
            <View>
                <TouchableOpacity style={[!email ? styles.botonDisabled : styles.botonEnabled]} onPress={redirectToSignUpCode}><Text style={styles.textBoton}>Siguiente</Text></TouchableOpacity>
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


    inputs: {
        borderRadius: 10, 
        borderColor: "black", 
        borderWidth: 1,
        padding: 13,
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
    }

});