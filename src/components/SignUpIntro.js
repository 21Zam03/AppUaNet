import { View, Text, TouchableOpacity, StyleSheet, Image} from "react-native";
import { useNavigation } from '@react-navigation/native';

export default function SignUpIntro () {
    const navigation = useNavigation();

    const redirectToLogin = () => {
        navigation.navigate('Login')
    }

    const redirectToSignUpName = () => {
        navigation.navigate('SignUpName')
    }

    return (
        <View style={styles.contenedor}>
            <View>
                <Text style={styles.textInicio}>Únete a Ua Net</Text>
            </View>
            <View>
                <Image
                    source={require('../../assets/image-intro-signUp.jpg')}
                    style={styles.imagen}
                />
            </View>
            <View>
                <Text style={{fontSize: 15}}>
                    Create una cuenta y conectate con tus amigos, compañeros y comunidades de estudiantes que compartan los mismo intereses profesionales
                </Text>
            </View>
            <View style={styles.contenedorBotones}>
                <TouchableOpacity style={styles.boton} onPress={redirectToSignUpName}><Text style={styles.textBoton}>Comenzar</Text></TouchableOpacity>
                <TouchableOpacity style={styles.boton2} onPress={redirectToLogin}><Text style={styles.textBoton2}>Ya tengo una cuenta</Text></TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: "white",
        paddingRight: 14,
        paddingLeft: 14,
        gap: 20,
    },

    textInicio: {
        fontSize: 25,
        fontWeight: "bold"
    },  

    imagen: {
        width: "100%",
        height: 200,
        borderRadius: 10
    },

    boton: {
        backgroundColor: "#FF9F43",
        borderRadius: 25,
        padding: 15
    },

    textBoton: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16
    },

    textBoton2: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16
    },

    boton2: {
        borderRadius: 25,
        padding: 15,
        borderColor: "black",
        borderWidth: 1
    },

    contenedorBotones: {
        gap: 14
    }
});