import React from 'react';
import { Text, TouchableOpacity, useWindowDimensions } from 'react-native';

export default function CustomButton(text) {
    const { width, height } = useWindowDimensions();
    const CARDWIDTH = width * 0.86;
    const CARDHEIGHT = height * 0.2;
    
    return <TouchableOpacity style={{
                width: CARDWIDTH, height: CARDHEIGHT * 0.3,
                backgroundColor: "white", borderRadius: 7,
                justifyContent: "center", alignItems: "center",
                marginBottom: 5, borderColor: "gray", borderWidth:1
        }}>
            
            <Text style={{ color: "skyblue" }}>{text}</Text>

        </TouchableOpacity>
    
}