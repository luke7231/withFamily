import React, { useEffect, useState } from 'react';
import { Button, Image, ImageBackground, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import DismissKeyboard from '../../shared/DismissKeyboard';
import { Ionicons } from '@expo/vector-icons';
import {useFonts} from 'expo-font'
import { galaxy } from './Main';

export default function SeeAnswering({ route , navigation}) {
    const [loaded] = useFonts({
        font: require("../../assets/Noto_Serif_KR/NotoSerifKR-Light.otf")
    })
    const [image, setImage] = useState(null);
    const { width, height } = useWindowDimensions();
    const CARDWIDTH = width * 0.85;
    const CARDHEIGHT = height * 0.45;
    const PROFILEBOXHEIGHT = CARDHEIGHT * 0.15;
    const PROFILEHEIGHT = PROFILEBOXHEIGHT * 0.8;
    const IMAGEHEIGHT = CARDWIDTH * 0.85;
    
    
    return <DismissKeyboard>
        
            {loaded ? <View style={{ flex: 1, width, height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
                <ImageBackground blurRadius={0.2} source={require("../../assets/배경.png")} resizeMode='cover' style={{ flex: 1, height, width, justifyContent: "center", alignItems: "center" }}>
                
                    <View testID='타이틀박스' style={{ marginVertical: 35, width: width * 0.9, backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: "darkgray", fontSize: 21, fontWeight: "400", fontFamily: galaxy ? null : 'font' }}>우리의 {route.params.index + 1}번째 질문</Text>
                        <Text style={{ color: "gray", fontSize: 21, fontWeight: "600",fontFamily: galaxy ? null : 'font' }}>
                            {route.params.payload}
                        </Text>
                    </View>
                    <Text style={{ color: "gray", fontSize: 20, marginBottom: 20, fontWeight: "600", fontFamily: galaxy ? null : 'font' }}>------------------</Text>
            
                    
                    <View testID='답변박스' style={{ width: CARDWIDTH, height: CARDHEIGHT, backgroundColor: "white", marginBottom: 100 }}>
                
                        <View testID='프로필상단박스' style={{ backgroundColor: "skyblue", width: CARDWIDTH, height: PROFILEBOXHEIGHT, justifyContent: "space-around", alignItems: "center", flexDirection: "row" }}>
                            {route.params.avatar ?
                                <Image source={{ uri: route.params.avatar }} style={{ height: PROFILEHEIGHT, width: PROFILEHEIGHT, borderRadius: PROFILEHEIGHT / 2 }} resizeMode='cover' />
                                :
                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                    <Ionicons name='md-person-circle-outline' color={"white"} size={PROFILEHEIGHT * 0.8} style={{ marginHorizontal: 7 }} />
                                    <Text style={{ color: "white", fontFamily: galaxy ? null : 'font' }}>{route.params.username}</Text>
                                </View>
                            }
                
                        </View>
                
                        <View testID='페이로드박스' style={{ backgroundColor: "white", width: CARDWIDTH, height: CARDHEIGHT * 0.85, paddingTop: 30, alignItems: "center" }}>
                        
                            {route.params.file ? <Image source={{ uri: route.params.file }} style={{ width: IMAGEHEIGHT * 0.7, height: IMAGEHEIGHT * 0.7, marginBottom: 20 }} /> : null}
                            <Text style={{ color: "gray", fontFamily: galaxy ? null : 'font' }}>{route.params.answerPayload}</Text>
                        </View>
                    </View>
                
                </ImageBackground>
            </View>: <View></View>}
        

    </DismissKeyboard>
}