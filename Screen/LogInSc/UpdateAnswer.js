import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Image, ImageBackground, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import DismissKeyboard from '../../shared/DismissKeyboard';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { SEE_QUESTION_LIST } from './Question';
import {useFonts} from 'expo-font'
import { galaxy } from './Main';
import { ReactNativeFile } from 'apollo-upload-client';


const UPDATE_ANSWER = gql`
    mutation updateAnswer($payload:String,$file:Upload,$id:Int!){
        updateAnswer(payload:$payload, file:$file, id:$id){
            ok
            error
        }
    }
`


export default function UpdateAnswer({ route , navigation}) {
    const [loaded] = useFonts({
        font: require("../../assets/Noto_Serif_KR/NotoSerifKR-Light.otf")
    })
    
    
    const [uploadImage, setUploadImage] = useState("");
    const { width, height } = useWindowDimensions();
    const CARDWIDTH = width * 0.85;
    const CARDHEIGHT = height * 0.45;
    const PROFILEBOXHEIGHT = CARDHEIGHT * 0.15;
    const PROFILEHEIGHT = PROFILEBOXHEIGHT * 0.8;
    const IMAGEHEIGHT = CARDWIDTH * 0.85;
    
    
    
    
    
    const { register, setValue, watch, handleSubmit, getValues  } = useForm();
    useEffect(() => {
        register("answering")
    }, [register])
    
    useEffect(() => {
        
        
    }, [uploadImage])
    const z = () => {
        let file;
        console.log(uploadImage,"asd");
        if (uploadImage) {
            file = new ReactNativeFile({
                uri: uploadImage,
                name: "1.jpg",
                type: "image/jpeg",
            })
        }
        updateAnswerMutation({
            variables: {
                file,
                payload: getValues("answering"),
                id: route.params.answerId,
            }
        })
    }
    const [updateAnswerMutation, { data, loading }] = useMutation(UPDATE_ANSWER, {
        onCompleted: async ({ updateAnswer: { ok, error } }) => {
            if (ok) {
                navigation.navigate("가족 질문함");
            }
        },
        refetchQueries: [{ query: SEE_QUESTION_LIST }]
    })
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        /* console.log(result); */
        
        if (!result.cancelled) {
            setUploadImage(result.uri);
        }
    }
    /* const HeaderRigthBtn = () => {
        return (
            <TouchableOpacity
                onPress={z}
                style={{ width: 60, height: 30, backgroundColor: "skyblue", alignItems: "center", justifyContent: "center" }}>
                <Text style={{color: "white", fontFamily: galaxy ? null : "font"}}>
                    수정하기
                </Text>
            </TouchableOpacity>
        )

    } */
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => loading && <ActivityIndicator size={'small'} color="skyblue" />,
            
        })
    }, [loading])
    
    
    
    return <DismissKeyboard>
        <View style={{flex:1}}>
            {loaded &&
                <KeyboardAvoidingView /*키보드 떴을 때 가리는 걸 막기 위함임.*/
                    style={{
                        flex: 1,
                        backgroundColor: "white",
                        justifyContent: "center",
                        alignItems: "center"
                        /*박스 속성 땜시 안해주면 쭈그러듬*/
                    }}
                    behavior='padding'
                    keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0} /*기종이 먼지에 따라서도 코드 짜는 게 가능*/
                >
        
                    <View style={{ flex: 1, width, height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
                        <ImageBackground blurRadius={0.2} source={require("../../assets/배경.png")} resizeMode='cover' style={{ flex: 1, height, width, justifyContent: "center", alignItems: "center" }}>
                
                            <View testID='타이틀박스' style={{ marginVertical: 35, width: width * 0.9, backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ color: "darkgray", fontSize: 21, fontWeight: "400", fontFamily: galaxy ? null : "font" }}>우리의 {route.params.index + 1}번째 질문</Text>
                                <Text style={{ color: "gray", fontSize: 21, fontWeight: "600", fontFamily: galaxy ? null : "font" }}>
                                    {route.params.payload}
                                </Text>
                            </View>
                            <Text style={{ color: "gray", fontSize: 20, marginBottom: 20, fontWeight: "600", fontFamily: galaxy ? null : "font" }}>------------------</Text>
                            <View testID='답변박스' style={{ width: CARDWIDTH, height: CARDHEIGHT, backgroundColor: "white", marginBottom: 100 }}>
                                <View testID='프로필상단박스' style={{ backgroundColor: "skyblue", width: CARDWIDTH, height: PROFILEBOXHEIGHT, justifyContent: "space-around", alignItems: "center", flexDirection: "row" }}>
                                    <TouchableOpacity onPress={pickImage}><Ionicons name='image' size={24} color={"white"} /></TouchableOpacity>
                                    <Image source={{ uri: route.params.avatar }} style={{ height: PROFILEHEIGHT, width: PROFILEHEIGHT, borderRadius: PROFILEHEIGHT / 2 }} resizeMode='cover' />
                                    <TouchableOpacity onPress={z} style={{ width: 70, height: 30, justifyContent: "center", alignItems: "center",borderRadius:7, backgroundColor: "white" }}>
                                        {loading ? <ActivityIndicator size={"small"} color="skyblue"/> : <Text style={{ color: "skyblue", fontFamily: galaxy ? null : 'font' }}>수정하기</Text>}
                                    </TouchableOpacity>
                                </View>
                                {uploadImage ? <View testID='페이로드박스' style={{ backgroundColor: "white", width: CARDWIDTH, height: CARDHEIGHT * 0.85, paddingTop: 30, alignItems: "center" }}>
                                    <Image source={{ uri: uploadImage }} style={{ width: IMAGEHEIGHT * 0.8, height: IMAGEHEIGHT * 0.8 }} />
                                    <TextInput
                                        textAlignVertical='top'
                                        placeholder='답변을 해주세요.'
                                        onChangeText={(text) => setValue("answering", text)}
                                        selectionColor={"skyblue"} style={{ width: CARDWIDTH, height: CARDHEIGHT * 0.85, backgroundColor: "white", paddingHorizontal: 50, }} multiline={true} />
                                </View> : <TextInput
                                    textAlignVertical='top'
                                    placeholder='답변을 해주세요.'
                                    onChangeText={(text) => setValue("answering", text)}
                                    selectionColor={"skyblue"} style={{ width: CARDWIDTH, height: CARDHEIGHT * 0.85, backgroundColor: "white", paddingHorizontal: 50, paddingTop:30}} multiline={true} />}
                            </View>
                
                        </ImageBackground>
                    </View>
            
                </KeyboardAvoidingView>
        
            }
        </View>
    </DismissKeyboard>
}