import React, {FC} from "react";
import {useGetResourceApi} from "../queries/resourceApi";

export const RestFetchPage: FC = () => {

    // In this case, the `resourceApi.data.data.user` will not be expanded as required by params.

    // Ex, I will have typescript error if I do {resourceApi.data?.data.user.id}
    // because the lines src/queries/index.ts:73 and src/queries/index.ts:74 are commented.

    // The UseQueryOptions at src/queries/index.ts:76, return the object directly and 'user' is CanBeExpanded Interface.

    const resourceApi = useGetResourceApi('1', {params: {expands: ['user']}}, {enabled: false})

    return (
        <>This Component is here only to demonstrate the utility of Expand.<br/>
            The user Id is: {
                {
                    /* Typescript will complain about the .id on user:

                    resourceApi.data?.data.user.id

                    */
                }}

            {/* If the fetch was executed, this will show the object expanded from backend. */}
            {JSON.stringify(resourceApi.data?.data.user)}

        </>
    )
}
