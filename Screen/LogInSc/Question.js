import { gql, useLazyQuery, useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Button, FlatList, ImageBackground, Platform, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';



import TimePicker from '../../shared/TimePicker';
import { useFonts } from 'expo-font';
import { galaxy } from './Main';
import MyTimer from '../../shared/MyTimer';
import scheduleNoti from '../../helper/scheduleNoti';


const ME_QUERY = gql`
    query Me {
        Me {
            id
        }
    }
`; 

export const TIME_EXIST = gql`
    query checkTimeExist{
        checkTimeExist
    }
`

export const EVERYBODY_ANSWERED = gql`
    query everyBodyAnswered{
        everyBodyAnswered{
            ok
            error
        }
    }

`
const REQUEST_QUESTION_MUTATION = gql`
    mutation requestQuetion {
        requestQuetion {
            payload
        }
    }
`
export const SEE_QUESTION_LIST = gql`
    query seeQuestionList {
        seeQuestionList{
            elapsed
            changeDay3
            questions{
                id
                payload
                answers{
                    id
                    payload
                    file
                    user {
                        id
                        avatar
                        username
                    }
                    
                }
                familyCode{
                    users{
                        id
                        username
                        avatar
                    }
                    day1
                    hours
                    minutes
                }
            }
            
        }
    }
`
const PULL_THE_DAY = gql`
    mutation pullTheDay{
        pullTheDay{
            ok
            error
        }
    }
`
export const SEE_FAMILY_CODE = gql`
    query seeFamilyCode {
        seeFamilyCode {
            code
            hours
            minutes
        }
    }
`
export default function Question() {
    const [loaded] = useFonts({
        font: require("../../assets/Noto_Serif_KR/NotoSerifKR-Light.otf")
    })
    const navigation = useNavigation();
    const { width, height } = useWindowDimensions();
    const BANNERWIDTH = width * 0.9;
    const BUTTONHEIGTH = height * 0.1;
    const [timePickerShowing, setTimePickerShowing] = useState(false);
    const [elapsed, setElapsed] = useState(false);
    const [everyBodyAnswered, setEveryBodyAnswered] = useState(false);
    const [day1, setDay1] = useState(new Date());
    //(쿼리)시간을 정해놨는지, 가족에게 시간이 존재하는지, -> TimePicker 보여주는 용도
    const { data: timeExist, loading: timeExistLoading } = useQuery(TIME_EXIST);
    useEffect(() => {
        //체크 완료--
        if (!timeExistLoading) {
            const exist = timeExist.checkTimeExist
            if (!exist) {
                setTimePickerShowing(true);
            } else{
                setTimePickerShowing(false);
            }
            
        }

    }, [timeExist]);
    const { data: hourAndMinuteData, loading: hourAndMinuteLoading } = useQuery(SEE_FAMILY_CODE);
    /* useEffect(() => {
        if (!hourAndMinutLoading&&!timeExistLoading) {
            const exist = timeExist.checkTimeExist
            if (exist) {
                scheduleNoti(hourAndMinutData.seeFamilyCode.hours, hourAndMinutData.seeFamilyCode.minutes);
            }
            
        }
    },[hourAndMinutData,timeExist]) */
    //(쿼리)모두 답변 완료했는지 확인하는
    const { data: everyBodyAnsweredData, loading: everyBodyAnswerdLoading } = useQuery(EVERYBODY_ANSWERED);
    useEffect(() => {
        if (!everyBodyAnswerdLoading) {
            
            const { everyBodyAnswered: { ok } } = everyBodyAnsweredData;
            
            if (ok) {
                setEveryBodyAnswered(true)
            }
        }
        
    }, [everyBodyAnsweredData])
    
    //(쿼리) 내정보
    const { data: me } = useQuery(ME_QUERY);
    const [A, setA] = useState("");
    useEffect(() => {
        setA(me)
    }, [me])
    
    //(쿼리)질문 리스트 갖고 오는
    const { data: questionData, loading: questionDataLoading } = useQuery(SEE_QUESTION_LIST);
    let newday;
    useEffect(() => {
        if (!questionDataLoading) {
            const ok = questionData.seeQuestionList.elapsed;
            
            if (ok) {
                setElapsed(true);
            }
            
        }
        //타이머에 놔줄 시간 세팅
        if (questionData?.seeQuestionList.questions[0]) {
            newday = new Date(Number(questionData.seeQuestionList.questions[0].familyCode.day1))
            setDay1(newday);
        }
    }, [questionData])
    //뮤테이션//
    const [pullTheDay, { loading: pullTheDayLoading }] = useMutation(PULL_THE_DAY, {
        onCompleted: async (data) => {
            setEveryBodyAnswered(false);
            setElapsed(false);
            
        },
        refetchQueries: [{ query: SEE_QUESTION_LIST, }],
    })
    const [requestQuestionMutation, { data, loading }] = useMutation(REQUEST_QUESTION_MUTATION, {
        onCompleted: (data) => {
            pullTheDay()
        }
    })
    const onPress = () => {
        requestQuestionMutation();
        
    }
    
    
    return <View style={{ flex: 1, width, height: height, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
        {loaded && <ImageBackground blurRadius={0.5} source={require("../../assets/배경.png")} resizeMode='cover' style={{ flex: 1, height, width, zIndex: -1, justifyContent: "center", alignItems: "center" }}>
            {timePickerShowing && <TimePicker />}
                

            <FlatList
                style={{
                    /* shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 0.3,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 5,
                    zIndex: 1, */
                    marginTop: 20,
                    width: width,
                }}
                data={questionData?.seeQuestionList.questions}
                keyExtractor={(question) => question.id}
                renderItem={({ item, index }) => {
                    let wholeLength = questionData?.seeQuestionList.questions.length
                    let realIndex = wholeLength - index
                    let num_Answer = item.answers.length
                    let num_Family = item.familyCode.users.length
                    let thisQuestionAllAnswered = num_Answer >= num_Family;
                    
                    return <TouchableOpacity
                        style={{
                            width: "100%",
                            height: 50,
                            backgroundColor: "white",
                            justifyContent: "center",
                            alignItems: "center",
                            marginVertical: 4,
                            borderWidth: 1,
                            borderColor:"skyblue"
                        }}
                        onPress={() => navigation.navigate("QnA", {
                            id: item.id,
                            index,
                            payload: item?.payload,
                            answers: item?.answers,
                            file: item?.file,
                            family: item?.familyCode.users,
                            me: A,
                        })}
                    >
                    
                        <Text style={{ fontWeight: thisQuestionAllAnswered ? "500": "400", fontFamily: galaxy ? null : 'font', color: thisQuestionAllAnswered ? "black" : "gray" }}>
                            {realIndex}. {item?.payload}
                        </Text>
                    </TouchableOpacity>
                }
                }
            />
            {!timePickerShowing && (elapsed || everyBodyAnswered) ?
                <TouchableOpacity
                    onPress={onPress}
                    disabled={!elapsed || !everyBodyAnswered}
                    style={{
                        width: BANNERWIDTH, height: BUTTONHEIGTH,
                        backgroundColor: "white", borderRadius: 7,
                        justifyContent: "center", alignItems: "center",
                        marginBottom: 5, borderColor: "gray", borderWidth: 1
                    }}>
                    
                    {elapsed && everyBodyAnswered ? <Text style={{ color: "skyblue", fontSize: 16, fontFamily: galaxy ? null : 'font', }}>새로운 질문이 도착했습니다.(받기)</Text> : null}
                    {!elapsed && everyBodyAnswered ? <MyTimer expiryTimestamp={day1}/> : null}
                    {elapsed && !everyBodyAnswered ? <Text style={{ color: "skyblue", fontSize: 16, fontFamily: galaxy ? null : 'font' }}>답변이 다 달리지 않았어요!</Text> : null}
                
                </TouchableOpacity>
                :
                null
            }
                
        </ImageBackground>}
                
    </View>

}