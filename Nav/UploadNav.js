import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import {Ionicons} from '@expo/vector-icons'
import SelectPhoto from '../Screen/LogInSc/SelectPhoto';
import TakePhoto from '../Screen/LogInSc/TakePhoto';
import { TouchableOpacity } from 'react-native';

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();
export default function UploadNav() {
    return <Tab.Navigator
        tabBarPosition='bottom'
        screenOptions={{
            tabBarIndicatorStyle: {
                backgroundColor:"skyblue"
            }
        }}
    >
        <Tab.Screen name='Select_Tab'>
            {() => <Stack.Navigator screenOptions={{ headerShown: true, }}>
                <Stack.Screen name='사진선택'component={SelectPhoto}/>
            </Stack.Navigator>}
        </Tab.Screen>
        <Tab.Screen name='Take' component={TakePhoto}/>
    </Tab.Navigator>
}