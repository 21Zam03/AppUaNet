import { View, TextInput, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useState } from "react";
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

export default function SearchBar({ onSearch }) {
    
    const [searchQuery, setSearchQuery] = useState('');

    const handleChangeText = (text) => {
        setSearchQuery(text);
        onSearch(text); // Llama a la función de callback con el texto de búsqueda
    };

    const clearInput = () => {
        setSearchQuery('');
        onSearch('');
    };

    return (
        <View style={styles.container}> 
            <TextInput
                style={styles.input}
                placeholder="Buscar..."
                autoFocus={true}
                onChangeText={handleChangeText}
                value={searchQuery}
                onSubmitEditing={() => handleSearch(searchQuery)}
                
            />
            {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearInput} style={styles.clearButton}>
                    <Icon name="clear" size={14} color="white" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', // Alinea el contenido en una fila
        alignItems: 'center', // Centra verticalmente el contenido
        justifyContent: "center"
    },

    input: {
        width: width * 0.8,
        height: 40,
        borderColor: '#E9F0EF',
        borderWidth: 1,
        paddingLeft: 20,
        borderRadius: 20,
        backgroundColor: "#E9F0EF",
        color: "#707473",
        fontSize: 16
    },

    clearButton: {
        position: 'absolute',
        right: 10,
        backgroundColor: "#707473",
        borderRadius: 50,
        padding: 4
    }
});