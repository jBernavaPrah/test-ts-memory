import {

    useQuery,
    UseQueryOptions as BaseUseQueryOptions
} from "react-query";
import axios, {AxiosError, AxiosRequestConfig as BaseAxiosRequestConfig, AxiosResponse} from "axios";

type Join<K, P> = K extends string | number ?
    P extends string | number ?
        `${K}${"" extends P ? "" : "."}${P}`
        : never : never;

type PrefixWith<P, S, C = '.'> = P extends '' ? `${string & S}` : `${string & P}${string & C}${string & S}`


type SplitWithAllPossibleCombinations<S extends string, D extends string> =
    string extends S ? string :
        S extends '' ? '' :
            S extends `${infer T}${D}${infer U}` ?
                T | Join<T, SplitWithAllPossibleCombinations<U, D>>
                : S;


export type CanBeExpanded<T extends object = object, D extends string | null | never = string> = {
    value: T
    default: D,
};

/**
 * Expand keys on `O` based by `Keys` parameter.
 */
type Expand__<O, Keys, P extends string, N extends number, Depth extends unknown[]> =
    N extends Depth['length'] ?
        O extends CanBeExpanded ?
            O['default'] :
            O :
        O extends CanBeExpanded ?
            Expand__<O[P extends Keys ? 'value' : 'default'], Keys, P, N, Depth> :
            O extends Array<infer U> ?
                Expand__<U, Keys, P, N, Depth>[]
                : O extends object ?
                {
                    [K in keyof O]-?: Expand__<O[K], Keys, PrefixWith<P, K>, N, [1, ...Depth]>
                }
                : O

type AllKeys<K> = SplitWithAllPossibleCombinations<K extends string ? K : '', '.'> extends infer Ko ? Ko : ''

export type Expand_<T, K, N extends number = 4> = Expand__<T, AllKeys<K>, '', N, []>
export type Expand<T extends object, K extends KeysCanBeExpanded<T, N> extends infer R ? R : never = never, N extends number = 4> = Expand_<T, K, N>

type KeysCanBeExpanded_<T, N extends number, Depth extends number[]> = N extends Depth['length'] ? never :
    T extends CanBeExpanded ?
        KeysCanBeExpanded_<T['value'], N, Depth> :
        T extends Array<infer U> ? KeysCanBeExpanded_<U, N, Depth> :

            T extends object ?
                {
                    [K in keyof T]:
                    T[K] extends object ?
                        K extends string | number
                            ? `${K}` | Join<`${K}`, KeysCanBeExpanded_<T[K], N, [1, ...Depth]>>
                            : never
                        : never

                }[keyof T]
                :
                never

export type KeysCanBeExpanded<T, N extends number = 4> = KeysCanBeExpanded_<T, N, []>


type UseQueryOptions_<T> = BaseUseQueryOptions<AxiosResponse<T>, AxiosError<ApiError>>
export type UseQueryOptions<T, K> = UseQueryOptions_<Expand_<T, K> extends infer O ? O : never>

//export type UseQueryOptions<T, K> = BaseUseQueryOptions<AxiosResponse<T>, AxiosError<ApiError>>

export interface AxiosRequestConfig<T> extends BaseAxiosRequestConfig {
    params?: {
        expands?: T[]
    }
}

type ApiObject = {
    object: string,
}


export interface BaseObject extends ApiObject {
    id: string,
    updated: number,
    created: number,
}

export interface ApiError {
    code: string,
    message: string,
}


export interface UserObject extends BaseObject {
    role: CanBeExpanded<RoleObject>,
    note: string,
}

export interface RoleObject extends BaseObject {
    user: CanBeExpanded<UserObject>,
    x: string
}


/**
 * The original useGetApi use Axios to communicate with backend.
 * Here is not necessary.
 * @param id
 * @param queryKey
 * @param apiUri
 * @param config
 * @param options
 */
export const useGetApi = <T, K extends string | never>(
    id: string,
    queryKey: string,
    apiUri: string,
    config: AxiosRequestConfig<K> = {},
    options: UseQueryOptions<T, K> = {}) => {

    return useQuery([queryKey, id, config.params],
        () => axios.get(`${apiUri}/${id}`, config),
        options)
}
