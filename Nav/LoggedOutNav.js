import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FamilyCode from '../Screen/LogOutSc/FamilyCode';
import Username from '../Screen/LogOutSc/Username';



const Stack = createNativeStackNavigator();

export default function LoggedOutNav() {
    return (
        <Stack.Navigator>
            <Stack.Screen options={{headerShown: false}} name='Username' component={Username} />
            <Stack.Screen name="FamilyCode" component={FamilyCode} />            
        </Stack.Navigator>
    )
}