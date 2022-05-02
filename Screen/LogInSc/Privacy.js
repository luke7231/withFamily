import { gql, useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { Image, Linking, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import styled from 'styled-components/native'
import { logUserOut, userInConnect } from '../../apollo'
import * as MailComposer from 'expo-mail-composer';


const SEE_FAMILY_CODE = gql`
    query seeFamilyCode {
        seeFamilyCode {
            code
            hours
            minutes
        }
    }
`
const ME_QUERY = gql`
    query Me {
        Me {
            id
            userId
        
        }
    }
`;


const Container = styled.View`
    
    justify-content: center;
    align-items: center;
    background-color: white;
`
const BackgroundBox = styled.View`
    background-color: white;
    position: absolute;
`
const FamilyCodeBox = styled.View`
    justify-content: center;
    align-items: center;
    background-color: skyblue;
    
`
const Box = styled.TouchableOpacity`
    justify-content: center;
    align-items: flex-start;
    padding-left: 10px;
    margin-top: 5px;
    background-color: white;
    border-radius: 7px;
`
const PrivacyBox = styled(Box)`
    
`
const ComplainBox = styled(Box)`
    
`
const LogOutBox = styled(Box)`
    
`
//패밀리 코드 쿼리
//로그아웃
//아이디
//비밀번호
//개인정보 처리약관
//문의 


export default function Privacy() {
    const { width, height } = useWindowDimensions();
    
    
    
    const { data, loading } = useQuery(SEE_FAMILY_CODE);
    useEffect(() => {
        
    }, [])
    
    const useLogOut = () => {
        logUserOut();
        userInConnect();
    }


    return (
        <Container>
            <BackgroundBox style={{width,height}}></BackgroundBox>
            <Image source={require("../../assets/icon.png")} style={{ width: width * 0.4, height: width * 0.4, marginVertical: 20 }} resizeMode='cover' />
            <FamilyCodeBox style={{ width, height: height * 0.2 }}>
                {/* 그냥쿼리치고 보여주기 */}
                <Text style={{}}>
                    우리가족 코드
                </Text>
                <Text style={{ fontSize: 30, color: "white", fontWeight: "600" }}>
                    {!loading && data.seeFamilyCode.code}
                </Text>
            </FamilyCodeBox>
            <View style={{marginTop:30}}>
                <PrivacyBox
                    style={{
                        width: width * 0.88, height: height * 0.06,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 0.3,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                    
                    }}
                    onPress={() => Linking.openURL("https://withfamily.netlify.app/privacy")}>
                    {/* 외부링크로 */}
                    <Text>개인정보 처리 방침</Text>
                </PrivacyBox>
                <ComplainBox
                    style={{
                        width: width * 0.88, height: height * 0.06,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 0.3,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                    }}
                    onPress={() => {
                        MailComposer.composeAsync({
                            recipients: ["tmddnjs7231@gmail.com"],
                            subject:"<가족끼리 건의 및 문의사항>",
                            body: `<가족끼리 건의 및 문의사항>\n패밀리 코드:${!loading && data.seeFamilyCode.code}\n건의:\n추가기능 제의:\n등 \n\n자유롭게 기재 부탁드려요 !`
                        })
                }}>
                <Text>
                    가족끼리 건의 및 문의(메일)
                </Text>
            </ComplainBox>
                
                <LogOutBox
                    onPress={()=> useLogOut()}
                    style={{
                        width: width * 0.88, height: height * 0.06,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 0.3,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                    }}
                >
                    {/* 로그아웃 진짜 할건지 alert 띄우고 확인 누르면 로그아웃! */}
                    {/* 패밀리코드도 다시 입력해서 들어오셔야 합니다. */}
                    <Text style={{color: "orange"}}>
                        로그아웃
                    </Text>
                </LogOutBox>
                
            </View>
        </Container>

    )
}