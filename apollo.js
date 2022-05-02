import { ApolloClient, createHttpLink, InMemoryCache, makeVar } from '@apollo/client';
import { setContext } from '@apollo/client/link/context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { onError } from '@apollo/client/link/error';
import { createUploadLink } from 'apollo-upload-client';



export const isConnectedVar = makeVar(false);
export const isLoggedInVar = makeVar(false)
export const tokenVar = makeVar("");


export const fixedHoursVar = makeVar("")
export const fixedMinutesVar = makeVar("")
export const logUserIn = async (token) => {
    await AsyncStorage.setItem('token', token);
    isLoggedInVar(true);
    tokenVar(token);
}
export const logUserOut = async () => {
    await AsyncStorage.removeItem('token');
    isLoggedInVar(false);
}

export const userConnect = async (familyCode) => {
    await AsyncStorage.setItem('familyCode',familyCode);
    isConnectedVar(true);
}
export const userInConnect = async () => {
    await AsyncStorage.removeItem('familCode')
    isConnectedVar(false);
}
const uploadHttpLink = createUploadLink({
    uri: "https://a165-118-34-232-180.ngrok.io/graphql"
})

const onErrorLink = onError(({graphQLErrors, networkError}) => {
    if (graphQLErrors) {
        console.log('GraphQl Error', graphQLErrors);
    }
    if (networkError) {
        console.log('Network Error', networkError);
    }
})
const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            token: tokenVar()
        }
    }
})

const httpLink = createHttpLink({
    uri: "https://7700-118-34-232-180.ngrok.io/graphql"
})
export const cache = new InMemoryCache();
const client = new ApolloClient({
    cache,
    link: authLink.concat(onErrorLink).concat(uploadHttpLink)
})

export default client;
