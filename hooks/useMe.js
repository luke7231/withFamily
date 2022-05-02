import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { isLoggedInVar, logUserOut } from "../apollo";

export const ME_QUERY = gql`
    query Me {
        Me {
            id
            username
        }
    }
`;

    export default function useMe() {
    const hasToken = useReactiveVar(isLoggedInVar);
    const { data } = useQuery(ME_QUERY, {
        skip: !hasToken,
    });
    useEffect(() => {
        if (data?.me === null) {
        logUserOut();
        }
    }, [data]);
        console.log(data)
    return { data };
    }