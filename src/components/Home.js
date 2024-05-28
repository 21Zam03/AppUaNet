import { View, Text, StyleSheet, ScrollView } from "react-native";
import UserMind from "./UserMind";
import Post from "./Post";
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';

export default function Home() {

    const [listPost, setListPost] = useState([]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://192.168.1.39:9000/api/posts');
            console.log("Se obtuvo la lista de posts");
            setListPost(response.data);
        } catch (error) {
            console.error('Error al obtener la lista de publicaciones:', error);
        }
    };

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
                    <Post key={post.idPost} photo={post.photo} message={post.message} idStudent={post.idStudent} />
                ))}
            </ScrollView>
        </View>
    );
}

const home_styles = StyleSheet.create({
    contenedorPadre: {
        flex: 1,
        backgroundColor: "white",
        flexDirection: "column"
    }
});