import { useReactiveVar } from '@apollo/client';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { isConnectedVar } from '../apollo';
import UploadForm from '../Screen/LogInSc/UploadForm';
import FamilyCode from '../Screen/LogOutSc/FamilyCode';
import TabNav from './TabNav';
import {useFonts} from 'expo-font'


const Stack = createNativeStackNavigator();


export default function LoggedInNav() {
    const isConnected = useReactiveVar(isConnectedVar);
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
            
        }} >
            {!isConnected? <Stack.Screen name='familyCode' component={FamilyCode} />: null}
            {isConnected ? <Stack.Screen name='tabNav'>{() => <TabNav />}</Stack.Screen> : null}
            <Stack.Screen options={{presentation:'fullScreenModal',}} name='uploadForm' component={UploadForm} />
        </Stack.Navigator>
    )
}