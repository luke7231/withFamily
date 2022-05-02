import { gql, useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect } from 'react';

import { checkOverElapsed } from './checkFunc';


/* export const pullTheDay = async () => {
    console.log("Mutation Clear!!★")
    
    const SecondDay2 = ""
    const ThirdDay3 = ""

    /* await AsyncStorage.removeItem("day1");
    await AsyncStorage.setItem("day1", SecondDay2);

    await AsyncStorage.removeItem("day2");
    await AsyncStorage.setItem("day2", ThirdDay3); */
    
    /* const newDay3 = new Date(ThirdDay3);
    newDay3.setDate(newDay3.getDate() + 1);
    newDay3.setHours(newDay3.getHours());
    newDay3.setMinutes(newDay3.getMinutes()); */
    //await AsyncStorage.setItem("day3", newDay3.toString());

    //const dayAsync = await AsyncStorage.multiGet(["day1", "day2", "day3"])
    //} */

export const setDayAtFirst = (hours, minutes) => {
    //await AsyncStorage.setItem("hours", String(hours));
    //await AsyncStorage.setItem("minutes", String(minutes));
    
    let day1 = new Date()
    day1.setDate(day1.getDate());
    day1.setHours(hours)
    day1.setMinutes(minutes);
    //await AsyncStorage.setItem("day1", day1.toString())
    
    
    let day2 = new Date()
    day2.setDate(day1.getDate() + 1)
    day2.setHours(day1.getHours())
    day2.setMinutes(day1.getMinutes());
    //await AsyncStorage.setItem("day2", day2.toString())
    
    let day3 = new Date()
    day3.setDate(day1.getDate() + 2)
    day3.setHours(day1.getHours())
    day3.setMinutes(day1.getMinutes());
    //await AsyncStorage.setItem("day3", day3.toString())
    
    return {
        day1: day1.toISOString(),
        day2: day2.toISOString(),
        day3: day3.toISOString(),
    }
    //const dayAsync = await AsyncStorage.multiGet(["day1", "day2", "day3"])
    
};
export const changeDay3 = async () => {
    const hours = await AsyncStorage.getItem("hours");
    const minutes = await AsyncStorage.getItem("minutes");
    
    //지금시간**
    const now = new Date();
    now.setDate(now.getDate() + 1);
    now.setHours(Number(hours));
    now.setMinutes(Number(minutes));
    
    await AsyncStorage.removeItem("day3");
    await AsyncStorage.setItem("day3", now.toString())
    

    //const dayAsync = await AsyncStorage.multiGet(["day1", "day2", "day3"])
    //console.log(dayAsync);
};