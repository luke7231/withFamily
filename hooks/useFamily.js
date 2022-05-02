import { gql, useQuery, useReactiveVar } from '@apollo/client';
import React from 'react';
import { isLoggedInVar } from '../apollo';

const SEE_FAMILY = gql`
    query seeFamily{
        seeFamily{
            id
            username
            avatar
        }
    }
`

export default function useFamily() {
    const hasToken = useReactiveVar(isLoggedInVar);
    
    const { data } = useQuery(SEE_FAMILY, {
        skip: !hasToken,
    })
    console.log(data)
    return data;
}