import React from 'react';
import { Button, Text, View } from 'react-native';
import { useTimer } from 'react-timer-hook';
import { galaxy } from '../Screen/LogInSc/Main';

export default function MyTimer({expiryTimestamp}) {
    const {
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useTimer({ expiryTimestamp, onExpire: () => console.log("Mutation Ready Completed") });
    
    
    return (
        <View style={{alignItems: 'center'}}>
            <View style={{flexDirection:'row'}}>
                <Text style={{ color: "skyblue", fontWeight: "700", fontFamily: galaxy ? null : 'font' }}>{hours}:</Text>
                <Text style={{ color: "skyblue", fontWeight: "700", fontFamily: galaxy ? null : 'font' }}>{minutes}</Text>
            </View>
        </View>
    );
}