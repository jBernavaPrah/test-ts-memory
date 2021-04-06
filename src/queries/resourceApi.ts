// This interface will be expanded in circular way.
import {
    AxiosRequestConfig,
    BaseObject,
    CanBeExpanded,
    KeysCanBeExpanded, RoleObject,
    useGetApi,
    UseQueryOptions,
    UserObject
} from "./index";

interface PippoObject extends BaseObject {
    id: string,
    name: string,
    user: CanBeExpanded<UserObject>,
    role: CanBeExpanded<RoleObject>
    roles: CanBeExpanded<RoleObject[]>
}


export const useGetResourceApi = <T extends KeysCanBeExpanded<PippoObject>>
(id: string,
 config: AxiosRequestConfig<T> = {},
 options: UseQueryOptions<PippoObject, T> = {}) => {
    return useGetApi(id, 'resources', '/resources', config, options)
}
