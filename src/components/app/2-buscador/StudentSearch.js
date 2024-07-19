import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { shuffleArray } from '../../../utils/shuffleArray'; // Importa la función correctamente
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Lista de ejemplo de estudiantes
const studentsData = [
    { id: '1', name: 'Juan Pérez' },
    { id: '2', name: 'Ana Gómez' },
    { id: '3', name: 'Pedro Rodríguez' },
    { id: '4', name: 'María Fernández' },
    { id: '5', name: 'Luis López' },
    { id: '6', name: 'Carlos Sánchez' },
    { id: '7', name: 'Laura Jiménez' },
    { id: '8', name: 'Jorge Martínez' },
    { id: '9', name: 'Marta Morales' },
    { id: '10', name: 'Ricardo Díaz' },
    { id: '11', name: 'Carmen García' },
    { id: '12', name: 'Alberto Castillo' },
    { id: '13', name: 'Elena Ruiz' },
    { id: '14', name: 'Fernando Herrera' },
    { id: '15', name: 'Isabel Torres' },
    { id: '16', name: 'Manuel Gil' },
    { id: '17', name: 'Patricia Castro' },
    { id: '18', name: 'Raúl Peña' },
    { id: '19', name: 'Sofía Molina' },
    { id: '20', name: 'Victoria Campos' },
    // Puedes agregar más estudiantes aquí
];

const normalizeText = (text) => {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Normaliza y elimina los diacríticos
};

export default function StudentSearch({ searchQuery }) {
    const navigation = useNavigation();
    const handlePress1 = (idStudent) => {
        navigation.navigate('PerfilStack', {
            idStudent: idStudent,
        })
    };

    const [listStudent, setListStudent] = useState([]);
    const [shuffledStudents, setShuffledStudents] = useState([]);
    useEffect(() => {
        // Realizar la petición Axios para obtener la lista de publicaciones
        axios.get(`http://192.168.253.48:9000/api/students`)
            .then(response => {
                // Actualizar el estado con la lista de publicaciones recibidas
                setListStudent(response.data)
                const shuffled = shuffleArray(response.data);
                setShuffledStudents(shuffled);
            })
            .catch(error => {
                console.error('Error al obtener al estudiante:', error);
            });
    }, []);

    // Filtra la lista de estudiantes en función de la consulta
    const filteredStudents = searchQuery.trim() === ''
        ? [] // Muestra una lista vacía si la consulta está vacía
        : shuffledStudents
            .filter(student =>
                normalizeText(student.fullname.toLowerCase()).includes(normalizeText(searchQuery.toLowerCase()))
            )
            .slice(0, 5); // Limita a los primeros 5 estudiantes

    // Función para renderizar cada elemento de la lista
    const renderItem = ({ item }) => (

        <TouchableOpacity style={styles.itemContainer} onPress={() => handlePress1(item.idStudent)}>
            {/* <Image
                source={require('../../../../assets/photo-perfil.png')}
                style={styles.profileImage}
            /> */}
            {item.photo ? (
                <Image
                    source={{ uri: `data:image/png;base64,${item.photo}` }}
                    style={styles.profileImage}
                />
            ) : (
                <Image
                    source={require('../../../../assets/photo-perfil.png')}
                    style={styles.profileImage}
                />
            )}
            <View>
                <Text style={styles.itemText}>{item.fullname}</Text>
                <Text style={styles.itemText2}>{item.nickname}</Text>
            </View>
        </TouchableOpacity>
    );

    // Componente de separador
    const ItemSeparator = () => (
        <View style={styles.separator} />
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredStudents}
                renderItem={renderItem}
                keyExtractor={item => item.idStudent}
                ItemSeparatorComponent={ItemSeparator}
                ListEmptyComponent={<Text style={styles.emptyText}></Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    itemContainer: {
        justifyContent: "start",
        alignItems: "center",
        flexDirection: "row",
        gap: 10
    },
    profileImage: {
        width: 55,
        height: 55,
        borderRadius: 55
    },
    itemText: {
        fontSize: 15,
    },
    itemText2: {
        fontSize: 15,
        color: "gray"
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: 'gray',
        marginTop: 20,
    },
    separator: {
        height: 20, // Altura del gap
        backgroundColor: 'transparent', // Fondo transparente para que el espacio sea visible
    },
});
