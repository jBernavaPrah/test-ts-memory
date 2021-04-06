import React, {FC} from "react";
import {useGetResourceApi} from "../queries/resourceApi";

export const RestFetchPage: FC = () => {

    // I have only uncommented the src/queries/index.ts:73 and src/queries/index.ts:74 and commented the
    // src/queries/index.ts:76.

    // As you can see, the user object on "resourceApi" is expanded by typescript and
    // there are no complains about it.

    // Before you run `yarn start`, it's show all the information fastly.

    // Running `yarn start` the console will stuck on 'Files successfully emitted, waiting for typecheck results...'
    // and the memory of the process of node, connected with `yarn start`, will start grow until
    // reached the limit imposed.
    // The the console will show
    //
    // FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory

    const resourceApi = useGetResourceApi('1', {params: {expands: ['user']}}, {enabled: false})

    return (
        <>This Component is here only to demonstrate the utility of Expand.<br/>
            The user Id is: { resourceApi.data?.data.user.id}


            {/* If the fetch was executed, this will show the object expanded from backend. */}
            {JSON.stringify(resourceApi.data?.data.user)}

        </>
    )
}
