import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Modal } from "react-native";
import IconIon from 'react-native-vector-icons/Ionicons';
import ModalLike from "./ModalLike";

export default function Like({ likes }) {
    return (
        <View style={styles.menuContainer}>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10, borderColor: "#DBDAD8", borderBottomWidth: 1, paddingBottom: 10 }}>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 5 }}>
                    <IconIon name="heart-outline" size={20} color="black" style={styles.icon} />
                    <Text>{likes.length} likes</Text>
                </View>
            </View>
            {likes.length <= 0 ? (
                <View>
                    <Text style={{ textAlign: "center" }}>No hay likes</Text>
                </View>
            ) : (
                <View>
                    {likes.map((like, index) => (
                        <ModalLike key={index} idStudent={like} />
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    menuContainer: {
        flex: 1,
        backgroundColor: "white",
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        gap: 10
    },

    menuItem: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center"
    },

    comentarioContainer: {
        flexDirection: "row",
        justifyContent: "start",
        alignItems: "start",
        gap: 10
    },

    comentarioContainerImagen: {
        flex: 0.1,
        //backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center"
    },

    comentarioImagen: {
        width: 45, // Ancho del contenedor
        height: 45, // Alto del contenedor
        borderRadius: 50,
    },

    heartContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -40,
        marginTop: -40,
    },
    heartShadowContainer: {
        padding: 0,
        borderRadius: 50,
    },

});