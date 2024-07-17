import { useState } from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import StudentSearch from "./StudentSearch";
import SearchBar from "./SearchBar";
import { useNavigation } from '@react-navigation/native';

export default function Search() {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <SearchBar onSearch={handleSearch} />
                    <TouchableOpacity style={styles.optionsButton}>
                        <Icon name="options-outline" size={24} color="#000" />
                    </TouchableOpacity>
                </View>
                <StudentSearch searchQuery={searchQuery} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    innerContainer: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    backButton: {
        padding: 5,
    },
    optionsButton: {
        justifyContent: "center",
        alignItems: "center",
    },
});
