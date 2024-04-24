import { View, Text, StyleSheet, Image } from "react-native";
import PostUser from "./PostUser";

export default function Post() {
    return (
        <View style={styles.container}>
            <PostUser />
            <View style={styles.textContainer}>
                <Text>Hola mundo asdasds sad adasd asd asd asd asd asd adasdas dasd asd assd asd asd asd as dasdas dS</Text>
            </View>
            <View>
                <Image
                    source={require('../../assets/postimg.jpg')}
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
        borderColor: "#E7E1E0"
    },

    textContainer: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 14,
        paddingLeft: 14,
    }
});