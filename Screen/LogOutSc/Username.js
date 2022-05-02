import { Alert, Button, Image, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { set, useForm } from "react-hook-form";
import { useEffect, useState } from 'react';
import { isLoggedInVar, logUserIn, logUserOut, userInConnect } from '../../apollo';
import DismissKeyboard from '../../shared/DismissKeyboard';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFonts } from 'expo-font'
import { galaxy } from '../LogInSc/Main';

/* const CHECK_QUERY = gql`
    query chechAlreadyExisted($username:String){
        chechAlreadyExisted(username:$username){
            ok
            error
        }
    }
` */
const CREATE_USER = gql`
    mutation createAccount($userId:String!,$username:String!,$password:String!){
        createAccount(userId:$userId,username:$username,password:$password){
            ok
            error
            token
        }
    }
`
const LOGIN_MUTATION = gql`
    mutation Login($userId:String!,$password:String!){
        Login(userId:$userId, password:$password){
            ok
            token
            error
        }
    }
`
export const Container = styled.View`
    flex: 1; 
    justify-content: center; 
    align-items: center; 
    background-color: white;
`
export const ChoiceBox = styled.View`
    flex-direction: row;
    margin-bottom: 20px;
`
export const Choice = styled.TouchableOpacity`
    justify-content: center; 
    align-items: center; 
    margin-left: 5px;
    margin-right: 5px;
`
const InputBox = styled.View`
    align-items: center;
`
const ExplainBox = styled.View`
    align-items: center;
    margin-bottom: 20px;
`
export const SubmitBtn = styled.TouchableOpacity`
    background-color: skyblue;
    border-radius: 7px;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 50px;
`
const createAlert = () =>
        Alert.alert(
            "죄송합니다",
            "이미 존재하는 아이디입니다.",
            [
                {
                    text: "확인",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
            ]
    );
const createLoginAlert = (message) =>
    Alert.alert(
        "죄송합니다",
        message,
        [
            {
                text: "확인",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
        ]
    )
//회원가입
const onCompleted2 = async (d) => {
        const { createAccount: { ok, error, token } } = d;
        if (ok) {
            logUserIn(token)
        } else {
            createAlert()
        }
};
//로그인
const onCompleted = async (data) => {
    const { Login: { ok, error, token } } = data;
    if (ok) {
        logUserIn(token);
    } else {
        createLoginAlert(error);
    }
};

export default function Username({ navigation }) {
    const [loaded] = useFonts({
        font: require("../../assets/Noto_Serif_KR/NotoSerifKR-Light.otf")
    })
    
    const [isFirst, setIsFirst] = useState(true);
    const { width, height } = useWindowDimensions();
    const {setValue,register,watch,handleSubmit} = useForm();
    
    const [createUserMutation, { loading: MutationLoading }] = useMutation(CREATE_USER, {
        onCompleted: onCompleted2
    })
    const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION, {
        onCompleted,
    });
    const setFirst = () => {
        setIsFirst(true);
    }
    const setNoFirst = () => {
        setIsFirst(false);
    }
    const createAlert = () =>
        Alert.alert(
            "Alert Title",
            "My Alert Msg",
            [
                {
                    text: "확인",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
            ]
        );
    useEffect(() => {
        register("userId")
        register("username")
        register("password")
    }, [register])
    
    const onValid = ({ userId, username, password }) => {

        createUserMutation({
            variables: {
                userId,
                username,
                password,
            }
        })
    
        
    };
    const onValid2 = ({ userId, password }) => {
        if (!loading) {
            loginMutation({
                variables: {
                    userId,
                    password
                }
            })
        }
    }
    
    
    const hi = async () => {
        const token = await AsyncStorage.getItem("token");
        console.log(token)
    }
    const hu = async () => {
        await AsyncStorage.removeItem("token");
        
    }
    /* hi() */
    
    const dltFamily2 = async () => {
        await AsyncStorage.removeItem("familyCode")
        const a = await AsyncStorage.getItem("familyCode")
        console.log(a)
    } 
    /* dltFamily2()
    logUserOut();
    userInConnect(); */
    
        
    return (
        <DismissKeyboard>
            <View style={{flex:1}}>
            {loaded && <KeyboardAvoidingView /*키보드 떴을 때 가리는 걸 막기 위함임.*/
                style={{
                    flex: 1,
                    backgroundColor: "white",
                    justifyContent: "center",
                    alignItems: "center"
                    /*박스 속성 땜시 안해주면 쭈그러듬*/
                }}
                behavior="height"
                keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0} /*기종이 먼지에 따라서도 코드 짜는 게 가능*/
            >
                <Container>
                    <Image source={require("../../assets/icon.png")} style={{ width: width * 0.5, height: width * 0.5, marginBottom: 20 }} resizeMode='cover' />
                    {/* <Text>안녕하세요. 가족의 9시 입니다.</Text>
                    <Text>기존, 또는 새롭게 사용하실</Text><Text>유저네임(=닉네임)을 입력해주세요.</Text> */}
                    
                    <ChoiceBox>
                        <Choice
                            onPress={setFirst}
                            testID='처음입니다'
                            style={{
                                width: width * 0.3,
                                height: height * 0.04,
                                backgroundColor: isFirst ? "skyblue" : "white",
                                borderBottomColor: "skyblue",
                                borderBottomWidth: 1,
                                borderTopColor: "skyblue",
                                borderTopWidth: 1
                            }}>
                            <Text style={{ fontWeight: "600", fontFamily: galaxy ? null : "font" }}>처음입니다</Text>
                        </Choice>
                        <Choice
                            onPress={setNoFirst}
                            testID='이미 아이디가 있습니다'
                            style={{
                                width: width * 0.3,
                                height: height * 0.04,
                                backgroundColor: !isFirst ? "skyblue" : "white",
                                borderBottomColor: "skyblue",
                                borderBottomWidth: 1,
                                borderTopColor: "skyblue",
                                borderTopWidth: 1
                            }}>
                            <Text style={{ fontWeight: "600", fontFamily: galaxy ? null : "font" }}>처음이 아닙니다</Text>
                        </Choice>
                    </ChoiceBox>
                    {isFirst ?
                        <ExplainBox>
                            <Text style={{ fontWeight: "600", fontFamily: galaxy ? null : "font" }}>
                                가족에게 보여줄 닉네임과
                            </Text>
                            <Text style={{ fontWeight: "600", fontFamily: galaxy ? null : "font" }}>
                                개인 비밀번호를 작성해주세요.
                            </Text>
                        </ExplainBox> : null}
                    
                    {isFirst ? <InputBox>
                        <TextInput
                            placeholder='새로운 아이디을 입력해주세요.'
                            selectionColor="gray"
                            textContentType='name'
                            style={{ width: width * 0.8, backgroundColor: "white", marginBottom: 20, textAlign: "left", padding: 15, borderBottomColor: "skyblue", borderBottomWidth: 2 }}
                            value={watch("userId")}
                            onChangeText={(text) => setValue("userId", text)}
                        />
                        <TextInput
                            placeholder='새로운 닉네임을 입력해주세요.'
                            selectionColor="gray"
                            style={{ width: width * 0.8, backgroundColor: "white", marginBottom: 20, textAlign: "left", padding: 15, borderBottomColor: "skyblue", borderBottomWidth: 2 }}
                            value={watch("username")}
                            onChangeText={(text) => setValue("username", text)}
                        />
                        {/* <TouchableOpacity
                                onPress={onCheck}
                                style={{ backgroundColor: "skyblue", padding: 12, marginBottom: 10, marginLeft: 5, borderRadius: 5 }}>
                                <Text style={{color:"white"}}>중복확인</Text>
                        </TouchableOpacity> */}
                        <TextInput
                            placeholder='비밀번호를 입력해주세요.'
                            textContentType='password'
                            selectionColor="gray"
                            style={{ width: width * 0.8, backgroundColor: "white", marginBottom: 20, textAlign: "left", padding: 15, borderBottomColor: "skyblue", borderBottomWidth: 2 }}
                            value={watch("password")}
                            onChangeText={(text) => setValue("password", text)}
                            secureTextEntry={true}
                        />
                        <SubmitBtn
                            style={{
                                width: width * 0.3,
                                height: height * 0.05,
                            }}
                            onPress={handleSubmit(onValid)}
                        >
                            <Text style={{ color: "white", fontWeight: "600", fontFamily: galaxy ? null : "font" }}>만들기</Text>
                        </SubmitBtn>
                    </InputBox>
                        
                        :
                        <InputBox>
                            <TextInput
                                placeholder='기존 아이디를 입력해주세요.'
                                selectionColor="gray"
                                style={{ width: width * 0.8, backgroundColor: "white", marginBottom: 20, textAlign: "left", padding: 15, borderBottomColor: "skyblue", borderBottomWidth: 2 }}
                                value={watch("userId")}
                                onChangeText={(text) => setValue("userId", text)}
                            />
                            <TextInput
                                placeholder='비밀번호를 입력해주세요.'
                                selectionColor="gray"
                                style={{ width: width * 0.8, backgroundColor: "white", marginBottom: 20, textAlign: "left", padding: 15, borderBottomColor: "skyblue", borderBottomWidth: 2 }}
                                value={watch("password")}
                                onChangeText={(text) => setValue("password", text)}
                            />
                            <SubmitBtn
                                style={{
                                    width: width * 0.3,
                                    height: height * 0.05,
                                }}
                                onPress={handleSubmit(onValid2)}
                            >
                                <Text style={{ color: "white", fontWeight: "600" }}>로그인</Text>
                            </SubmitBtn>
                        </InputBox>}
                    
                    
                
                </Container>
            </KeyboardAvoidingView>}
            </View>
        </DismissKeyboard>
    )
}