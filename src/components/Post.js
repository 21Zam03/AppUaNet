import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import PostUser from "./PostUser";
import Icon from 'react-native-vector-icons/FontAwesome';
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
            <View style={{ width: "100%" }}>
                <Image
                    source={{ uri: `data:image/png;base64,${photo}` }}
                    style={styles.imagen}
                />
            </View>
            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10}}>
                <View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
                    <TouchableOpacity onPress={handlePress} style={{ width: 30 }}>
                        <Icon
                            name="heart"
                            size={30}
                            color={liked ? '#FF9F43' : 'gray'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: 30 }}>
                        <Icon
                            name="comment"
                            size={30}
                            color={'gray'}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity>
                        <Text style={{color: "#7E7E7E"}}> 40 Comentarios</Text>
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
});