export const API_URL = process.env.API_URL || 'http://localhost:8080';

export const endpoints = {
    authLogin: '/user/auth/login',
    getAllUsers: '/user/list',
    getCourses: '/user/courses',
    getProfile: '/user/profile',
};
