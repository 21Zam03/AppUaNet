import { useState } from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, Text } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function ({messagePost, video, image, handleButtonPress}) {
    const navigation = useNavigation();
    return (
        <View style={styles.innerContainer}>
            <View style={styles.header}>
                <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <View>
                        <Text style={{fontSize: 18}}>Crea una publicación</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={[!messagePost && !image && !video ? styles.botonDisabled : styles.botonEnabled]}
                    onPress={handleButtonPress}
                    disabled={!messagePost && !image && !video}
                >
                    <Text style={styles.botonText}>Publicar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    innerContainer: {
        marginTop: StatusBar.currentHeight,
        borderBottomWidth: 1,
        borderBottomColor: "gray",
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 15,
    },
    backButton: {
        padding: 5,
    },
    botonEnabled: {
        padding: 12,
        backgroundColor: "#FF9F43",
        borderRadius: 7,
    },
    botonDisabled: {
        backgroundColor: "#FED77C",
        padding: 12,
        borderRadius: 7,
    },
    botonText: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
    },
});