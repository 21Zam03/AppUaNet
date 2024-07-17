import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import TopBarNavigation from "./top_navigator/TopBarNavigator";

export default function Inicio() {
    const navigation = useNavigation();

    const handleSearchIconPress = () => {
        navigation.navigate('Buscador')
    };

    return (
        <View style={inicio_styles.contenedorPadre}>
            <View style={inicio_styles.contenedor1}>
                <Image source={require('../../../../assets/logo-inicio.png')} style={inicio_styles.logo_inicio} />
                <TouchableOpacity onPress={handleSearchIconPress} style={inicio_styles.lupita}>
                    <Icon name="search1" size={24} color="#000" />
                </TouchableOpacity>
            </View>
            <View style={inicio_styles.contenedor2}>
                <TopBarNavigation/>
            </View>
        </View>
    );
}

const inicio_styles = StyleSheet.create({
    contenedorPadre: {
        flex: 1,
        backgroundColor: "white",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "start"
    },

    contenedor1: {
        marginTop: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingRight: 17,
        paddingLeft: 4
    },

    contenedor2: {
        flex: 1,
    },

    logo_inicio: {
        width: 130,
        height: 26,
    },

    lupita: {
        backgroundColor: "white",
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 7,
        paddingRight: 7,
        borderRadius: 20
    }
});