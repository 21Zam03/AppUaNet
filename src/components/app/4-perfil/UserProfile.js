import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import UserHeader from "./UserHeader";
import UserInfo from "./UserInfo";
import UserOpciones from "./UserOpciones";
import { useNavigation } from '@react-navigation/native';

export default function UserProfile() {
    const route = useRoute();
    const { idStudent } = route.params;
    const [optionsVisible, setOptionsVisible] = useState(false);
    const openOptions = () => {
        setOptionsVisible(!optionsVisible);
    };

    const navigation = useNavigation();
    const verPublicaciones = () => {
        navigation.navigate('VerPublicaciones', {
            idStudent: idStudent
        });
    };
    
    return (
        <ScrollView>
            <View style={styles.contenedor}>
                <UserHeader idStudent={idStudent} openOptions={openOptions}/>
                {optionsVisible ? <UserOpciones verPublicaciones={verPublicaciones}/> : null}
                <UserInfo idStudent={idStudent} />
            </View>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: "white",
    },
});