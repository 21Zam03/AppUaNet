import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import IconFont from 'react-native-vector-icons/FontAwesome';
import React, { useEffect, useState } from "react";
import IconIon from 'react-native-vector-icons/Ionicons';

export default function UserOpciones({ verPublicaciones, verFotos, verVideos }) {

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={verPublicaciones} style={styles.circulo}><IconIon name="grid" color={"black"} size={20} /></TouchableOpacity>
            <TouchableOpacity style={styles.circulo}><IconIon name="images-outline" color={"black"} size={20} /></TouchableOpacity>
            <TouchableOpacity style={styles.circulo}><IconIon name="film-outline" color={"black"} size={20} /></TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        backgroundColor: "#E7F0EE",
        gap: 10,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        right: 0,
        elevation: 5,
    },

    circulo: {
        padding: 6,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 50
    },
});