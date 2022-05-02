import React, { useEffect, useState } from 'react';
import { Button, FlatList, Image, ImageBackground, Platform, Text, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useMe from '../../hooks/useMe';
import { useFonts } from 'expo-font'
import { galaxy } from './Main';

export default function QnA({ route, navigation }) {
    

    const [loaded] = useFonts({
        font: require("../../assets/Noto_Serif_KR/NotoSerifKR-Light.otf")
    })

    const [family, setFamily] = useState([]);
    useEffect(() => {
        setFamily(route.params.family)
    },[])
    const { height, width } = useWindowDimensions();
    const BOXWIDHT = width * 0.45;
    const BOXHEIGTH = BOXWIDHT * 1.2;
    
    const newArray = family.map((user) => {
        return {
            ...user,
            has: false,
            payload: "",
            file: "",
        }
    })
    return (
        <View style={{ flex: 1, width, height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
            {loaded && <View>
                <ImageBackground blurRadius={0.2} source={require("../../assets/배경.png")} resizeMode='cover' style={{ flex: 1, height, width, justifyContent: "center", alignItems: "center" }}>
                
                <View></View>
                <View style={{ marginVertical: 35, width: width * 0.9, backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: "darkgray", fontSize: 21, fontWeight: "400", fontFamily: galaxy ? null : 'font' }}>우리의 {route.params.index + 1}번째 질문</Text>
                    <Text style={{ color: "gray", fontSize: 21, fontWeight: "600", fontFamily: galaxy ? null : 'font' }}>
                        {route.params.payload}
                    </Text>
                </View>
                <Text style={{ color: "gray", fontSize: 20, marginBottom: 20, fontWeight: "600", fontFamily: galaxy ? null : 'font' }}>------------------</Text>
                
                <FlatList
                    style={{
                        zIndex: 1,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 0.3,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                    }}
                    numColumns={2}
                    data={newArray}
                    keyExtractor={(user) => user.id}
                    renderItem={({ item }) => {
                        route.params.answers.map((ans) => {
                            if (ans.user.id == item.id) {
                                item.has = true;
                                item.answerId = ans.id;
                                item.payload = ans.payload;
                                item.file = ans.file;
                            }
                        })
                            
                        return (
                            <View style={{ width: BOXWIDHT, height: BOXHEIGTH, backgroundColor: "skyblue", borderRadius: 10, justifyContent: "center", alignItems: "center", margin: 10, overflow: "hidden" }}>
                                <View testID='프로필박스' style={{ width: BOXWIDHT, height: BOXHEIGTH * 0.2, backgroundColor: "skyblue", justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>
                                    <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                                        {item.avatar ?
                                            <Image resizeMode='cover' source={{ uri: item.avatar }} style={{ height: BOXWIDHT * 0.25 * 0.8, width: BOXWIDHT * 0.25 * 0.8, borderRadius: (BOXWIDHT * 0.25 * 0.8) / 2, marginHorizontal: 7 }} />
                                            :
                                            <Ionicons name='md-person-circle-outline' color={"white"} size={BOXWIDHT * 0.25 * 0.8} style={{ marginHorizontal: 7 }} />
                                        }
                                        <Text style={{ color: "white", fontWeight: "300", fontFamily: galaxy ? null : 'font' }}>{item.username}</Text>
                                    </View>
                                    {item?.id == route.params.me.Me.id ?
                                        
                                        <TouchableOpacity onPress={() => navigation.navigate(item.has ? "질문변경" : "질문달기", {
                                            id: route.params.id,
                                            payload: route.params.payload,
                                            index: route.params.index,
                                            username: item.username,
                                            avatar: item.avatar,
                                            answerId: item.answerId ? item.answerId : null,
                                            answerPayload: item.payload ? item.payload : null,
                                        })} style={{ marginRight: 7 }}><Ionicons name='pencil' color={"gray"} size={BOXWIDHT * 0.25 * 0.45} /></TouchableOpacity> : <View></View>}
                                </View>
                                {/* 답변박스 */}
                                    
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("질문보기", {
                                        username: item.username,
                                        payload: route.params.payload,
                                        index: route.params.index,
                                        avatar: item.avatar,
                                        file: item.file,
                                        answerPayload: item.payload
                                    })}
                                    disabled={!item.has}
                                    testID='답변내용박스'
                                    style={{ width: BOXWIDHT, height: BOXHEIGTH * 0.8, backgroundColor: "white", padding: 20, alignItems: "center" }}
                                >
                                    
                                        
                                    {item.has ?
                                        item.file ?
                                            <View>
                                                <Image source={{ uri: item.file }} style={{ width: BOXWIDHT * 0.65, height: BOXWIDHT * 0.65, }} resizeMode='cover' />
                                                <Text style={{ color: "gray", fontWeight: "600", fontFamily: galaxy ? null : 'font' }}>...</Text>
                                            </View>
                                            :
                                            <Text style={{ color: "gray", fontWeight: "600", fontFamily: galaxy ? null : 'font' }}>{item.payload}</Text>
                                        :
                                        <Text style={{ color: "gray", fontWeight: "400", fontFamily: galaxy ? null : 'font' }}>아직 답변을 달지 않았습니다!</Text>
                                    }

                                    {!item.has && item?.id == route.params.me.Me.id &&
                                        <TouchableOpacity
                                            style={{ backgroundColor: "#F5F5DC", width: BOXWIDHT * 0.5, height: 20, alignItems: "center", justifyContent: "center", marginTop: 20 }}
                                            onPress={() => navigation.navigate("질문달기", {
                                                id: route.params.id,
                                                payload: route.params.payload,
                                                index: route.params.index,
                                                username: item.username,
                                                avatar: item.avatar,
                                            }
                                            )}
                                        >
                                            <Text style={{ fontWeight: "700", fontFamily: galaxy ? null : 'font' }}>답변달기</Text>
                                        </TouchableOpacity>
                                    }
                                        
                                </TouchableOpacity>
                                {/* <Text style={{color: "white"}}>{item?.payload}</Text> */}
                            </View>
                            
                        )
                    }}
                />
                    
                
                
                </ImageBackground>
            </View>}
        </View>

    )
            }