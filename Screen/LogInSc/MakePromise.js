import React, { useEffect, useState } from 'react';
import { Button, FlatList, Image, ImageBackground, Text, TextInput, TouchableOpacity, useWindowDimensions, View, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import styled from 'styled-components/native'
import DismissKeyboard from '../../shared/DismissKeyboard';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useForm } from 'react-hook-form';
import {useFonts} from 'expo-font'
import { galaxy } from './Main';
import { SEE_PROMISE_FEED } from './Schedule';
import { sendNotification } from '../../helper/sendNotification';
const MAKE_PROMISE = gql`
    mutation makePromise($title:String!,$participants:[String],$date:String!,$payload:String){
        makePromise(title: $title, participants: $participants, date: $date, payload: $payload){
            ok
            error
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
        }
    }
`
const SubmitButton = styled.TouchableOpacity`
    width: 300px;
    justify-content: center;
    align-items: center;
    background-color: skyblue;
    padding: 15px 10px;
    margin: 10px;
    margin-top: 20px;
    border-radius: 7px;
`


export default function MakePromise({ navigation, route }) {
    const [loaded] = useFonts({
        font: require("../../assets/Noto_Serif_KR/NotoSerifKR-Light.otf")
    })
    
    
    const familyArray = route.params.family.seeFamily.map((item) => { return { ...item, selected: false } });
    const { width, height } = useWindowDimensions();
    const [data, setData] = useState(familyArray);
    
    const { data: familyData, loading: familyLoading } = useQuery(SEE_FAMILY_CODE);
    const pushTokenArr = familyData?.seeFamilyCode?.users.map((i) => i.pushToken)// 푸시알림 토큰들
    

    const { handleSubmit, setValue, watch, register } = useForm();
    useEffect(() => {
        register("title")
        register("payload")
    }, [register]);
    const [makePromiseMutation, { loading }] = useMutation(MAKE_PROMISE, {
        onCompleted: async ({ makePromise: { ok, error } }) => {
            if (ok) {
                navigation.goBack();
                sendNotification(pushTokenArr,"새로운 가족약속이 생겼어요!")
            }
        },
        refetchQueries: [{query: SEE_PROMISE_FEED}]
    })
    const onValid = ({ title, payload }) => {
        console.log(title,"/",date)
        if (!title) {
            Alert.alert(
            "제목 없음",
            "제목을 입력해주세요!",
            [
                {
                    text: "확인",
                    onPress: () => "",
                    style: "cancel"
                },
            ]
        );
        } else if(!date) {
            Alert.alert(
            "날짜 없음",
            "날짜를 선택해주세요!",
            [
                {
                    text: "확인",
                    onPress: () => "",
                    style: "cancel"
                },
            ]
        );
        }
        else {
            makePromiseMutation({
                variables: {
                    title,
                    payload,
                    date,
                    participants
                }
            })
        }
        
    }
    const makeArray = () => {
        let ARRAY = [];
        const arrayOfName = data.forEach((i) => {
            if (i.selected) {
                ARRAY.push(i.username);
            }
        })
        return ARRAY
    }
    const participants = makeArray();
    


    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [date,setDate] = useState("")
    
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        const newDay = new Date(date);
        newDay.setHours(0);
        newDay.setMinutes(1);
        setDate(newDay)
        hideDatePicker();
    };


    //체크해주는 거
    const checkFunc = (item) => {
        const newData = data.map((exData) => {
            if (exData.id == item.id) {
                return {
                    ...exData,
                    selected: !item.selected
                }
            } else {
                return {
                    ...exData,
                }
            };
        })
        setData(newData)
    }
    
    /* console.log("---new data",data); */
    
    return (
        <View style={{ width, height, flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
            {loaded && <DismissKeyboard>
                <ImageBackground resizeMode='cover' source={require("../../assets/배경.png")} style={{ width, height, justifyContent: "center", alignItems: "center" }}>
                
                    <View style={{ flexDirection: "row", }}>
                        <View>
                            <Text style={{ fontWeight: "600", fontSize: 23, fontFamily:galaxy ? null: "font" }}>약속제목</Text>
                            <View style={{ width: width * 0.4, height: height * 0.15, padding: 10, justifyContent: "center", borderWidth: 1, borderColor: "skyblue", borderRadius: 7, backgroundColor: "white" }}>
                                <TextInput
                                    onChangeText={(text) => setValue("title", text)}
                                    placeholder='제목을 입력해주세요'
                                    style={{ height: height * 0.05, width: "98%", backgroundColor: 'white', borderBottomWidth: 3, borderBottomColor: "gray" }} />
                            </View>
                        </View>
                        <View>
                            <Text style={{ fontWeight: "600", fontSize: 23, fontFamily:galaxy ? null: "font" }}>약속날짜</Text>
                            <View style={{ width: width * 0.4, height: height * 0.15, backgroundColor: "skyblue", borderWidth: 1, borderColor: "skyblue", borderRadius: 7, alignItems: "center", justifyContent: "center" }}>
                                
                                <TouchableOpacity
                                    onPress={showDatePicker}
                                >
                                    <Ionicons name="calendar-sharp" size={30} color="black" />
                                </TouchableOpacity>
                                {!date ?
                                    <Text style={{ color: "gray", fontFamily:galaxy ? null: "font" }}>날짜를 선택해 주세요</Text>
                                    :
                                    <Text style={{ fontSize: 20, fontWeight: "600", marginTop: 10, fontFamily:galaxy ? null: "font" }}>{`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`}</Text>
                        
                                }
                            </View>
                        </View>
                    </View>
                    <View style={{ width: width * 0.8, height: height * 0.23,}}>
                        <Text style={{ fontWeight: "600", fontSize: 23, fontFamily:galaxy ? null: "font" }}>약속 내용</Text>
                        <TextInput
                            onChangeText={(text) => setValue("payload", text)}
                            multiline
                            placeholder={`ex)${"\n"}-식사메뉴: ${"\n"}-장소: ${"\n"}-기타:`}
                            style={{ height: height * 0.18, width: "100%", padding: 10, paddingTop: 10, backgroundColor: 'white', borderWidth: 1, borderColor: "skyblue", borderRadius: 7 }} />
                    </View>
                    <View style={{ width: width,alignItems: "center",backgroundColor: "white", borderWidth: 1, borderColor: "skyblue", borderRadius: 7,marginTop:15 }}>
                        <Text style={{ fontWeight: "600", fontSize: galaxy?18:24, marginTop: 10, fontFamily:galaxy ? null: "font" }}>참여가족</Text>
                        <Text style={{ marginTop: 5, color: "gray", fontFamily:galaxy ? null: "font" }}>- 터치해주세요 -</Text>
                        <FlatList
                            data={data}
                            horizontal
                            style={{ marginVertical: 10 }}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item, index }) => {
                                
                                return (
                                    <TouchableOpacity onPress={() => checkFunc(item, index)} style={{alignItems: "center" }}>
                                        <Text style={{ fontFamily:galaxy ? null: "font" }}>{item?.username}</Text>
                                        {item?.avatar ?
                                            <View>
                                                <Image source={{ uri: item?.avatar }} resizeMode='cover' style={{ height: 80, width: 80, marginLeft: 10, borderRadius: 40 }} />
                                                {item.selected == true &&
                                                    <Ionicons name='checkmark' size={50} color={"red"} style={{ position: 'absolute', top: 20, left: 30 }} />
                                                }
                                            </View>
                                            :
                                            <View>
                                                <Ionicons size={80} name='person-circle-outline' color={"darkgray"} />
                                                {item.selected == true && <Ionicons name='checkmark' size={50} color={"red"} style={{ position: 'absolute', top: 20, left: 30 }} />}
                                            </View>
                                        }
                                    </TouchableOpacity>
                                )
                            }}
                        />
                    </View>
                
            
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        display={Platform.OS === 'ios' ? "inline" : "default"}
                        textColor='black'
                        pickerContainerStyleIOS={{ backgroundColor: 'skyblue', justifyContent: "center", }}
                        confirmTextIOS='완료'
                        cancelTextIOS='취소'
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                    />
                    <SubmitButton onPress={handleSubmit(onValid)}>
                        <Text style={{ fontFamily:galaxy ? null: "font" }}>약속 잡기</Text>
                    </SubmitButton>
                    
                </ImageBackground>
            </DismissKeyboard>}
        </View>
    );
};