export interface ApiResponse<T> {
    success: boolean;
    message: string;
    detail?: string;
    called_by: 'app' | 'site' | 'webapp'
    data: T;
}