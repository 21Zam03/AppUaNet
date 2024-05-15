import { View, Text, StyleSheet, Image } from "react-native";
import PostUser from "./PostUser";

export default function Post({message, photo, idStudent }) {
    console.log("el id es: ",idStudent)
    return (
        <View style={styles.container}>
            <PostUser idStudent={idStudent} />
            <View style={styles.textContainer}>
                <Text>{message}</Text>
            </View>
            <View style={{width: "100%"}}>
                <Image
                    source={{ uri: `data:image/png;base64,${photo}` }}
                    style={styles.imagen}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        borderWidth: 1,
        paddingTop: 10,
        paddingBottom: 10,
        borderColor: "#E7E1E0",
    },

    textContainer: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 14,
        paddingLeft: 14,
    }, 

    imagen: {
        width: "100%",
        height: 400,
    }
});