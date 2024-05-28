import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpBirthday() {
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        setShow(false);
        const currentDate = selectedDate || date;
        setDate(currentDate);
        setShow(Platform.OS === 'ios');
    };

    const showDatepicker = () => {
        setShow(true);
    };

    const navigation = useNavigation();

    const transformDate = (dateString) => {
        const date = new Date(dateString);

        // Obtener los componentes de la fecha
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2); // Añadir 1 al mes porque getMonth() devuelve 0-11
        const day = (`0${date.getDate()}`).slice(-2);

        // Formatear la fecha como yyyy-mm-dd
        return `${year}-${month}-${day}`;
    };

    const redirectToSignUpGender = async () => {
        const fecha = transformDate(date);
        try {
            await AsyncStorage.setItem('date', fecha);
            navigation.navigate('SignUpGender')
        } catch (e) {
            console.error('Error guardando los datos', e);
        }
    }

    return (
        <View style={styles.contenedor}>
            <View style={styles.contenedorQuestion}>
                <Text style={styles.textQuestionName}>¿Cuando es tu cumpleaños?</Text>
                <Text>Escoge tu fecha de nacimiento. Puedes ocultarlo despues si deseas</Text>
            </View>
            <View>
                <TouchableOpacity onPress={showDatepicker} style={styles.botonFecha}>
                    <Text style={styles.textBirthday}>Cumpleaños ()</Text>
                    <Text>{date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                </TouchableOpacity>
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onChange}
                    />
                )}
            </View>
            <View>
                <TouchableOpacity style={styles.boton} onPress={redirectToSignUpGender}><Text style={styles.textBoton}>Siguiente</Text></TouchableOpacity>
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

    botonFecha: {
        padding: 12,
        borderRadius: 15,
        borderWidth: 1
    },

    textBirthday: {
        color: "#434443"
    },

    textQuestionName: {
        fontSize: 25,
        fontWeight: "bold"
    },

    boton: {
        backgroundColor: "#FF9F43",
        padding: 15,
        borderRadius: 30
    },

    textBoton: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },

});

