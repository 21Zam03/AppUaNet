import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useState, useRef, useEffect } from "react";
import SignUpPassword from "./SignUpPassword";

export default function SignUpCode() {
    const navigation = useNavigation();
    const [timer, setTimer] = useState(60);
    const [message, setMessage] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const intervalRef = useRef(null);
    const [confirmationCode, setConfirmationCode] = useState(['', '', '', '', '']);
    const inputRefs = useRef([]);

    useEffect(() => {
        startTimer();
        return () => {
            clearInterval(intervalRef.current);
        };
    }, []);

    useEffect(() => {
        if (timer === 0) {
            setIsModalVisible(true);
            clearInterval(intervalRef.current);
        }
    }, [timer]);

    const startTimer = () => {
        intervalRef.current = setInterval(() => {
            setTimer(prevTimer => prevTimer - 1);
        }, 1000);
    };

    const redirectToSignUpPassword = () => {
        const code = confirmationCode.join('');
        if (code === "12345") {
            clearInterval(intervalRef.current);
            navigation.navigate('SignUpPassword')
        } else {
            setMessage(true)
            console.log("Codigo de confirmacion incorrecta")
        }
    }

    // Función para manejar el cambio en un input individual
    const handleInputChange = (text, index) => {
        // Asegúrate de que solo se ingresen números y que no haya más de 1 dígito
        const formattedText = text.replace(/[^0-9]/g, '').substring(0, 1);
        const newConfirmationCode = [...confirmationCode];
        newConfirmationCode[index] = formattedText;
        setConfirmationCode(newConfirmationCode);
        // Si hay un siguiente input, enfócalo
        if (inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const resetTimer = () => {
        setIsModalVisible(false);
        setMessage(false);
        setTimer(60); // Restablecer el temporizador a 60 segundos
        startTimer();
    };

    return (
        <View style={styles.contenedor}>
            <View style={styles.contenedorQuestion}>
                <Text style={styles.textQuestionName}>Digite el codigo</Text>
                <Text>Se le acaba de enviar un codigo de confirmacion al correo institucional jzambranoh@autonoma.edu.pe </Text>
                <Text>codigo de 5 digitos</Text>
            </View>
            <View style={{ alignItems: "center" }}>
                <Text style={styles.textTimer}>{`Tiempo restante: ${timer} segundos`}</Text>
            </View>
            <View style={styles.contenedorInputs}>
                {confirmationCode.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => (inputRefs.current[index] = ref)}
                        style={styles.inputs}
                        value={digit}
                        onChangeText={(text) => handleInputChange(text, index)}
                        keyboardType="numeric"
                        maxLength={1}
                        placeholder="0"
                    />
                ))}
            </View>
            {
                message && (
                    <View>
                        <Text style={styles.textMessage}>¡La clave es incorrecta!</Text>
                    </View>
                )
            }
            <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.contenedorModal}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>¡El tiempo ha expirado!</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={resetTimer}
                        >
                            <Text style={styles.textBoton}>Recibir nuevo codigo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View>
                <TouchableOpacity style={[confirmationCode.some(code => code === '') ? styles.botonDisabled : styles.botonEnabled]} onPress={redirectToSignUpPassword} disabled={confirmationCode.some(code => code === '')}><Text style={styles.textBoton}>Siguiente</Text></TouchableOpacity>
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
        alignItems: "center"
    },

    textQuestionName: {
        fontSize: 25,
        fontWeight: "bold"
    },

    contenedorInputs: {
        gap: 5,
        flexDirection: "row",
        justifyContent: "center"
    },

    inputs: {
        borderRadius: 10,
        borderColor: "black",
        borderWidth: 1,
        padding: 13,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold"
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

    contenedorModal: {
        padding: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },

    modalView: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        gap: 20,
        alignItems: "center",
        width: "100%"
    },

    modalText: {
        color: "black"
    },

    closeButton: {
        backgroundColor: "#FF9F43",
        padding: 10,
        borderRadius: 30,
        width: "60%"
    },

    textMessage: {
        color: "red",
        textAlign: "center"
    }

});