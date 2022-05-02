import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Image, ImageBackground, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useMutation, gql } from '@apollo/client';
import styled from 'styled-components/native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { ReactNativeFile } from "apollo-upload-client";
import { SEE_PROMISE_FEED } from './Schedule';
import {useFonts} from 'expo-font'
import { galaxy, SEE_FAMILY_CODE } from './Main';
const UPLOAD_FAMILY_PHOTO = gql`
    mutation uploadBackgroundImage($file:Upload!,$caption:String){
        uploadBackgroundImage(file:$file,caption:$caption){
            ok
            error
        }
    }
`
const UPDATE_USER_PHOTO = gql`
    mutation updateUser($avatar: Upload){
        updateUser(avatar:$avatar){
            id
            username
            avatar
        }
    }
`

const UPDATE_PROMISE_PHOTO = gql`
    mutation updatePromise($id:Int!,$file:Upload!){
        updatePromise(id:$id, file:$file){
            ok
            error
        }
    }
`

const Container = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    background-color: white;
`
const TextBox = styled.View`
`
const BtnBox = styled.View`
`
const SubmitButtonBox = styled.View`

`
const SomeText = styled.Text`

`
const PhotoContainer = styled.View`
    
`

const Btn = styled.TouchableOpacity`

`


export default function UploadScreen({ navigation,route }) {
    const [loaded] = useFonts({
        font: require("../../assets/Noto_Serif_KR/NotoSerifKR-Light.otf")
    })
    
    const { width, height } = useWindowDimensions();// 핸드폰 <넓이 , 높이>
     // 선택된 이미지 넣을 STATE
    const IMAGE_WIDHT = width * 0.55; // 프로필 이미지 사진 Width
    const CARDWIDTH = width * 0.86;
    const CARDHEIGHT = height * 0.2;

    const [fromWhere, setFromWhere] = useState('');
    useEffect(() => {
        setFromWhere(navigation.getState().routes[0].name)
    },)
    const [image, setImage] = useState("");
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: fromWhere == "Schedule" ? [4,3] : [1,1],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };
    
    const [uploadFamilyPhotoMutation, { loading: familyLoading }] = useMutation(UPLOAD_FAMILY_PHOTO,{
        onCompleted: ({uploadBackgroundImage}) => {
            if(uploadBackgroundImage.ok){
                navigation.goBack();
            } 
        },
        refetchQueries: [{ query: SEE_FAMILY_CODE }]
    });
    const onUpload1 = () => {
        const file = new ReactNativeFile({
            uri: image,
            name: "1.jpg",
            type: "image/jpeg"
        })
        uploadFamilyPhotoMutation({
            variables: {
                file,
                caption: "",
            }
        })
    
    }
    const [updateUserPhotoMutation, { loading: UserLoading }] = useMutation(UPDATE_USER_PHOTO,{
        onCompleted: ({updateUser}) => {
            if(updateUser.id){
                navigation.goBack();
            } 
        },
        refetchQueries: [{ query: SEE_PROMISE_FEED }]
    });
    const onUpload2 = () => {
        const file = new ReactNativeFile({
            uri: image,
            name: "1.jpg",
            type: "image/jpeg"
        })
        updateUserPhotoMutation({
            variables: {
                avatar: file,
            }
        })
    
    }
    const [updatePromisePhoto, { loading: PromiseLoading }] = useMutation(UPDATE_PROMISE_PHOTO,{
        onCompleted: ({updatePromise}) => {
            if(updatePromise.ok){
                navigation.goBack();
            } 
        },
        refetchQueries: [{ query: SEE_PROMISE_FEED }]
    });
    const onUpload3 = () => {
        const file = new ReactNativeFile({
            uri: image,
            name: "1.jpg",
            type: "image/jpeg"
        })
        updatePromisePhoto({
            variables: {
                id: route.params.id,
                file,
            }
        })
    
    }
    
    return (
        <Container>
            {loaded && <ImageBackground resizeMode='cover' source={require("../../assets/배경.png")} style={{ width, height, justifyContent: "center", alignItems: "center" }}>

                {fromWhere === "Main" && route.params.key == "가족사진"&&
                    <View style={{ alignItems: "center" }}>
                        <View style={{ justifyContent: "space-evenly", alignItems: "center", width: width * 0.85, height: height * 0.55, backgroundColor: "skyblue", borderRadius: 10, marginBottom: 50 }}>
                            <TextBox>
                                <Text style={{ fontWeight: "600", fontSize: 25, color: "white", fontFamily: galaxy ? null : "font" }}>사진을 선택해주세요.</Text>
                                <Text style={{ fontSize: 20, color: "gray", fontFamily: galaxy ? null : "font" }}>홈 화면에 전시됩니다.</Text>
                            </TextBox>

                            <PhotoContainer>
                                {image ? <Image source={{ uri: image }} resizeMode='cover' style={{ width: height * 0.25, height: height * 0.25 }} /> : <View style={{ width: height * 0.25, height: height * 0.25, backgroundColor: "white", borderWidth: 2, borderColor: "gray", borderStyle: "dotted" }}></View>}

                            </PhotoContainer>

                            <BtnBox>
                                <TouchableOpacity style={{ borderWidth: 1, borderColor: "skyblue", borderRadius: 7, backgroundColor: "white", width: width * 0.5, height: 40, alignItems: "center", justifyContent: "center", flexDirection: "row" }} onPress={pickImage}>
                                    <Ionicons name='image' size={28} color={"skyblue"} />
                                    <Text style={{ color: "skyblue", marginLeft: 7, fontFamily: galaxy ? null : "font" }}>사진 선택하기</Text>

                                </TouchableOpacity>
                            </BtnBox>
                        
                        </View>
                        <SubmitButtonBox>
                            <TouchableOpacity
                                onPress={onUpload1}
                                disabled={image ? false : true}
                                style={{ backgroundColor: !image ? "darkgray" : "skyblue", borderColor: !image ? "gray" : "white", borderWidth: 1, borderRadius: 7, width: width * 0.3, height: height * 0.05, justifyContent: "center", alignItems: "center" }}>
                                {familyLoading ? <ActivityIndicator size={"small"} color="white" /> : <Text style={{ color: "white", fontFamily: galaxy ? null : "font" }}>올리기</Text>}
                            </TouchableOpacity>
                            {familyLoading && <Text style={{marginTop:20}}>잠시만 기다려주세요.</Text>}
                        </SubmitButtonBox>
                    </View>
                }
                {route.params.key == "프로필" &&
                    <View style={{ alignItems: "center" }}>
                        <View style={{ justifyContent: "space-evenly", alignItems: "center", width: width * 0.85, height: height * 0.55, backgroundColor: "skyblue", borderRadius: 10, marginBottom: 50 }}>
                            <TextBox>
                                <Text style={{ fontWeight: "600", fontSize: 25, color: "white", fontFamily: galaxy ? null : "font" }}>사진을 선택해주세요.</Text>
                                <Text style={{ fontSize: 20, color: "gray",fontFamily: galaxy ? null : "font" }}>프로필 사진으로 설정됩니다.</Text>
                            </TextBox>

                            <PhotoContainer>
                                {image ? <Image source={{ uri: image }} resizeMode='cover' style={{ width: IMAGE_WIDHT, height: IMAGE_WIDHT, borderRadius: IMAGE_WIDHT / 2 }} /> : <View style={{ width: IMAGE_WIDHT, height: IMAGE_WIDHT, borderRadius: IMAGE_WIDHT / 2, borderWidth: 2, borderColor: "gray", borderStyle: "dotted", backgroundColor: "white" }}></View>}

                            </PhotoContainer>

                            <BtnBox>
                                <TouchableOpacity style={{ borderWidth: 1, borderColor: "skyblue", borderRadius: 7, backgroundColor: "white", width: width * 0.5, height: 40, alignItems: "center", justifyContent: "center", flexDirection: "row" }} onPress={pickImage}>
                                    <Ionicons name='image' size={28} color={"skyblue"} />
                                    <Text style={{ color: "skyblue", marginLeft: 7, fontFamily: galaxy ? null : "font" }}>사진 선택하기</Text>
                                </TouchableOpacity>
                            </BtnBox>
                        
                        </View>
                        <SubmitButtonBox>
                            <TouchableOpacity
                                onPress={onUpload2}
                                disabled={image ? false : true}
                                style={{ backgroundColor: !image ? "darkgray" : "skyblue", borderColor: !image ? "gray" : "white", borderWidth: 1, borderRadius: 7, width: width * 0.3, height: height * 0.05, justifyContent: "center", alignItems: "center" }}>
                                {UserLoading ? <ActivityIndicator size={"small"} color="white" /> : <Text style={{ color: "white", fontFamily: galaxy ? null : "font" }}>올리기</Text>}
                                
                            </TouchableOpacity>
                            {UserLoading && <Text style={{marginTop:20}}>잠시만 기다려주세요.</Text>}
                        </SubmitButtonBox>
                    </View>
                }
                {fromWhere === "Schedule" &&
                    <View style={{ alignItems: "center" }}>
                        <View style={{ justifyContent: "space-evenly", alignItems: "center", width: width * 0.85, height: height * 0.55, backgroundColor: "skyblue", borderRadius: 10, marginBottom: 50 }}>
                            <TextBox>
                                <Text style={{ fontWeight: "600", fontSize: 25, color: "white", fontFamily: galaxy ? null : "font" }}>사진을 선택해주세요.</Text>
                                <Text style={{ fontSize: 20, color: "gray", fontFamily: galaxy ? null : "font" }}>가족약속 화면에 전시됩니다.</Text>
                            </TextBox>

                            <PhotoContainer>
                                {image ? <Image source={{ uri: image }} resizeMode='cover' style={{ height: CARDHEIGHT, width: CARDWIDTH * 0.76 }} /> : <View style={{ height: CARDHEIGHT, width: CARDWIDTH * 0.76, backgroundColor: "white", borderWidth: 2, borderColor: "gray", borderStyle: "dotted" }}></View>}

                            </PhotoContainer>

                            <BtnBox>
                                <TouchableOpacity style={{ borderWidth: 1, borderColor: "skyblue", borderRadius: 7, backgroundColor: "white", width: width * 0.5, height: 40, alignItems: "center", justifyContent: "center", flexDirection: "row" }} onPress={pickImage}>
                                    <Ionicons name='image' size={28} color={"skyblue"} />
                                    <Text style={{ color: "skyblue", marginLeft: 7, fontFamily: galaxy ? null : "font" }}>사진 선택하기</Text>

                                </TouchableOpacity>
                            </BtnBox>
                        
                        </View>
                        <SubmitButtonBox>
                            <TouchableOpacity
                                onPress={onUpload3}
                                disabled={image ? false : true}
                                style={{ backgroundColor: !image ? "darkgray" : "skyblue", borderColor: !image ? "gray" : "white", borderWidth: 1, borderRadius: 7, width: width * 0.3, height: height * 0.05, justifyContent: "center", alignItems: "center" }}>
                                {PromiseLoading ? <ActivityIndicator size={"small"} color={"white"} /> : <Text style={{ color: "white" }}>올리기</Text>}
                            </TouchableOpacity>
                        </SubmitButtonBox>
                    </View>
                }
            
            </ImageBackground>}
        </Container>
    )
        {/* <Container>
            <Text>hello world</Text>
            <View>
                <PhotoContainer>
                    {image ? <View></View> : <Image resizeMode='cover' style={{height: height*}}/>}
                </PhotoContainer>
                <TouchableOpacity>
                    <Text>사진 선택하기</Text>
                </TouchableOpacity>
            </View>
        </Container> */}
    
}