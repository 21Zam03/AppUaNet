import { View, Text, StyleSheet, ScrollView, FlatList, ActivityIndicator } from "react-native";
import UserMind from "./UserMind";
import Post from "./Post";
import axios from 'axios';
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../../AuthContext";
import BottomSheet from '@gorhom/bottom-sheet';
import BottomSheetComponent from "./BottomSheetComp";
import Comment from "./Comment";
import Like from "./Like";

export default function Home() {
    const { obtenerDatosUsuario } = useAuth();
    const [studentStorage, setStudentStorage] = useState(null);
    useEffect(() => {
        const cargarDatosUsuario = async () => {
            const datosUsuario = await obtenerDatosUsuario();
            setStudentStorage(datosUsuario);
        };
        cargarDatosUsuario();
    }, []);

    const [listPost, setListPost] = useState([]);
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
            const response = await axios.get(`http://192.168.1.35:9000/api/posts/allPageable?page=${page}&size=${size}`);
            if (response.data.content.length > 0) {
                setListPost(prevPosts => [...prevPosts, ...response.data.content]);
                setHasMore(!response.data.last);
                //setPage(prevPage => prevPage + 1);
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

    const bottomSheetRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [bottomSheetParams, setBottomSheetParams] = useState({ idStudent: null, studentStorage: null, idPost: null, listComments: null, type: null, likes: null });
    const [snapPoints, setSnapPoints] = useState([200, 300]);
    const [backgroundStyle, setBackgroundStyle] = useState(styles.bottomSheetBackground);
    const openBottomSheet = (idStudent, studentStorage, idPost, listComments, type, likes) => {
        setBottomSheetParams({ idStudent, studentStorage, idPost, listComments, type, likes });
        switch (type) {
            case 'options':
                setSnapPoints([200, 300]);
                setBackgroundStyle(styles.optionsBackground);
                break;
            case 'likes':
                setSnapPoints([250, '100%']);
                setBackgroundStyle(styles.likesBackground);
                break;
            case 'comments':
                setSnapPoints([250, '100%']);
                setBackgroundStyle(styles.commentsBackground);
                break;
            default:
                setSnapPoints([200, 300]);
                setBackgroundStyle(styles.bottomSheetBackground);
        }
        setIsVisible(true);
        bottomSheetRef.current?.expand();
    };
    const closeBottomSheet = () => {
        setIsVisible(false);
        bottomSheetRef.current?.close();
    };
    const handleOutsidePress = () => {
        if (isVisible) {
            closeBottomSheet();
        }
    };
    const renderBottomSheetContent = (handleOutsidePress) => {
        const { idStudent, studentStorage, idPost, listComments, type, likes } = bottomSheetParams;
        switch (type) {
            case 'options':
                return (
                    <View style={styles.sheetPadding}>
                        <BottomSheetComponent
                            idStudent={idStudent}
                            idStudentStorage={studentStorage.idStudent}
                            idPost={bottomSheetParams.idPost}
                            handleOutsidePress={handleOutsidePress}
                        />
                    </View>
                );
            case 'likes':
                return (
                    <View style={styles.sheetPaddingLikes}>
                        <Like likes={likes}/>
                    </View>
                );
            case 'comments':
                return (
                    <View style={styles.sheetPaddingComments}>
                        <Comment usuario={studentStorage} idPost={idPost} listComments={listComments} />
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.contenedorPadre}>
            <UserMind />
            <FlatList
                data={listPost}
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
                        save={item.saves}
                        openBottomSheet={openBottomSheet}
                    />
                )}
                keyExtractor={item => item.idPost.toString()}
                onEndReached={loadMorePosts}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading ? <ActivityIndicator size="large" color={"white"} /> : null}
            />
            {isVisible && (
                <BottomSheet
                    ref={bottomSheetRef}
                    index={1}
                    snapPoints={snapPoints}
                    onClose={() => setIsVisible(false)}
                    backgroundStyle={backgroundStyle}
                    handleIndicatorStyle={styles.handleIndicator}
                    enablePanDownToClose={true}
                >
                    {renderBottomSheetContent(handleOutsidePress)}
                </BottomSheet>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    contenedorPadre: {
        flex: 1,
        backgroundColor: "#C9CFCE",
        flexDirection: "column"
    },

    bottomSheetBackground: {
        backgroundColor: '#EFF1F0',
    },
    optionsBackground: {
        backgroundColor: '#f0f0f0',
    },
    likesBackground: {
        backgroundColor: 'white',
    },
    commentsBackground: {
        backgroundColor: 'white',
    },

    sheetPadding: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10
    },

    sheetPaddingComments: {
        flex: 1,
        backgroundColor: "white",
    },

    sheetPaddingLikes: {
        flex: 1,
        backgroundColor: "white",
    },

    handleIndicator: {
        backgroundColor: '#FF9F43', // O el color que prefieras
    },
});