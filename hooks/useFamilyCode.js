import React from 'react';
import { gql, useQuery, useReactiveVar } from '@apollo/client';
import { isLoggedInVar } from '../apollo';

const SEE_FAMILYCODE = gql`
    query seeFamilyCode{
        seeFamilyCode{
            id
            photos{
                file
            }
        }
    }
`

export default function useFamilyCode() {
    const hasToken = useReactiveVar(isLoggedInVar);
    
    const { data } = useQuery(SEE_FAMILYCODE, {
        skip: !hasToken,
    })
    const file = data?.seeFamilyCode.photos[1].file
    return file;
}