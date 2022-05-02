import { gql, makeVar, useMutation, useReactiveVar } from '@apollo/client';
import { useState } from 'react';
import { Button, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { fixedHoursVar, fixedMinutesVar } from '../apollo';
import scheduleNoti from '../helper/scheduleNoti';
import { everyBodyAnsweredVar, showReadyVar } from '../Nav/LoggedInNav';
import { galaxy } from '../Screen/LogInSc/Main';
import { EVERYBODY_ANSWERED, SEE_QUESTION_LIST, TIME_EXIST } from '../Screen/LogInSc/Question';
import { setDayAtFirst } from './dayChanger';


export const SET_DAY_AT_FIRST = gql`
    mutation setDayAtFirst($hours:Int,$minutes:Int,$day1:String!,$day2:String!,$day3:String!){
        setDayAtFirst(
            hours:$hours,
            minutes:$minutes,
            day1:$day1,
            day2:$day2,
            day3:$day3
            )
            {
            ok
        }
    }
`


export default function TimePicker() {
    const {width,height} = useWindowDimensions()
    
    const [setDayMutation, { loading }] = useMutation(SET_DAY_AT_FIRST, {
        onCompleted: ({setDayAtFirst:{ok,hours,minutes}}) => {
            
        }
        , refetchQueries: [{ query: SEE_QUESTION_LIST, }, { query: EVERYBODY_ANSWERED }, { query: TIME_EXIST }]
    });

    
    const fixedHours = useReactiveVar(fixedHoursVar);
    const fixedMinutes = useReactiveVar(fixedMinutesVar);
    
    
    const [timePickerVisibility, setTimePickerVisibility] = useState(false);
    const showTimepicker = () => {
        setTimePickerVisibility(true)
    }
    const hideDatePicker = () => {
        setTimePickerVisibility(false);
    };


    const handleConfirm = (date) => {
        fixedHoursVar(date.getHours())
        fixedMinutesVar(date.getMinutes());
        console.log("선택", fixedHoursVar(), fixedMinutesVar());
        hideDatePicker();
    };

    const handleSubmit = () => {

        console.log("제출할때 값",fixedHours,fixedMinutes)//잘작동
        const { day1, day2, day3 } = setDayAtFirst(fixedHours, fixedMinutes);
        console.log(day1, day2, day3, fixedHours, fixedMinutes);
        setDayMutation({
            variables: {
                hours: fixedHours,
                minutes: fixedMinutes,
                day1,
                day2,
                day3,
            }
        }) 
    }
    //모달로 안띄우기 하자 .
    return (
        <View style={{ width, justifyContent: "center", alignItems: "center" }}>
            <View style={{marginTop:20,width, height: height *0.25, backgroundColor:"white",alignItems:"center",justifyContent:"center",borderWidth:1,borderColor:"skyblue"}}>
                <Text style={{fontFamily: galaxy ? null : 'font'}}>
                    가족 질문을 받을 시간을 선택하셔야합니다.
                </Text>
                <Text style={{fontFamily: galaxy ? null : 'font'}}>
                    가족분들과 상의 후 <Text style={{fontSize:20,fontWeight:"600",color:"skyblue"}}>시간을 정해주시고</Text>,
                </Text>
                <Text style={{fontFamily: galaxy ? null : 'font'}}>
                    <Text style={{fontSize:20,fontWeight:"600",color:"skyblue"}}>제출 버튼</Text>을 눌러주세요!!
                </Text>
                {fixedHours || fixedMinutes ? <Text style={{ fontFamily: galaxy ? null : 'font',marginTop:20 }}>{fixedHours + "시" + fixedMinutes + "분"}</Text> : null}
            </View>
            <View style={{marginTop:20,alignItems:"center"}}>
                <TouchableOpacity onPress={showTimepicker} style={{ backgroundColor: "skyblue", margin: 10, borderRadius: 7, width: width *0.8,alignItems:"center",padding:10  }}>
                    <Text style={{fontFamily: galaxy ? null : 'font'}}>
                        질문 받을 시간 선택하기
                    </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={timePickerVisibility}
                    mode ='time'
                    textColor='black'
                    is24Hour={true}
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
                
                <TouchableOpacity
                    disabled={!fixedHours && !fixedMinutes}
                    onPress={handleSubmit} style={{ backgroundColor: !fixedHours || !fixedMinutes ? "darkgray" : "skyblue", margin: 10, borderRadius: 7, width: width * 0.8, alignItems: "center", padding: 10 }}>
                    <Text style={{fontFamily: galaxy ? null : 'font'}}>
                        이 시간으로 하겠습니다!
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}