export interface ApiResponse<T> {
    success: boolean;
    message: string;
    detailed_message: string;
    called_by: 'app' | 'site' | 'webapp'
    data: T;
}