import { View, Text, StyleSheet, TouchableOpacity} from "react-native";
import Autocomplete from 'react-native-autocomplete-input';
import { useState } from "react";
import { useRoute } from '@react-navigation/native';
import { useAuth } from "../../AuthContext";
import axios from "axios";

export default function EditDistrito() {
    const route = useRoute();
    const { usuario } = route.params;

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

    const { eliminarDatosUsuario } = useAuth();
    const { guardarDatosUsuario } = useAuth();
    const guardarCambios = async () => {
        const formData = new FormData();
        try {
            const fecha = new Date(usuario.fecha_nacimiento);
            const anio = fecha.getFullYear();
            const mes = fecha.getMonth() + 1; // Sumamos 1 para obtener el mes real
            const dia = fecha.getDate();
            const fechaFormateada = `${anio}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
            formData.append("idStudent", usuario.idStudent);
            formData.append("idUser", usuario.userDto.idUser);
            formData.append("fullname", usuario.fullname);
            formData.append("fecha_nacimiento", fechaFormateada);
            formData.append("genero", usuario.genre);
            formData.append('distrito', query);
            formData.append("carreraProfesional", usuario.carreraProfesional);
            formData.append('photo', {
                uri: `data:image/jpeg;base64,${usuario.photo}`,
                name: 'photo.jpg',
                type: 'image/jpeg',
            });
            formData.append('biografia', usuario.biografia ? usuario.biografia : " ");
            formData.append('intereses', JSON.stringify(usuario.intereses));
            formData.append('hobbies', JSON.stringify(usuario.hobbies));
            formData.append('nickname', usuario.nickname);
            const response = await axios.put('http://192.168.1.35:9000/api/students', formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            if (response.data) {
                eliminarDatosUsuario();
                guardarDatosUsuario(response.data);
            }
        } catch (error) {
            console.error('Error al enviar datos:', error);
            if (error.response && error.response.status === 401) {
                // Manejar el error 401 aquí
                return "¡Error no se pudo actualizar!";
            }
        }
    }

    return (
        <View style={styles.contenedor}>
            <View style={styles.contenedorAutocomplete}>
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
                <TouchableOpacity style={[!query ? styles.botonDisabled : styles.botonEnabled]} onPress={guardarCambios} disabled={!query}><Text style={styles.textBoton}>Guardar</Text></TouchableOpacity>
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

    contenedorAutocomplete: {
        zIndex: 1, height: 50
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

    //Estilos para el autocomplete
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

})