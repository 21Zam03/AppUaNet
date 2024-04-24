import { View, TextInput, StyleSheet, Text } from "react-native";
import { useState } from "react";

export default function SearchBar() {
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Buscar..."
                autoFocus={true}
                onChangeText={setSearchQuery}
                value={searchQuery}
                onSubmitEditing={() => handleSearch(searchQuery)}
                onBlur={() => setIsSearching(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {

    },

    input: {
        height: 40,
        width: 300,
        borderColor: 'black',
        borderWidth: 1,
        paddingLeft: 20,
        borderRadius: 20,
    },
});