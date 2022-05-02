import { gql, useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Image, Text, TextInput, useWindowDimensions, View, KeyboardAvoidingView, TouchableOpacity, Alert, Platform } from 'react-native';
import styled from 'styled-components/native';
import { userConnect } from '../../apollo';
import DismissKeyboard from '../../shared/DismissKeyboard';
import { Choice, ChoiceBox, Container, SubmitBtn } from './Username';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SEE_FAMILY_CODE } from '../LogInSc/Main';
import { updatePushToken } from '../../helper/updatePushToken';
import { registerForPushNotificationsAsync } from '../../helper/getPermissionAndToken';
import {useFonts} from 'expo-font'

const CREATE_FAMILY_CODE = gql`
    mutation createFamilyCode($familyCode:String!) {
        createFamilyCode(familyCode:$familyCode){
            code
        }
    }
`
const CHECK_FAMILY_CODE = gql`
    query checkFamilyCode{
        checkFamilyCode
    }
`
const CONNECT_FAMILY = gql`
    mutation connectFamily($familyCode:String!){
        connectFamily(familyCode:$familyCode){
            ok
            error
        }
    }
`
const onCompleted = async (data) => {
    const { code } = data.createFamilyCode;
    const token = await registerForPushNotificationsAsync();
    await updatePushToken(token)
    userConnect(code);
}
const onCompleted2 = async (data) => {
    const { ok, error } = data.connectFamily;
    if (ok) {
        userConnect(watch("familyCode"));
    } else {
        alert("존재하지 않는 코드입니다.")
    }
};

const TextBox = styled.View`
    align-items: center;
    width: 100%;
    background-color: skyblue;
`
const WhiteText = styled.Text`
    color: white;
    padding: 10px;
`
const BlackText = styled.Text`
    color: black;
    padding: 20px;
`

export default function FamilyCode() {
    const [loaded] = useFonts({
        font: require("../../assets/Noto_Serif_KR/NotoSerifKR-Light.otf")
    })
    const { width, height } = useWindowDimensions();
    const [alreadyEx, setAlreadyEx] = useState(true);
    const [showCode, setShowCode] = useState(false);
    const [familyCode, setFamilyCode] = useState("");
    
    const copyToClipboard = () => {
        Clipboard.setString(familyCode);
        Alert.alert(
            "복사 완료",
            "가족들께 공유해주세요~",
            [
                {
                text: "확인",
                onPress: () => "",
                style: "cancel"
                },
                
            ]
        )
    };
    /* const dltFamily = async () => {
        const a = await AsyncStorage.getItem("familyCode")
        const b = await AsyncStorage.getItem("token")
        console.log(a, b)
    }
    dltFamily() */
    const dltFamily2 = async () => {
        await AsyncStorage.removeItem("familyCode")
    } 
    /* dltFamily2() */
    /* dltFamily() */
    const [makeNewFC, { loading }] = useMutation(CREATE_FAMILY_CODE, {
        onCompleted,
    })
    const makeFamilyCode = () => {
        makeNewFC({
            variables: {
                familyCode,
            },
            refetchQueries: [{ query: SEE_FAMILY_CODE }],
        })
    }
    const [connectFamily, { loading: connectLoading }] = useMutation(CONNECT_FAMILY, {
        onCompleted: async (data) => {
            const { ok, error } = data.connectFamily;
            if (ok) {
                const token = await registerForPushNotificationsAsync();
                await updatePushToken(token)
                userConnect(watch("familyCode"));
                
            } else {
                alert("존재하지 않는 코드입니다.")
            }
        },
        refetchQueries: [{ query: SEE_FAMILY_CODE }],
    })
    useEffect(() => {
        const randomCode = Math.random().toString(16).substring(2, 9);
        setFamilyCode(randomCode);
    },[])
    const buttonChange1 = () => {
        setAlreadyEx(true);
    }
    const buttonChange2 = () => {
        setAlreadyEx(false);
    }
    const showingCode = () => {
        setShowCode(true)
    }
    const {setValue,watch,handleSubmit,register} = useForm()
    useEffect(() => {
        register("familyCode")
    },[register])
    
    const onVaild = ({familyCode}) => {
        connectFamily(
            {
                variables: {
                    familyCode,
                }
            }
        )
    }
    const galaxy = Platform.OS == 'android'
    return (
        <DismissKeyboard>
            <View style={{ flex: 1 }}>
                {loaded && <KeyboardAvoidingView /*키보드 떴을 때 가리는 걸 막기 위함임.*/
                    style={{
                        flex: 1,
                        backgroundColor: "white",
                        justifyContent: "center",
                        alignItems: "center",
                    
                        /*박스 속성 땜시 안해주면 쭈그러듬*/
                    }}
                    behavior="height"
                    keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0} /*기종이 먼지에 따라서도 코드 짜는 게 가능*/
                >
                    <Container style={{ justifyContent: "center", alignItems: "center", paddingBottom: 70 }}>
                        <Image source={require("../../assets/icon.png")} style={{ width: width * 0.35, height: width * 0.35, marginBottom: 20 }} resizeMode='cover' />
                        <TextBox>
                            <WhiteText style={{ fontFamily: galaxy? null :'font' }}>로그인이 완료되었습니다.</WhiteText>
                            <WhiteText style={{ fontFamily: galaxy? null :'font' }}>가족과 연결하기 위해선 패밀리코드가 필요합니다.</WhiteText>
                            <BlackText style={{ fontFamily: galaxy? null :'font' }}>1. 새로 발급 받은 후에 가족에게 알려주시거나.</BlackText>
                            <BlackText style={{ fontFamily: galaxy? null :'font' }}>2. 기존 가족구성원이 코드를 갖고 있다면 입력해주세요~</BlackText>
                        </TextBox>
                        <ChoiceBox style={{ marginTop: 30 }}>
                            <Choice
                                onPress={buttonChange1}
                                style={{
                                    width: width * 0.3,
                                    height: height * 0.04,
                                    backgroundColor: alreadyEx ? "skyblue" : "white",
                                    borderBottomColor: "skyblue",
                                    borderBottomWidth: 1,
                                    borderTopColor: "skyblue",
                                    borderTopWidth: 1
                                }}
                            >
                                <Text style={{ fontFamily: galaxy? null :'font' }}>새로 발급받기</Text>
                            </Choice>
                            <Choice
                                onPress={buttonChange2}
                                style={{
                                    width: width * 0.3,
                                    height: height * 0.04,
                                    backgroundColor: !alreadyEx ? "skyblue" : "white",
                                    borderBottomColor: "skyblue",
                                    borderBottomWidth: 1,
                                    borderTopColor: "skyblue",
                                    borderTopWidth: 1
                                }}
                            >
                                <Text style={{ fontFamily: galaxy? null :'font' }}>기존 코드 입력하기</Text>
                            </Choice>
                        </ChoiceBox>
                        {alreadyEx ?
                            <View style={{
                                justifyContent: "center",
                                alignItems: "center",
                                width: width * 0.8,
                                height: height * 0.1,
                                backgroundColor: "white",
                                borderBottomColor: "skyblue",
                                borderBottomWidth: 2,
                                borderTopColor: "skyblue",
                                borderTopWidth: 2
                            }}>
                                {!showCode ?
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <TouchableOpacity
                                            onPress={showingCode}
                                            style={{ backgroundColor: "skyblue", padding: 10, borderRadius: 7 }}>
                                            <Text style={{ fontSize: 28, color: "white", }}>발급</Text>
                                        </TouchableOpacity>
                                    
                                    </View>
                                    :
                                    <View style={{ width: "100%", alignItems: "center" }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", width: "100%", marginBottom: 10 }}>
                                            <Text style={{ fontSize: 28, fontWeight: "600", fontFamily: galaxy? null :'font' }}>
                                                {familyCode}
                                            </Text>
                                            <TouchableOpacity
                                                onPress={copyToClipboard}
                                                style={{ padding: 10, backgroundColor: "darkgray", borderRadius: 8 }}>
                                                <Text style={{ color: "white", fontFamily: galaxy? null :'font' }}>복사하기</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View>
                                            <Text style={{ color: "gray", fontFamily: galaxy? null :'font' }}>*이 코드는 앱 안에서도 보실 수 있습니다</Text>
                                        </View>
                                    </View>
                                
                                        
                                
                                }
                            
                            </View>
                            :
                            <View style={{ alignItems: "center" }}>
                                <TextInput style={{ width: 200, height: 30, backgroundColor: "white", borderWidth: 1, borderColor: "skyblue" }} value={watch("familyCode")} onChangeText={(text) => setValue("familyCode", text)} />
                                <SubmitBtn
                                    onPress={handleSubmit(onVaild)}
                                    style={{ width: width * 0.24, height: height * 0.04 }}>
                                    <Text style={{ fontFamily: galaxy? null :'font' }}>완료</Text>
                                </SubmitBtn>
                            </View>
                        }
                        {showCode ?
                            <SubmitBtn
                                onPress={makeFamilyCode}
                                style={{ width: width * 0.4, height: height * 0.05 }}>
                                <Text style={{ fontWeight: "500", fontFamily: galaxy? null :'font' }}>이 코드로 시작하기</Text>
                            </SubmitBtn>
                            : null}

                    
                        {/* <Button title='새로 발급받고 방 만들기' onPress={makeNewFC} /> */}
                        
                        {/* <Button title='기존 코드 입력 후 방 들어가기' onPress={handleSubmit(onVaild)} /> */}
                    </Container>
                </KeyboardAvoidingView>}
            </View>
        </DismissKeyboard>
    );
}