import Post from "../1-inicio/top_navigator/Post";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { useRoute } from '@react-navigation/native';

export default function UserPost() {
    const route = useRoute();
    const { idStudent } = route.params;
    const { obtenerDatosUsuario } = useAuth();
    const [studentStorage, setStudentStorage] = useState(null);

    useEffect(() => {
        const cargarDatosUsuario = async () => {
            const datosUsuario = await obtenerDatosUsuario();
            setStudentStorage(datosUsuario);
        };
        cargarDatosUsuario();
    }, []);

    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if (hasMore) {
            getPosts();
        }
    }, [page]);

    const getPosts = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const response = await axios.get(`http://192.168.253.48:9000/api/posts/studentPageable/${idStudent}`, {
                params: { page, size: size }
            });
            if (response.data.content.length > 0) {
                const sortedPosts = response.data.content.sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished));
                setPosts(prevPosts => [...prevPosts, ...sortedPosts]);
                setHasMore(!response.data.last);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error al obtener las publicaciones:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMorePosts = () => {
        if (!loading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const EmptyListMessage = () => {
        return (
            <View style={styles.emptyListStyle}>
                <Text style={styles.emptyMessageStyle}>Este usuario aun no tiene publicaciones</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                renderItem={({ item, index }) => (
                    <Post
                        key={index}
                        idPost={item.idPost}
                        photo={item.photo}
                        message={item.message}
                        idStudent={item.idStudent}
                        likes={item.likes}
                        datePublished={item.datePublished}
                        type={item.tipo}
                        studentStorage={studentStorage}
                    />
                )}
                keyExtractor={item => item.idPost.toString()}
                onEndReached={loadMorePosts}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading ? <ActivityIndicator size="large" color={"white"} /> : null}
                ListEmptyComponent={EmptyListMessage}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#C9CFCE",
        paddingTop: 0,
    },

    containerTitle: {
        backgroundColor: "white",
        paddingLeft: 14,
        paddingTop: 10,
        paddingBottom: 10,
    },

    postsTitle: {
        fontSize: 17,
        fontWeight: "bold",
    },

    emptyListStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyMessageStyle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#000',
        padding: 10
    },
});