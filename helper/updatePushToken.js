import AsyncStorage from '@react-native-async-storage/async-storage'

export const updatePushToken = async (token) => {
    const query = JSON.stringify({
        query: `
            mutation {
                updatePushToken(pushToken: "${token}") {
                    pushToken
                }
            }
    `,
    });

    try {
        const response = await fetch("https://a165-118-34-232-180.ngrok.io/graphql" , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token: await AsyncStorage.getItem("token")
            },
            body: query,
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('err', error);
    }
};