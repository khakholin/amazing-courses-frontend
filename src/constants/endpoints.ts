export const API_URL = process.env.API_URL || 'http://khakholin.ru';

export const endpoints = {
    authLogin: '/api/user/auth/login',
    getAllUsers: '/api/user/list',
    getCourses: '/api/user/courses',
    getProfile: '/api/user/profile',
};
