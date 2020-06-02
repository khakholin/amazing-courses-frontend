export const API_URL = process.env.API_URL || 'http://localhost:8080';

export const endpoints = {
    authLogin: '/api/user/auth/login',
    getAllUsers: '/api/user/list',
    getCourses: '/api/user/courses',
    getProfile: '/api/user/profile',
};
