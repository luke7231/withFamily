import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import StackNavFactory from './StackNavFactory';
import {Ionicons} from '@expo/vector-icons'
import { useFonts } from 'expo-font';
import { Platform } from 'react-native';

const Tab = createBottomTabNavigator()

export default function TabNav() {
    const [loaded] = useFonts({
        font: require("../assets/Noto_Serif_KR/NotoSerifKR-Light.otf")
    })
    const galaxy = Platform.OS == 'android';
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarLabelStyle: { color: "skyblue", fontSize: 12, fontFamily: loaded? galaxy? null : 'font' : null }
        }}>
            <Tab.Screen name='홈' options={{
                tabBarIcon: ({ focused, color, size }) => <Ionicons color={"skyblue"} name='md-home-outline' size={size} />,
                
            }}>
                {() => <StackNavFactory screenName={"Main"} />}
            </Tab.Screen>
            <Tab.Screen name='질문함' options={{
                tabBarIcon: ({ focused, color, size }) => <Ionicons color={"skyblue"} name='md-list-outline' size={size} />,
            }}>
                {() => <StackNavFactory screenName={"Question"} />}
            </Tab.Screen>
            <Tab.Screen name='가족약속' options={{
                tabBarIcon: ({ focused, color, size }) => <Ionicons color={"skyblue"} name='copy-outline' size={size} />,
                
            }}>
                {() => <StackNavFactory screenName={"Schedule"} />}
            </Tab.Screen>
            {/* 정보란 */}
            <Tab.Screen name='기타' options={{
                tabBarIcon: ({ focused, color, size }) => <Ionicons color={"skyblue"} name='ellipsis-horizontal' size={size} />,
                
            }}>
                {() => <StackNavFactory screenName={"Plus"} />}
            </Tab.Screen>
        </Tab.Navigator>
    )
    
}