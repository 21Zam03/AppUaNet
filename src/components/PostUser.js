import { View, Text, StyleSheet, Image, TextInput } from "react-native";

export default function PostUser() {
    return (
        <View style={styles.contenedorPadre}>
            <View style={styles.contenedorImagen}>
                <Image
                    source={require('../../assets/Korolova.jpg')}
                    style={styles.imagen}
                />
            </View>
            <View style={styles.contenedorInput} >
                <Text style={styles.textInput}>Korolova Carlson</Text>
                <Text style={styles.textInput}>1h</Text>
            </View>
            <View style={styles.contenedorOpciones} >
                <Text>...</Text>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    contenedorPadre: {
        paddingRight: 14,
        paddingLeft: 14,
        flexDirection: "row",
        justifyContent: "start",
        alignItems: "center",
        gap: 20,
    },

    contenedorImagen: {
        width: 35, // Ancho del contenedor
        height: 35, // Alto del contenedor
        borderRadius: 50, // Mitad del ancho/alto para hacerlo circular
        overflow: "hidden",
    },

    imagen: {
        width: 35, // Ancho del contenedor
        height: 35, // Alto del contenedor
    },

    contenedorInput: {
        width: "65%",
    },

    contenedorOpciones: {
        width: "10%",
        justifyContent: "center",
        alignItems: "center"
    },

})