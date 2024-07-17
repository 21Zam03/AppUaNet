import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Autocomplete from 'react-native-autocomplete-input';

export default function SignUpCarreer() {
    // Logica para el autocomplete
    const PROFESSIONS = [
        'Ingeniería de Software',
        'Medicina',
        'Derecho',
        'Arquitectura',
        'Ingeniería Civil',
        'Psicología',
        'Administración de Empresas',
        'Contabilidad',
    ];
    const [query, setQuery] = useState('');
    const [filteredProfessions, setFilteredProfessions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const handleChange = (text) => {
        setQuery(text);
        if (text) {
            const filtered = PROFESSIONS.filter((item) =>
                item.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredProfessions(filtered);
            setShowDropdown(true);
        } else {
            setFilteredProfessions([]);
            setShowDropdown(false);
        }
    };
    const handleSelect = (item) => {
        setQuery(item);
        setFilteredProfessions([]);
        setShowDropdown(false);
    };

    const navigation = useNavigation();
    const redirectToLogin = () => {
        navigation.navigate('Login')
    }

    const redirectToSignUpLocation = async () => {
        try {
            await AsyncStorage.setItem('carreer', query);
            navigation.navigate('SignUpLocation')
        } catch (e) {
            console.error('Error guardando los datos', e);
        }
    }

    return (
        <View style={styles.contenedor}>
            <View style={styles.contenedorQuestion}>
                <Text style={styles.textQuestionName}>¿Cuál es tu carrera profesional?</Text>
                <Text>Digita el nombre de tu carrera profesional en la cual perteneces a la universidad Autónoma del Perú</Text>
            </View>
            <View style={styles.autocompleteWrapper}>
                <View style={styles.autocompleteContainer}>
                    <Autocomplete
                        data={filteredProfessions}
                        defaultValue={query}
                        onChangeText={(text) => handleChange(text)}
                        placeholder="Selecciona tu carrera"
                        autoFocus={true}
                        flatListProps={{
                            keyExtractor: (item) => item,
                            renderItem: ({ item }) => (
                                <TouchableOpacity onPress={() => handleSelect(item)} style={styles.itemTouchable}>
                                    <Text style={styles.itemText}>{item}</Text>
                                </TouchableOpacity>
                            ),
                        }}
                        inputContainerStyle={styles.inputContainer}
                        listContainerStyle={styles.listContainer}
                        listStyle={styles.list}
                    />
                </View>
            </View>
            <View>
                <TouchableOpacity style={[!query ? styles.botonDisabled : styles.botonEnabled]} onPress={redirectToSignUpLocation} disabled={!query}>
                    <Text style={styles.textBoton}>Siguiente</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.loginContainer}>
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
    autocompleteWrapper: {
        zIndex: 1,
        height: 50
    },
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
    itemTouchable: {
        width: "100%"
    },
    itemText: {
        padding: 10,
        fontSize: 16,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    botonEnabled: {
        backgroundColor: "#FF9F43",
        padding: 15,
        borderRadius: 30,
    },
    botonDisabled: {
        backgroundColor: "#FED77C",
        padding: 15,
        borderRadius: 30,
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
    loginContainer: {
        position: "absolute",
        bottom: 20,
        right: 15,
        width: "100%"
    }
});
