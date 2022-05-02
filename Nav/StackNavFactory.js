import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Question from '../Screen/LogInSc/Question';
import Main from '../Screen/LogInSc/Main';
import QnA from '../Screen/LogInSc/QnA';
import Schedule from '../Screen/LogInSc/Schedule';
import MakePromise from '../Screen/LogInSc/MakePromise';
import {Ionicons} from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
import Answering from '../Screen/LogInSc/Answering';
import SeeAnswering from '../Screen/LogInSc/SeeAnswering';
import UploadScreen from '../Screen/LogInSc/UploadScreen';
import UpdateAnswer from '../Screen/LogInSc/UpdateAnswer';
import { useFonts } from 'expo-font';
import { Image, Platform, TouchableOpacity } from 'react-native';
import Privacy from '../Screen/LogInSc/Privacy';
const Stack = createNativeStackNavigator();

export default function StackNavFactory({ screenName }) {
    const navigation = useNavigation();
    const [loaded] = useFonts({
        font: require("../assets/Noto_Serif_KR/NotoSerifKR-Light.otf")
    })
    const galaxy = Platform.OS == 'android';
    
        return (
            <Stack.Navigator screenOptions={{
                headerTitleStyle: { fontFamily: loaded ? galaxy ? null : 'font' : null, color: "skyblue" },
                headerTintColor: "skyblue",
                headerBackTitleVisible: false,
                headerTitleAlign: "center",
            }}>
                {screenName === "Question" ? (
                    <Stack.Screen name="가족 질문함" component={Question} options={{
                        headerTitleStyle: { color: "skyblue", fontFamily: loaded ? galaxy ? null : 'font' : null, },
                    }}/>
                ) : null}
                {screenName === "Main" ? (
                    <Stack.Screen name="Main" component={Main} options={{
                        headerTitleStyle: { color: "black", fontFamily: loaded ? galaxy ? null : 'font' : null, },
                        
                    }} />
                ) : null}
                {screenName === "Schedule" ? (
                    <Stack.Screen name="Schedule" component={Schedule} />
                ) : null}
                {screenName === "Plus" ? (
                    <Stack.Screen name="기타정보란" component={Privacy} />
                ) : null}
                <Stack.Screen name="QnA" component={QnA} options={{
                    headerTitle: "질문",
                    headerTitleStyle: { color: "skyblue", fontFamily: loaded ? galaxy ? null : 'font' : null, },
                    headerBackTitleVisible: false,
                }} />
                
                
                <Stack.Screen name="질문달기" component={Answering} />
                <Stack.Screen name="질문변경" component={UpdateAnswer} />
                <Stack.Screen name="질문보기" component={SeeAnswering} />
                <Stack.Screen name="MakePromise" component={MakePromise} />
                <Stack.Screen name='UploadFile' component={UploadScreen} />
            
            </Stack.Navigator>
        );
     
    
    
}