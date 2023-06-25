export interface ErrorCode {
    code: number
    message: string
}


export interface DataTransferObject {
    status_code: number
    message: string
    error: ErrorCode | null
    data: any
} 


export interface ErrorResponse {
    status: number,
    message: string,
    code: string,
    name: string,
    response: {
        data: DataTransferObject
    }
}