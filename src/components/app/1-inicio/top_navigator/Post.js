import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Modal } from "react-native";
import PostUser from "./PostUser";
import IconIon from 'react-native-vector-icons/Ionicons';
import { useState, useRef, useEffect } from "react";
import axios from 'axios';
import { Image as ImageFast } from "expo-image";
import * as FileSystem from 'expo-file-system';
import { Video } from "expo-av";

export default function Post({ idPost, message, photo, datePublished, idStudent, likes, type, studentStorage, saves, openBottomSheet }) {

    //Logica para la animacion del like y manejo del estado liked
    const userHasLiked = (idStudent, likes) => {
        return likes.includes(idStudent);
    };
    const [liked, setLiked] = useState(userHasLiked(studentStorage.idStudent, likes));

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const [likeCount, setLikeCount] = useState(likes.length);
    const [listLikes, setListLikes] = useState(likes);
    const handlePress = (idStudent) => {
        if (liked) {
            setLikeCount(likeCount => likeCount - 1);
            setListLikes(listLikes.filter(l => l !== idStudent));
        } else {
            setListLikes([...listLikes, idStudent]);
            setLikeCount(likeCount => likeCount + 1);
        }
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

    // const userHasSaved = (idStudent, saves) => {
    //     return saves.includes(idStudent);
    // };
    const [saved, setSaved] = useState(false);
    const scaleAnim2 = useRef(new Animated.Value(1)).current;
    const [saveCount, setSaveCount] = useState(0);
    //const [listSaves, setListSaves] = useState(saves);
    const handlePress2 = () => {
        if (saved) {
            setSaveCount(saveCount => saveCount - 1);
            //setListSaves(listSaves.filter(l => l !== idStudent));
        } else {
            //setListSaves([...listLikes, idStudent]);
            setSaveCount(saveCount => saveCount + 1);
        }
        setSaved(!saved);
        // Iniciar la animación
        Animated.sequence([
            Animated.timing(scaleAnim2, {
                toValue: 1.5,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim2, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const [isCommentVisible, setCommentVisible] = useState(false);
    const openComment = async () => {
        setCommentVisible(true);
    }
    const closeComment = () => {
        setCommentVisible(false);
    }

    const [isInitialized, setIsInitialized] = useState(false);
    const updatePost = async () => {
        const likesDto = {
            idPost: idPost,
            likes: listLikes
        }
        try {
            const response = await axios.put("http://192.168.253.48:9000/api/posts/likes", likesDto);
            if (response.data.status === 200) {
                console.log("se dio like");
            }
        } catch (error) {
            console.error('Error al tratar de actualizar la publicacion:', error);
        }
    };

    useEffect(() => {
        // Ejecutar updatePost solo cuando likeCount y liked hayan sido actualizados
        if (isInitialized) {
            updatePost();
        } else {
            setIsInitialized(true);
        }
    }, [likeCount]);

    const [student, setStudent] = useState();
    useEffect(() => {
        axios.get(`http://192.168.253.48:9000/api/students/${idStudent}`)
            .then(response => {
                setStudent(response.data)
            })
            .catch(error => {
                console.error('Error al obtener al estudiante:', error);
            });
    }, []);

    const [showHeart, setShowHeart] = useState(false);
    const [heartScale, setHeartScale] = useState(new Animated.Value(0));
    const [lastTap, setLastTap] = useState(null);

    const handleDoubleTap = (idStudent) => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;
        const VISIBILITY_DURATION = 100;

        if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
            handlePress(idStudent);
            setShowHeart(true);
            Animated.spring(heartScale, {
                toValue: 1,
                friction: 4,
                tension: 60,
                useNativeDriver: true,
            }).start(() => {
                setTimeout(() => {
                    Animated.spring(heartScale, {
                        toValue: 0,
                        friction: 9,
                        useNativeDriver: true,
                    }).start(() => setShowHeart(false));
                }, VISIBILITY_DURATION);
            });
        } else {
            setLastTap(now);
        }
    };

    const [listComments, setListComments] = useState([]);
    useEffect(() => {
        const cargarListaComentarios = async () => {
            try {
                const response = await axios.get(`http://192.168.253.48:9000/api/comments/post/${idPost}`);
                if (response.data) {
                    setListComments(response.data);
                }
            } catch (error) {
                console.error('Error al obtener los comentarios:', error);
            }
        };
        cargarListaComentarios();
    }, []);

    const getMediaType = (base64) => {
        if (base64.startsWith('iVBORw0KGgo')) {
            return 'image/png';
        }
        if (base64.startsWith('/9j/')) {
            return 'image/jpeg';
        }
        if (base64.startsWith('AAAA')) {
            return 'video/mp4';
        }
        return 'unknown';
    };

    const mediaType = photo ? getMediaType(photo) : 'unknown';
    const mediaUri = `data:${mediaType};base64,${photo}`;
    return (
        <View style={styles.container}>
            <PostUser student={student} idPost={idPost} datePublished={datePublished} studentStorage={studentStorage} openBottomSheet={openBottomSheet} />
            <View style={styles.textContainer}>
                <Text>{message}</Text>
            </View>
            {photo === null ? (
                <></>
            ) : (
                mediaType.startsWith('image') ? (
                    <TouchableOpacity activeOpacity={1} onPress={() => handleDoubleTap(idStudent)} style={{ width: "100%" }}>
                        <ImageFast
                            source={{ uri: mediaUri }}
                            style={styles.imagen}
                            transition={100}
                        />
                        {showHeart && (
                            <Animated.View style={[styles.heartContainer, { transform: [{ scale: heartScale }] }]}>
                                <View style={styles.heartShadowContainer}>
                                    <IconIon name="heart" size={80} color="white" />
                                </View>
                            </Animated.View>
                        )}
                    </TouchableOpacity>
                ) : (
                    <View>
                        <Video
                            source={{ uri: mediaUri }}
                            style={styles.video}
                            useNativeControls
                            resizeMode="cover"
                        />
                    </View>
                )
            )}
            <View style={{ padding: 10, gap: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "start", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", gap: 20, alignItems: "start", justifyContent: "center", paddingTop: 5, paddingBottom: 5 }}>
                        <View style={{ justifyContent: "start", alignItems: "center", flexDirection: "row", gap: 5 }}>
                            <TouchableOpacity onPress={() => handlePress(studentStorage.idStudent)}>
                                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                                    <IconIon
                                        name={liked ? "heart" : "heart-outline"}
                                        size={25}
                                        color={liked ? "red" : "black"}
                                    />
                                </Animated.View>
                            </TouchableOpacity>
                            <TouchableOpacity><Text style={{ fontSize: 13, color: "gray" }} onPress={() => openBottomSheet(idStudent, studentStorage.idStudent, idPost, "", "likes", likes)}>{likeCount} likes</Text></TouchableOpacity>
                        </View>
                        <View style={{ justifyContent: "start", alignItems: "center", flexDirection: "row", gap: 5 }}>
                            <TouchableOpacity onPress={() => openBottomSheet(idStudent, studentStorage, idPost, listComments, "comments")}>
                                <IconIon name="chatbubble-outline" size={22} color="#000" style={styles.icon} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => openBottomSheet(idStudent, studentStorage, idPost, listComments, "comments")}><Text style={{ fontSize: 13, color: "gray" }}>{listComments.length} comentarios</Text></TouchableOpacity>
                        </View>
                        <View style={{ justifyContent: "start", alignItems: "center", flexDirection: "row", gap: 5 }}>
                            <TouchableOpacity onPress={handlePress2}>
                                <Animated.View style={{ transform: [{ scale: scaleAnim2 }] }}>
                                    <IconIon
                                        name={saved ? "bookmark" : "bookmark-outline"}
                                        size={22}
                                        color={saved ? "black" : "black"}
                                    />
                                </Animated.View>
                            </TouchableOpacity>
                            <TouchableOpacity><Text style={{ fontSize: 13, color: "gray" }}>{saveCount} guardados</Text></TouchableOpacity>
                        </View>
                    </View>
                </View >
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 4,
        paddingTop: 10,
        borderColor: "#E7E1E0",
        backgroundColor: "white"
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

    iconLiked: {
        backgroundColor: "red",
        borderRadius: 30,
    },

    overlay: {
        paddingTop: 20,
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        flex: 1,
    },

    menuContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: "white",
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingTop: 20,
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

    video: {
        width: '100%',
        height: 400,
        backgroundColor: "white",
    },

});