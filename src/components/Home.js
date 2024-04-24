import { View, Text, StyleSheet } from "react-native";
import UserMind from "./UserMind";
import Post from "./Post";

export default function Home () {
    return (
        <View style={home_styles.contenedorPadre}>
            <UserMind/>
            <Post/>
        </View>
    );
}

const home_styles = StyleSheet.create({
    contenedorPadre: {
        flex: 1,
        backgroundColor: "white"
    }
});