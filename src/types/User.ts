export interface User{
    id: number;
    username: string;
    role: 'ADMIN' | 'SERVICE_ACHAT' | 'CLIENT';
}