export interface ApiResponse<T> {
    success: boolean;
    message: string;
    detaile?: string;
    called_by: 'app' | 'site' | 'webapp'
    data: T;
}