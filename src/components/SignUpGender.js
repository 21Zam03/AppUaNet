import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useState, useMemo } from "react";
import RadioGroup from 'react-native-radio-buttons-group';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpGender() {
    const [selectedId, setSelectedId] = useState();

    const navigation = useNavigation();

    const redirectToLogin = () => {
        navigation.navigate('Login')
    }

    const redirectToSignUpCarreer = async () => {
        const selectedRadio = radioButtons.find(radio => radio.id === selectedId);
        if (selectedRadio) {
            await AsyncStorage.setItem('genre', selectedRadio.value);
            navigation.navigate('SignUpCarreer');
        }
    }

    const radioButtons = useMemo(() => ([
        {
            id: '1', // identificador único
            label: 'Femenino',
            value: 'femenino',
            selected: true, // Seleccionado por defecto
        },
        {
            id: '2', // identificador único
            label: 'Masculino',
            value: 'masculino',
        },
        {
            id: '3', // identificador único
            label: 'Más opciones',
            value: 'indefinido',
        },
    ]), []);

    return (
        <View style={styles.contenedor}>
            <View style={styles.contenedorQuestion}>
                <Text style={styles.textQuestionName}>¿Cual es tu genero?</Text>
                <Text>Puedes cambiar quien puede ver tu genero en tu perfil</Text>
            </View>
            <View style={styles.contenedorRadioButton}>
                <RadioGroup
                    radioButtons={radioButtons}
                    onPress={setSelectedId}
                    containerStyle={styles.radioGroup}
                    selectedId={selectedId}
                />
            </View>
            <View>
                <TouchableOpacity style={[!selectedId ? styles.botonDisabled : styles.botonEnabled]} disabled={!selectedId} onPress={redirectToSignUpCarreer}><Text style={styles.textBoton}>Siguiente</Text></TouchableOpacity>
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

    textQuestionName: {
        fontSize: 25,
        fontWeight: "bold"
    },

    contenedorRadioButton: {
        alignItems: "center",
        flexDirection: "row",
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "black"
    },

    radioGroup: {
        justifyContent: "center",
        alignItems: "start",
    },

    selectedButton: {
        backgroundColor: 'lightblue', // Cambia el color de fondo cuando se selecciona
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