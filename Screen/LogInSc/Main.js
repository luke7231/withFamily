import { ActivityIndicator, Button, Dimensions, FlatList, Image, ImageBackground, Modal, Platform, Pressable, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Ionicons } from '@expo/vector-icons';
import { logUserOut, userInConnect } from '../../apollo';
import AsyncStorage from '@react-native-async-storage/async-storage'
import useMe, { ME_QUERY } from '../../hooks/useMe';
import { checkElapsed } from '../../shared/checkFunc';
import { sendMessage, sendNotification } from '../../helper/sendNotification';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import DismissKeyboard from '../../shared/DismissKeyboard';
import { useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { ReactNativeFile } from "apollo-upload-client";
import {useFonts} from 'expo-font'
import { caculateElapsedTime } from '../../shared/leftTimeCaculator';
import scheduleNoti from '../../helper/scheduleNoti';

export const galaxy = Platform.OS == 'android';
const UPLOAD_TODAYTALK = gql`
    mutation createTodayTalk($payload:String!,$file:Upload){
        createTodayTalk(payload:$payload,file:$file){
            ok
            error
        }
    }
`
const SEE_TODAYTALKBOX = gql`
    query seeTodayTalk {
        seeTodayTalk{
            id
            todayTalks{
                id
                payload
                file
                user{
                    id
                    username
                    avatar
                }
            }
        }
    }
`

export const SEE_FAMILY_CODE = gql`
    query seeFamilyCode {
        seeFamilyCode {
            code
            photos{
                file
                caption
            }
            users{
                id
                pushToken
                username
                avatar
            }
            hours
            minutes
        }
    }
`
export const ModalBackground = styled.View`
    background-color: gray
    justify-content: center;
    align-items: center;

`
const ModalContainer = styled.View`
    background-color: white;
    justify-content: space-evenly;
    align-items: center;
`
const BottomBox = styled.View`
    width: 100%
    flex-direction: row;
    justify-content: space-around;
`
const ButtonBox = styled.View`
    flex-direction: row;
    `
export default function Main() {
    
    /* useEffect(() => {
        const { leftHours, leftMinutes } = caculateElapsedTime();
        scheduleNoti(leftHours, leftMinutes);
    },[]) */
    const navigation = useNavigation();
    const [modalVisible, setModalvisible] = useState(false);
    const [modalImage, setModalImage] = useState("");
    
    const [loaded] = useFonts({
        font: require("../../assets/Noto_Serif_KR/NotoSerifKR-Light.otf")
    })
    /* const day = new Date();
    day.setHours(21);// <--
    day.setMinutes(0);// <--
    useEffect(() => {
        const elapsed = checkElapsed(day);
        if (elapsed) {
            setModalvisible(true)
        }
    },[]) */
    const { data: todayTalkBoxData, loading: todayTalkBoxLoading } = useQuery(SEE_TODAYTALKBOX);
    
    const { register, handleSubmit, setValue, getValues } = useForm() //모달 폼
    useEffect(() => {
        register("todayTalk")
    }, [register]);
    const modalOnVaild = ({ todayTalk }) => { //모달 제출시
        let file;
        if (modalImage) {
            file = new ReactNativeFile({
                uri: modalImage,
                name: "1.jpg",
                type: "image/jpeg"
            })
        }
        createTodayTalkMutation({
            variables: {
                payload: todayTalk,
                file
            }
        })
    }
    const [createTodayTalkMutation, { loading: todayTalkLoading }] = useMutation(UPLOAD_TODAYTALK, {
        onCompleted: () => {
            setModalvisible(false);
            setModalImage("");
            sendNotification(pushTokenArr, `${me.Me.username}님이 하루 한 마디, 안부를 작성했습니다!`)
        },
        refetchQueries: [{ query: SEE_TODAYTALKBOX }],
    })
    
    const pickImage = async () => {//모달 이미지 
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        
        console.log(result);
        
        if (!result.cancelled) {
            setModalImage(result.uri);
        }
    };
    
    const { data, loading } = useQuery(SEE_FAMILY_CODE);
    useEffect(() => {
        if (!loading) {
            const hours = data.seeFamilyCode.hours;
            const minutes = data.seeFamilyCode.minutes;
            if (!hours && !minutes) {
                console.log('없음')
            } else {
                
                const { leftHours, leftMinutes } = caculateElapsedTime(Number(hours), Number(minutes));
                
                scheduleNoti(leftHours, Number(leftMinutes));
            }
            
        
        }
    },[loading])
    const HeaderLeft = ({ code }) => {
        
        return (
            <TouchableOpacity style={{borderWidth:1,borderColor:"skyblue"}}>
                <Text>{code}</Text>
            </TouchableOpacity>
        )
    }
    const [familyCodePhoto, setFamilyCodePhoto] = useState("");
    useEffect(() => {
        if (!loading) {
            navigation.setOptions({
                headerLeft: () => <HeaderLeft code={data.seeFamilyCode.code} />
            })
            const photolength = data?.seeFamilyCode?.photos.length
            setFamilyCodePhoto(data?.seeFamilyCode?.photos[photolength-1])
        }
    }, [data])
    
    const pushTokenArr = data?.seeFamilyCode?.users.map((i) => i.pushToken)// 푸시알림 토큰들

    const { data: MeData, loading: MeLoading } = useQuery(ME_QUERY);
    const [me, setMe] = useState({});
    /* const setNewMe = () => {
        setMe(MeData)
        if (!me) {
            const elapsed = checkElapsed(day);
            if (elapsed) {
                setModalvisible(true)
            }
        }
    } */
    useEffect(() => {
        setMe(MeData)
    }, [MeData])
    



    const DIMENSTION = useWindowDimensions()
    const IMAGE_WIDHT = DIMENSTION.width * 0.55;
    const INPUTBOX_WIDTH = DIMENSTION.width * 0.83 * 0.9;
    const INPUTBOX_HEIGHT = DIMENSTION.height * 0.4 * 0.7;
    const TALKBOX_WIDTH = DIMENSTION.width * 0.88;
    const TALKBOX_HEIGHT = DIMENSTION.height * 0.31;
    
    const logoutandfmilyout = () => {
        logUserOut()
        userInConnect();
    }
    const dltFamily = async () => {
        const a = await AsyncStorage.getItem("familyCode")
        const b = await AsyncStorage.getItem("token")
        console.log(a, b)
    }
    
    return (
        
        <View style={{ justifyContent: "center", alignItems: "center", flex: 1, width: DIMENSTION.width, height: DIMENSTION.height }}>
            {loaded && <ImageBackground resizeMode='cover' source={require("../../assets/배경.png")} style={{ width: DIMENSTION.width, height: DIMENSTION.height, justifyContent: "center", alignItems: "center" }}>
                
                <View style={{ flexDirection: 'row', marginBottom: 30 }}>
                    <TouchableOpacity
                        /* disabled={!familyCodePhoto?.file ? false : true} */
                        onPress={() => navigation.navigate("UploadFile", {
                            key: "가족사진"
                        })}
                        style={{
                            transform: [
                                { rotateZ: "-7deg" }
                            ],
                            justifyContent: "center",
                            alignItems: 'center',
                            width: DIMENSTION.height * 0.26,
                            height: DIMENSTION.height * 0.3,
                            paddingBottom: 15,
                            backgroundColor: "skyblue",
                            borderRadius: 5
                        }}>
                        {!familyCodePhoto?.file ?
                            <View style={{ justifyContent: "center", alignItems: "center", width: DIMENSTION.height * 0.25, height: DIMENSTION.height * 0.25, backgroundColor: "white" }}>
                                <Ionicons name="add" size={80} color="skyblue" />
                                <Text style={{ color: "skyblue", fontFamily:galaxy ? null: "font" }}>가족사진을 추가해보세요.</Text>
                            </View>
                            :
                            <View>
                                <Image style={{ width: DIMENSTION.height * 0.25, height: DIMENSTION.height * 0.25 }} resizeMode='cover' source={{ uri: familyCodePhoto?.file }} />
                            </View>
                            }
                    
                    </TouchableOpacity>
                
                    <View style={{/* height: 300, width: 200, */justifyContent: "center", alignItems: "center", transform: [{ rotateZ: "7deg" }], }}>
                        <FlatList
                            
                            scrollEnabled={false}
                            numColumns={2}
                            data={data?.seeFamilyCode?.users}
                            keyExtractor={(user) => user.id}
                            renderItem={({ item }) => {
                                /* console.log(item) */
                                
                                return (
                                    <TouchableOpacity
                                        disabled={me?.Me?.id == item.id ? false : true}
                                        onPress={() => navigation.navigate("UploadFile", {
                                            key: "프로필"
                                        })}
                                        style={{ width: IMAGE_WIDHT / 2, height: IMAGE_WIDHT / 2, }}>
                                        {item.avatar ?
                                            <View style={{ alignItems: "center" }}>
                                                <Image
                                                    style={{
                                                        backgroundColor: "white",
                                                        borderRadius: 50,
                                                        height: IMAGE_WIDHT / 2,
                                                        width: IMAGE_WIDHT / 2
                                                    }}
                                                    source={{ uri: item?.avatar }}
                                                    resizeMode='cover' />
                                                <Text style={{ position: "absolute", top: IMAGE_WIDHT / 2 * 0.7, color: "white", fontFamily: galaxy ? null: "font" }}>{item?.username}</Text>
                                            </View>
                                            :
                                            <View style={{ width: IMAGE_WIDHT / 2, height: IMAGE_WIDHT / 2, alignItems: "center", }}>
                                                <Ionicons name="person-circle-outline" size={IMAGE_WIDHT / 2} color="darkgray" />
                                                <Text style={{ position: 'absolute', top: IMAGE_WIDHT / 2 * 0.7, fontFamily:galaxy ? null: "font" }}>{item?.username}</Text>
                                            </View>
                                        }
                                    </TouchableOpacity>)
                            }
                            }
                        />
                    </View>
                </View>
                {/* <Button title='LogOut' onPress={() => logoutandfmilyout()} /> */}

                {todayTalkBoxData?.seeTodayTalk ?
                    <View style={{ alignItems: "center", width: TALKBOX_WIDTH }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-around", width: TALKBOX_WIDTH }}>
                            <View style={{ width: TALKBOX_WIDTH * 0.2, }}>
                                
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: DIMENSTION.width * 0.4, height: DIMENSTION.height * 0.05, backgroundColor: "skyblue", borderTopLeftRadius: 7, borderTopRightRadius: 7 }}>
                                <Text style={{ fontWeight: "600", fontFamily:galaxy ? null: "font" }}>하루 한 마디,</Text>
                                <Text style={{ fontWeight: "600", fontSize: 20, fontFamily:galaxy ? null: "font" }}> 안부</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setModalvisible(true)}
                                style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width: TALKBOX_WIDTH * 0.2, backgroundColor: "skyblue", borderRadius: 7 }}>
                                <Ionicons name='add-circle' color={"white"} />
                                <Text style={{ color: "white", fontFamily:galaxy ? null: "font" }}>추가</Text>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                width: TALKBOX_WIDTH,
                                height: TALKBOX_HEIGHT,
                                backgroundColor: "white",
                                paddingTop: 10,
                            }}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                numColumns={1}
                                data={todayTalkBoxData?.seeTodayTalk.todayTalks}
                                keyExtractor={(talks) => talks.id}
                                renderItem={({ item }) => {
                                    return (
                                        <View style={{ width: TALKBOX_WIDTH * 0.9, backgroundColor: "white", marginBottom: 10, flexDirection: "row", borderBottomColor: "darkgray", borderBottomWidth: 1 }}>
                                            <View testID='프로필 박스' style={{ width: TALKBOX_WIDTH * 0.9 * 0.25, alignItems: "flex-start" }}>
                                                <View style={{ alignItems: "center" }}>
                                                    {item?.user.avatar ?
                                                        <Image source={{ uri: item?.user.avatar }} resizeMode='cover' style={{ height: TALKBOX_HEIGHT * 0.2 * 0.9, width: TALKBOX_HEIGHT * 0.2 * 0.9, borderRadius: TALKBOX_HEIGHT * 0.2 * 0.9 / 2, }} />
                                                        :
                                                        <Ionicons size={TALKBOX_HEIGHT * 0.2 * 0.9} name='person-circle-outline' color={"darkgray"} />
                                                    }
                                                
                                                    <Text style={{ fontWeight: "600", marginBottom: 3, fontFamily:galaxy ? null: "font" }}>{item.user.username}</Text>
                                                </View>
                                            </View>
                                            <View testID='페이로드 박스' style={{ justifyContent: "center", width: TALKBOX_WIDTH * 0.9 * 0.75 }}>
                                                {item?.file && <Image source={{ uri: item.file }} style={{ width: TALKBOX_WIDTH * 0.25, height: TALKBOX_WIDTH * 0.25 }} resizeMode='cover' />}
                                                <Text style={{ fontFamily:galaxy ? null: "font" }}>{item.payload}</Text>
                                            </View>
                                        </View>
                                    )
                                }}
                            />
                        </View>
                    </View>
                    :
                    <View style={{ alignItems: "center" }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: DIMENSTION.width * 0.4, height: DIMENSTION.height * 0.05, backgroundColor: "skyblue", borderTopLeftRadius: 7, borderTopRightRadius: 7 }}>
                            <Text style={{ fontWeight: "600", fontFamily:galaxy ? null: "font" }}>하루 한 마디,</Text>
                            <Text style={{ fontWeight: "600", fontSize: 20, fontFamily:galaxy ? null: "font" }}> 안부</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => setModalvisible(!modalVisible)}
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                width: TALKBOX_WIDTH,
                                height: TALKBOX_HEIGHT,
                                backgroundColor: "white",
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 0.3,
                                },
                                shadowOpacity: 0.3,
                                shadowRadius: 5,
                            }}>
                            <Ionicons name='pencil' size={35} color={"skyblue"} style={{ marginBottom: 20 }} />
                            <Text style={{ fontWeight: "600", fontFamily:galaxy ? null: "font" }}>가족에게 안부를 전해주세요~</Text>
                        </TouchableOpacity>
                    </View>
                }

                <Modal
                    visible={modalVisible}
                    transparent={true}
                    onRequestClose={() => setModalvisible(!modalVisible)}
                >
                    
                    <ModalBackground style={{ top: 0, left: 0, position: "absolute", width: DIMENSTION.width, height: DIMENSTION.height, opacity: 0.7, }}></ModalBackground>
                    <DismissKeyboard>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>
                            <ModalContainer style={{ width: DIMENSTION.width * 0.83, height: DIMENSTION.height * 0.44, borderRadius: 7, opacity: 1, }}>
                                <View style={{ flexDirection: "row", }}>
                                    <Text style={{ fontWeight: "600",fontFamily:galaxy ? null: "font" }}>하루 한 마디,</Text>
                                    <Text style={{ fontWeight: "600", fontSize: 20, fontFamily:galaxy ? null: "font" }}> 안부</Text>
                                </View>
                                <View>
                                    {modalImage ?
                                        <View style={{ padding: 20, width: INPUTBOX_WIDTH, height: INPUTBOX_HEIGHT, borderWidth: 1, borderColor: "gray", borderRadius: 7 }}>
                                            <Image source={{ uri: modalImage }} resizeMode='cover' style={{ width: INPUTBOX_WIDTH / 2.5, height: INPUTBOX_WIDTH / 2.5 }} />
                                            <TextInput
                                                
                                                textAlignVertical='top'
                                                multiline
                                                onChangeText={(text) => setValue("todayTalk", text)}
                                            />
                                        </View>
                                        :
                                        <TextInput
                                            textAlignVertical='top'
                                            multiline={true}
                                            onChangeText={(text) => setValue("todayTalk", text)}
                                            placeholder='Ex) 하루 중 기억에 남는 일, 오늘 먹은 점심 메뉴 등.'
                                            placeholderTextColor={"gray"}
                                            style={{ padding: 20, paddingTop: 20, backgroundColor: "white", width: INPUTBOX_WIDTH, height: INPUTBOX_HEIGHT, borderWidth: 1, borderColor: "gray", borderRadius: 7 }} />
                                    }
                                </View>
                                <BottomBox>
                                    <TouchableOpacity
                                        onPress={pickImage}
                                        style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "gray", borderRadius: 6, padding: 5 }}>
                                        <Ionicons name='image' style={{ marginRight: 6 }} size={20} />
                                        <Text style={{ fontFamily: "font" }}>사진 추가</Text>
                                    </TouchableOpacity>
                                    <ButtonBox>
                                        {!todayTalkLoading ? <TouchableOpacity
                                            onPress={() => setModalvisible(!modalVisible)}
                                            style={{ width: INPUTBOX_WIDTH * 0.25, height: INPUTBOX_HEIGHT * 0.15, backgroundColor: "pink", alignItems: "center", justifyContent: "center", borderRadius: 6, marginRight: 3 }}>
                                            <Text style={{ fontFamily: galaxy ? null : "font" }}>취소</Text>
                                        </TouchableOpacity>:null}
                                        <TouchableOpacity
                                            onPress={handleSubmit(modalOnVaild)}
                                            style={{ width: INPUTBOX_WIDTH * 0.25, height: INPUTBOX_HEIGHT * 0.15, backgroundColor: "skyblue", alignItems: "center", justifyContent: "center", borderRadius: 6, marginLeft: 3 }}>
                                            {!todayTalkLoading ? <Text style={{ color: "white", fontFamily: galaxy ? null : "font" }}>올리기</Text> : <ActivityIndicator size={"small"} color="white"/>}
                                        </TouchableOpacity>
                                    </ButtonBox>
                                </BottomBox>
                            
                            </ModalContainer>
                        </View>
                    </DismissKeyboard>
                </Modal>
                {/* <Pressable
                    style={{ padding: 10, backgroundColor: "skyblue" }}
                    onPress={() => setModalvisible(true)}
                >
                    <Text>Show Modal</Text>
                </Pressable> */}
                {/*                 <Button title='Notification' onPress={() => sendNotification(pushTokenArr)} />
                <Button title='Go Upload Screen' onPress={() => navigation.navigate("UploadFile")} /> */}
            </ImageBackground>}
        </View>
    );
}