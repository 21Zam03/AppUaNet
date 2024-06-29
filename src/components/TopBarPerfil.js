import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconIon from 'react-native-vector-icons/Ionicons';
import IconFont from 'react-native-vector-icons/FontAwesome';
import Post from './Post';
import { useAuth } from "./AuthContext";
import React, { useEffect, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

// Screens for the user's profile tabs
function UserInfo({ student }) {
    return (
        <View style={{ backgroundColor: "white", paddingTop: 15, flex: 1 }}>
            <View style={styles.contenedorInfo}>
                <View>
                    <Text style={{ fontSize: 21, fontWeight: "bold" }}>Información</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ width: "10%", justifyContent: "center", alignItems: "center" }}>
                        <IconFont name="user" size={22} color="#4E5050" />
                    </View>
                    <View>
                        <Text style={{ fontSize: 15 }}>{student ? student.fullname : 'Cargando...'}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ width: "10%", justifyContent: "center", alignItems: "center" }}>
                        <IconFont name="graduation-cap" size={22} color="#4E5050" />
                    </View>
                    <View>
                        <Text style={{ fontSize: 15 }}>{student ? student.carreraProfesional : 'Cargando...'}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ width: "10%", justifyContent: "center", alignItems: "center" }}>
                        <IconFont name="map-marker" size={22} color="#4E5050" />
                    </View>
                    <View>
                        <Text style={{ fontSize: 15 }}>{student ? student.distrito : 'Cargando...'}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ width: "10%", justifyContent: "center", alignItems: "center" }}>
                        <IconFont name="birthday-cake" size={22} color="#4E5050" />
                    </View>
                    <View>
                        <Text style={{ fontSize: 15 }}>{student ? new Date(student.fecha_nacimiento).toLocaleDateString() : 'Cargando...'}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ width: "10%", justifyContent: "center", alignItems: "center" }}>
                        <IconFont name="mars" size={22} color="#4E5050" />
                    </View>
                    <View>
                        <Text>{student ? student.genre : 'Cargando...'}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ width: "10%", justifyContent: "center", alignItems: "center" }}>
                        <IconFont name="envelope" size={22} color="#4E5050" />
                    </View>
                    <View>
                        <Text>{student ? student.userDto.email : 'Cargando...'}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.contenedorInfo}>
                <View>
                    <Text style={{ fontSize: 21, fontWeight: "bold" }}>Intereses Académicos</Text>
                </View>
                <View style={{ flexDirection: "row", flexWrap: 'wrap', justifyContent: 'flex-start', gap: 10 }}>
                    {
                        student ? (
                            student.intereses.map((interest, index) => (
                                <View style={{ flexDirection: "row", backgroundColor: "#E9F0E5", padding: 10, borderRadius: 10, gap: 5 }} key={index}>
                                    <View>
                                        <Text style={{ fontSize: 15 }}>{interest}</Text>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <></>
                        )
                    }
                </View>
            </View>
            <View style={styles.contenedorInfo}>
                <View>
                    <Text style={{ fontSize: 21, fontWeight: "bold" }}>Hobbies</Text>
                </View>
                <View style={{ flexDirection: "row", flexWrap: 'wrap', justifyContent: 'flex-start', gap: 10 }}>
                    {
                        student ? (
                            student.hobbies != null ? (
                                student.hobbies.map((hobbie, index) => (
                                    <View style={{ flexDirection: "row", backgroundColor: "#E9F0E5", padding: 10, borderRadius: 10, gap: 5 }} key={index}>
                                        <View>
                                            <Text style={{ fontSize: 15 }}>{hobbie}</Text>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <Text>No hay hobbies</Text>
                            )
                        ) : (
                            <></>
                        )
                    }
                </View>
            </View>
        </View>
    );
}

function UserPosts({ listPost }) {
    const { obtenerDatosUsuario } = useAuth();
    const [studentStorage, setStudentStorage] = useState(null);
    useEffect(() => {
        const cargarDatosUsuario = async () => {
            const datosUsuario = await obtenerDatosUsuario();
            setStudentStorage(datosUsuario);
        };
        cargarDatosUsuario();
    }, []);

    return (

        <View style={{ backgroundColor: "white", paddingTop: 15, flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Publicaciones</Text>
            <View>
                {listPost.map((post, index) => (
                    <Post key={index} idPost={post.idPost} photo={post.photo} message={post.message} idStudent={post.idStudent} likes={post.likes} datePublished={post.datePublished} type={post.tipo} studentStorage={studentStorage} />
                ))}
            </View>
        </View>

    );
}

function UserImages() {
    return (
        <View style={styles.container}>
            <Text>Images</Text>
        </View>
    );
}

function UserVideos() {
    return (
        <View style={styles.container}>
            <Text>Videos</Text>
        </View>
    );
}


// Create a top tab navigator for the profile sections
const ProfileTab = createMaterialTopTabNavigator();

export default function TopBarPerfil({ student, listPost }) {
    return (
        <ProfileTab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                tabBarLabelStyle: { fontSize: 12 },
                tabBarItemStyle: { width: 100, padding: 14 },
                tabBarStyle: { backgroundColor: 'white' },
                tabBarIndicatorStyle: { backgroundColor: 'black' },
            }}
        >
            <ProfileTab.Screen
                name="Info"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <IconIon name="person-outline" color={"gray"} size={28} />
                    ),
                }}
            >
                {() => <UserInfo student={student} />}
            </ProfileTab.Screen>
            <ProfileTab.Screen
                name="Posts"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <IconIon name="grid" color={"gray"} size={28} />
                    ),
                }}
            >
                {() => <UserPosts listPost={listPost} />}
            </ProfileTab.Screen>
            <ProfileTab.Screen
                name="Images"
                component={UserImages}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <IconIon name="images-outline" color={"gray"} size={24} />
                    ),
                }}
            />
            <ProfileTab.Screen
                name="videos"
                component={UserVideos}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <IconIon name="film-outline" color={"gray"} size={26} />
                    ),
                }}
            />
        </ProfileTab.Navigator>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: "white",
    },

    contenedorFotos: {
        justifyContent: "center",
        alignItems: "center",
        gap: 10
    },

    contenedorInfo: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 20,
        gap: 10
    },

    contenedorImagen: {
        overflow: "hidden",
    },

    contenedorEdicion: {
        backgroundColor: "#F5FAF8",
        flex: 1,
        position: "absolute",
        borderRadius: 80,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: 'center',
        borderColor: "black",
        borderWidth: 1
    },

    imagen: {
        width: 120, // Ancho del contenedor
        height: 120, // Alto del contenedor
        borderRadius: 80
    },

    boton2: {
        backgroundColor: "#FF9F43",
        padding: 8,
        borderRadius: 15,
    },

    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },

    menuContainer: {
        width: "100%",
        gap: 10
    },

    menuItem: {
        backgroundColor: "white",
        borderRadius: 10,
    },

    imagen2: {
        width: "100%", // Ancho del contenedor
        height: 400, // Alto del contenedor
    },

    botonSolicitudNo: {
        backgroundColor: "#FF9F43",
        paddingTop: 12,
        paddingBottom: 12,
        paddingRight: 20,
        paddingLeft: 20,
        borderRadius: 6,
        width: "100%"
    },

    botonSolicitudSi: {
        backgroundColor: "#E7F0EE",
        paddingTop: 12,
        paddingBottom: 12,
        paddingRight: 20,
        paddingLeft: 20,
        borderRadius: 6,
        width: "100%"
    },

    textSolicitudNo: {
        color: "white", textAlign: "center"
    },

    textSolicitudSi: {
        color: "black", textAlign: "center"
    }
});