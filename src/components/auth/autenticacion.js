import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';

export default function Autenticacion() {
    const navigation = useNavigation();

    const handleLoginPress = () => {
        navigation.navigate('Login')
    }

    const handleSignUpPress = () => {
        navigation.navigate('SignUpIntro')
    }

    return (
        <View style={styles.contenedor}>
            <View style={styles.subContenedor1}>
                <View style={styles.contenedorImages}>
                    <Image
                        source={require('../../../assets/logo-autonoma.png')}
                        style={{ width: 80, height: 40 }}
                    />
                    <Image
                        source={require('../../../assets/logo.png')}
                        style={styles.logo}
                    />
                </View>
                <View style={styles.curve} />
                <Text style={styles.tituloUniversidad}>Universidad Autónoma del Perú</Text>
            </View>
            <View style={styles.subContenedor2}>
                <View>
                    <TouchableOpacity style={styles.botonRegistrate} onPress={handleSignUpPress}>
                        <Text style={styles.textUnete}>UNETE</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.iniciarSesion}>
                    <Text style={styles.textYaEresUsuario}>¿Ya eres usuario?</Text>
                    <TouchableOpacity style={styles.botonIniciarSesion} onPress={handleLoginPress}>
                        <Text style={styles.textIniciarSesion}>INICIAR SESIÓN</Text>
                    </TouchableOpacity>
                    <Text style={styles.textDedicacion}>Aplicacion dedicada para los estudiantes de la Universidad Autónoma del Perú</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: "#FF9F43",
    },

    subContenedor1: {
        flex: 0.7,
        alignItems: 'center',
        justifyContent: "center",
        marginTop: 70,
        gap: 15,
        overflow: 'hidden', // Oculta el contenido que se desborda del contenedor
    },

    contenedorImages: {
        flexDirection: "row", justifyContent:"center", alignItems:"center"
    },

    tituloUniversidad: {
        color: "white", fontStyle: "italic"
    },

    textUnete: {
        color: '#000000', textAlign: 'center'
    },

    textYaEresUsuario: {
        textAlign: 'center'
    },

    textIniciarSesion: {
        color: '#ffffff', textAlign: 'center'
    },

    textDedicacion: {
        textAlign: "center"
    },

    curve: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 40, // Altura de la curva
        backgroundColor: '#ffffff', // Color de fondo de la curva (coincide con el color de fondo del contenedor)
        borderTopLeftRadius: 40, // Radio de curvatura de la esquina superior izquierda
        borderTopRightRadius: 40, // Radio de curvatura de la esquina superior derecha
    },

    logo: {
        width: 200,
        height: 60,
        marginBottom: 0,
    },

    subContenedor2: {
        flex: 0.35  ,
        gap: 30,
        paddingRight: 20,
        paddingLeft: 20,
        backgroundColor: '#ffffff',
    },

    botonRegistrate: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        paddingTop: 20,
        paddingBottom: 20,
        paddingRight: 20,
        paddingLeft: 20,
        borderWidth: 1
    },

    botonIniciarSesion: {
        backgroundColor: "#FF8F1C",
        borderRadius: 20,
        paddingTop: 20,
        paddingBottom: 20,
        paddingRight: 20,
        paddingLeft: 20,
    },

    iniciarSesion: {
        gap: 10
    }

});