import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import PostUser from "./PostUser";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState } from "react";

export default function Post({ message, photo, idStudent }) {

    const [liked, setLiked] = useState(false);
    const handlePress = () => {
        setLiked(!liked);
    };
    return (
        <View style={styles.container}>
            <PostUser idStudent={idStudent} />
            <View style={styles.textContainer}>
                <Text>{message}</Text>
            </View>
            {photo === null ? (
                <Text></Text>
            ) : (
                <View style={{ width: "100%" }}>
                    <Image
                        source={{ uri: `data:image/png;base64,${photo}` }}
                        style={styles.imagen}
                    />
                </View>
            )}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10 }}>
                <View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
                    <TouchableOpacity onPress={handlePress} style={{ width: 30 }}>
                        <View>
                            <Icon
                                name={liked ? "heart" : "heart-outline"}
                                size={25}
                                color={liked ? "red" : "black"}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: 30 }}>
                        <Icon name="comment-outline" size={23} color="#000" style={styles.icon} />
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity>
                        <Text style={{ color: "#7E7E7E" }}> 40 Comentarios</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingTop: 10,
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
    },

    icon: {

    },

    iconLiked: {
        backgroundColor: "red",
        borderRadius: 30,
    }

});