import { View, Text, StyleSheet, ScrollView } from "react-native";
import UserMind from "./UserMind";
import Post from "./Post";
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from "./AuthContext";

export default function Home() {

    const [listPost, setListPost] = useState([]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://192.168.1.39:9000/api/posts');
            const sortedPosts = response.data.sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished));

            // const postsDiversion = sortedPosts.filter(post => post.tipo === "Diversion");
            setListPost(sortedPosts);
        } catch (error) {
            console.error('Error al obtener la lista de publicaciones:', error);
        }
    };

    const { obtenerDatosUsuario } = useAuth();
    const [studentStorage, setStudentStorage] = useState(null);
    useEffect(() => {
        const cargarDatosUsuario = async () => {
            const datosUsuario = await obtenerDatosUsuario();
            setStudentStorage(datosUsuario);
        };
        cargarDatosUsuario();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchPosts();
        }, [])
    );

    return (
        <View style={home_styles.contenedorPadre}>
            <ScrollView>
                <UserMind />
                {listPost.map(post => (
                    <Post key={post.idPost} idPost={post.idPost} photo={post.photo} message={post.message} idStudent={post.idStudent} likes={post.likes} datePublished={post.datePublished} type={post.tipo} studentStorage={studentStorage}/>
                ))}
            </ScrollView>
        </View>
    );
}

const home_styles = StyleSheet.create({
    contenedorPadre: {
        flex: 1,
        backgroundColor: "#C9CFCE",
        flexDirection: "column"
    }
});