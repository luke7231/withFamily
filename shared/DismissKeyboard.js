import React from 'react';
import { Keyboard, Platform, TouchableWithoutFeedback } from 'react-native';

export default function DismissKeyboard({children}) {
    const dmKeyboard = () => {
        Keyboard.dismiss()
    }
    return (
        <TouchableWithoutFeedback
            style={{flex:1,}}
            onPress={dmKeyboard}
            disabled={Platform.OS==="web"}
        >
            {children}
        </TouchableWithoutFeedback>
    )
}