import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Autocomplete from 'react-native-autocomplete-input';

export default function SignUpLocation() {
    const DISTRICTS = [
        'Ancón', 'Ate', 'Barranco', 'Breña', 'Carabayllo', 'Chaclacayo', 'Chorrillos', 'Cieneguilla',
        'Comas', 'El Agustino', 'Independencia', 'Jesús María', 'La Molina', 'La Victoria', 'Lima',
        'Lince', 'Los Olivos', 'Lurigancho', 'Lurín', 'Magdalena del Mar', 'Miraflores', 'Pachacámac',
        'Pucusana', 'Pueblo Libre', 'Puente Piedra', 'Punta Hermosa', 'Punta Negra', 'Rímac',
        'San Bartolo', 'San Borja', 'San Isidro', 'San Juan de Lurigancho', 'San Juan de Miraflores',
        'San Luis', 'San Martín de Porres', 'San Miguel', 'Santa Anita', 'Santa María del Mar',
        'Santa Rosa', 'Santiago de Surco', 'Surquillo', 'Villa El Salvador', 'Villa María del Triunfo'
    ];
    const [query, setQuery] = useState('');
    const [filteredDistricts, setFilteredDistricts] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const handleChange = (text) => {
        setQuery(text);
        if (text) {
            const filtered = DISTRICTS.filter((item) =>
                item.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredDistricts(filtered);
            setShowDropdown(true);
        } else {
            setFilteredDistricts([]);
            setShowDropdown(false);
        }
    };

    const handleSelect = (item) => {
        setQuery(item);
        setFilteredDistricts([]);
        setShowDropdown(false);
    };

    const navigation = useNavigation();

    const redirectToLogin = () => {
        navigation.navigate('Login')
    }

    const redirectToSignUpEmail = async () => {
        try {
            await AsyncStorage.setItem('location', query);
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
            <View style={styles.contenedorForm}>
                <View style={styles.autocompleteContainer}>
                    <Autocomplete
                        data={filteredDistricts}
                        defaultValue={query}
                        onChangeText={(text) => handleChange(text)}
                        placeholder="Selecciona tu distrito"
                        autoFocus={true}
                        flatListProps={{
                            keyExtractor: (item) => item,
                            renderItem: ({ item }) => (
                                <TouchableOpacity onPress={() => handleSelect(item)}>
                                    <Text style={styles.itemText}>{item}</Text>
                                </TouchableOpacity>
                            ),
                        }}
                        containerStyle={styles.autocompleteContainer}
                        inputContainerStyle={styles.inputContainer}
                        listContainerStyle={styles.listContainer}
                        listStyle={styles.list}
                    />
                </View>
            </View>
            <View>
                <TouchableOpacity style={[!query ? styles.botonDisabled : styles.botonEnabled]} onPress={redirectToSignUpEmail} disabled={!query}><Text style={styles.textBoton}>Siguiente</Text></TouchableOpacity>
            </View>
            <View style={styles.contenedorYaTienesCuenta}>
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
    },

    //Estilos de autocomplete
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    inputContainer: {
        borderRadius: 10,
        borderColor: "black",
        borderWidth: 1,
        padding: 4,
    },
    listContainer: {
        backgroundColor: "white",
    },
    list: {
        backgroundColor: "red",
        padding: 10
    },
    itemText: {
        padding: 10,
        fontSize: 16,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },

    contenedorForm: {
        zIndex: 1, height: 50
    },

    contenedorYaTienesCuenta: {
        position: "absolute", bottom: 20, right: 15, width: "100%"
    }
});