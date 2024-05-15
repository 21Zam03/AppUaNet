import { useState } from "react";
import { View, StyleSheet, TouchableOpacity, TextInput, Text } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';  
import { useRoute } from '@react-navigation/native';

export default function Search() {
    return (
        <View >
            <Text>Oopciones de busqueda</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
});