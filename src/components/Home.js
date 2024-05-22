import { View, Text, StyleSheet, ScrollView } from "react-native";
import UserMind from "./UserMind";
import Post from "./Post";
import axios from 'axios';
import { useEffect, useState } from "react";

export default function Home() {

    const [listPost, setListPost] = useState([]);

    useEffect(() => {
        // Realizar la petición Axios para obtener la lista de publicaciones
        axios.get('http://192.168.1.39:9000/api/posts')
            .then(response => {
                // Actualizar el estado con la lista de publicaciones recibidas
                console.log("Se obtuvo la lista de posts")
                setListPost(response.data);
            })
            .catch(error => {
                console.error('Error al obtener la lista de publicaciones:', error);
            });
    }, []);

    return (
        <View style={home_styles.contenedorPadre}>
            <ScrollView>
                <UserMind />
                {listPost.map(post => (
                    <Post key={post.idPost} photo={post.photo} message={post.message} idStudent={post.idStudent}/>
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