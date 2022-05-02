import { gql, useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { FlatList, Image, Text, TouchableOpacity, useWindowDimensions, View, ActivityIndicator, ImageBackground } from 'react-native';
import React,{useState} from 'react'
import { useEffect } from 'react/cjs/react.development';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font'
import { galaxy } from './Main';

export const SEE_PROMISE_FEED = gql`
    query seePromiseFeed {
        seePromiseFeed{
            id
            title
            payload
            file
            date
            participants
            elapsed
        }
    }
`
const SEE_FAMILY = gql`
    query seeFamily{
        seeFamily{
            id
            username
            avatar
            pushToken
        }
    }
`
const ContainerOfCard = styled.View`
    overflow: hidden;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    background-color: white;
    border-radius: 7px;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 5px;
    margin-right: 5px;
    
`
const MakeButton = styled.TouchableOpacity`
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 15px;
    padding-right: 15px;
    background-color: skyblue;
    border-radius: 3px;
`
    
export default function Schedule() {
    const [loaded] = useFonts({
        font: require("../../assets/Noto_Serif_KR/NotoSerifKR-Light.otf")
    })
    const navigation = useNavigation()
    const { width, height } = useWindowDimensions();
    const CARDWIDTH = width * 0.86;
    const CARDHEIGHT = height * 0.2;
    const { data, loading } = useQuery(SEE_PROMISE_FEED)
    const { photo, setPhoto } = useState("");
    const { data: familyData, loading: loading2 } = useQuery(SEE_FAMILY)
    if (!loading && !loading2) {
        console.log("--Fetch completed--")
    }
    
    const handleNavigate = () => {
        navigation.navigate("MakePromise", {
            family: familyData
        })
    }
    const GoCreate = () => <MakeButton onPress={handleNavigate}>
        <Text style={{ fontSize: 20, color: "white" }}>+</Text>
    </MakeButton>
    
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => loading2 ? <ActivityIndicator size={"small"} color="black" /> : <GoCreate />
        })
    }, [loading2])
    
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width, height, backgroundColor: "white" }}>
            {loaded && <ImageBackground resizeMode='cover' source={require("../../assets/배경.png")} style={{ flex:1,width, height, justifyContent: "center", alignItems: "center" }}>
            <View>
            <FlatList
                style={{
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 0.3,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 5,
                    marginTop:10
                }}
                showsVerticalScrollIndicator={false}
                data={data?.seePromiseFeed}
                renderItem={({ item }) => {
                    
                    const YEAR = new Date(Number(item.date)).getFullYear();
                    const MONTH = new Date(Number(item.date)).getMonth() + 1;
                    const DAY = new Date(Number(item.date)).getDate();
                    return <View>
                            
                        <View style={{maxWidth: width*0.3 ,height: height * 0.035, backgroundColor: "skyblue",justifyContent:"center",alignItems:"center" }}>
                            <Text style={{fontFamily: galaxy ? null : 'font',color:"white"}}>{item.title}</Text>
                        </View>
                        <ContainerOfCard style={{
                            width: width * 0.87,
                            height: height * 0.2,
                            elevation: 2.1,
                        }}>
                            <View testID='약속 정보 및 날짜 박스'
                                style={{
                                    width: CARDWIDTH * 0.25,
                                    height: "100%",
                                    backgroundColor: "white",
                                
                                    borderRightWidth: 0.5,
                                    borderRightColor: "gray",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Text style={{ fontSize: 20, fontWeight: "600", color: "gray", fontFamily: galaxy ? null : 'font' }}>
                                    {YEAR}
                                </Text>
                                <Text style={{ fontSize: 20, fontWeight: "600", color: "gray", fontFamily: galaxy ? null : 'font' }}>
                                    {MONTH < 10 ? "0" + MONTH + "월" : MONTH + "월"}
                                </Text>
                                <Text style={{ fontSize: 20, fontWeight: "600", color: "gray", fontFamily: galaxy ? null : 'font' }}>
                                    {DAY < 10 ? "0" + DAY + "일" : DAY + "일"}
                                </Text>

                            </View>
                            <View testID='우측사진 박스'
                                style={{
                                    width: CARDWIDTH * 0.75,
                                    height: CARDHEIGHT,
                                    justifyContent: "center",
                                    alignItems: "flex-start",
                                    padding: item.file ? 0 : 20,
                                
                                }}
                            >
                                <View>
                                    <View>
                                        {!item.file ? <Text style={{ fontSize: 20, fontWeight: "600", color: "gray", marginVertical: 3, fontFamily: galaxy ? null : 'font' }}>
                                            " {item.title} "
                                        </Text> : null}
                                        {!item.file ? <Text style={{ fontSize: 15, fontWeight: "500", color: "darkgray", marginVertical: 3, fontFamily: galaxy ? null : 'font' }}>
                                            {item.payload}
                                        </Text> : null}
                                        {item.file ? loading ? <ActivityIndicator size={"large"} color={"skyblue"} /> : <Image resizeMode='cover' source={{ uri: item?.file }} style={{ height: CARDHEIGHT, width: CARDWIDTH * 0.76 }} /> : null}
                                    </View>
                                    {/* <View style={{flexDirection:"row",justifyContent:"center",justifyContent:"center"}}>
                                    <Ionicons name='people' size={25} color={"skyblue"} style={{margin:5}}/>
                                    <Text style={{color:"skyblue"}}>{item.participants.length}</Text>
                                    
                                </View> */}
                                </View>


                                {item.elapsed && !item.file ? <TouchableOpacity onPress={() => navigation.navigate("UploadFile", { id: item.id })} style={{ marginTop: 10, borderRadius: 6, width: 100, height: 30, backgroundColor: "skyblue", justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: "white", fontFamily: galaxy ? null : 'font' }}>사진 올리기</Text>
                                </TouchableOpacity> : null}
                            
                            </View>
                        </ContainerOfCard>
                    </View>
                }}
            />
            <TouchableOpacity
                onPress={handleNavigate}
                style={{
                    width: CARDWIDTH, height: CARDHEIGHT * 0.3,
                    backgroundColor: "skyblue", borderRadius: 7,
                    justifyContent: "center", alignItems: "center",
                    marginBottom: 5,
                

                }}>
                {loading2 ?
                    <ActivityIndicator size={"small"} color="skyblue" />
                    :
                    <Text style={{ color: "white", fontFamily: galaxy ? null : 'font' }}>새로운 약속을 잡아보세요 ! (만들기)</Text>
                }
                
                </TouchableOpacity>
            
            </View>
            </ImageBackground>}
            
        </View>
    )
}