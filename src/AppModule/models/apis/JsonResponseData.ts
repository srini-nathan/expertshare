export class JsonResponseData {
    [key: string]:
        | string
        | string[]
        | number
        | number[]
        | boolean
        | boolean[]
        | null
        | null[]
        | JsonResponseData
        | JsonResponseData[]
        | undefined
        | any[]
        | any;
}
