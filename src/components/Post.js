import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Modal } from "react-native";
import PostUser from "./PostUser";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState, useRef } from "react";

export default function Post({ message, photo, idStudent }) {

    const [isCommentVisible, setCommentVisible] = useState(false);
    const openComment = () => setCommentVisible(true);
    const closeComment = () => setCommentVisible(false);

    const [liked, setLiked] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
        setLiked(!liked);
        // Iniciar la animación
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.5,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };
    return (
        <View style={styles.container}>
            <PostUser idStudent={idStudent} />
            <View style={styles.textContainer}>
                <Text>{message}</Text>
            </View>
            {photo === null ? (
                <></>
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
                    <TouchableOpacity onPress={handlePress}>
                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <Icon
                                name={liked ? "heart" : "heart-outline"}
                                size={25}
                                color={liked ? "red" : "black"}
                            />
                        </Animated.View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openComment}>
                        <Icon name="comment-outline" size={23} color="#000" style={styles.icon} />
                    </TouchableOpacity>
                    <Modal
                        transparent={true}
                        visible={isCommentVisible}
                        onRequestClose={closeComment}
                        animationType="slide"
                    >
                        <View style={styles.overlay}>
                            <View style={styles.menuContainer}>
                                <View style={styles.menuItem}>
                                    <Text>No hay comentarios</Text>
                                </View>
                            </View>
                        </View>
                    </Modal>
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
    },

    overlay: {
        //top: 45,
        padding: 20,
        backgroundColor: "white",
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        flex: 1,
    },

    menuContainer: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        gap: 10
    },

    menuItem: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center"
    },

});