export interface ApiResponse<T> {
    success: boolean;
    message: string;
    detailed_message: string;
    data: T;
}