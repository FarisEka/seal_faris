const userHandler = require('./userHandler')
const proyekHandler = require('./proyekHandler')
const tugasHandler = require('./tugasHandler')
const jwt = require('jsonwebtoken')

const SECRET_KEY = 'your_jwt_secret_key';

const accesValidation = (request, h) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return h.response({ message: 'No token provided' }).code(401);
    }

    try {
        const user = jwt.verify(token, SECRET_KEY);
        request.user = user;
    } catch (error) {
        return h.response({ message: 'Invalid token' }).code(403);
    }

    return h.continue;
};

module.exports = [
    {
        method: 'POST',
        path: '/user',
        handler: userHandler.createUser
    },
    {
        method: 'GET',
        path: '/user/{id}',
        handler: userHandler.getUser
    },
    {
        method: 'PUT',
        path: '/user/{id}',
        handler: userHandler.updateUser
    },
    {
        method: 'DELETE',
        path: '/user/{id}',
        handler: userHandler.deleteUser
    },

    {
        method: 'POST',
        path: '/proyek',
        handler: proyekHandler.createProyek,
        options: {
            pre: [{ method: accesValidation }]
        }
    },
    {
        method: 'GET',
        path: '/proyek/{id}',
        handler: proyekHandler.getProyek,
        options: {
            pre: [{ method: accesValidation }]
        }
    },
    {
        method: 'PUT',
        path: '/proyek/{id}',
        handler: proyekHandler.updateProyek,
        options: {
            pre: [{ method: accesValidation }]
        }
    },
    {
        method: 'DELETE',
        path: '/proyek/{id}',
        handler: proyekHandler.deleteProyek,
        options: {
            pre: [{ method: accesValidation }]
        }
    },

    {
        method: 'POST',
        path: '/tugas',
        handler: tugasHandler.createTugas,
        options: {
            pre: [{ method: accesValidation }]
        }
    },
    {
        method: 'GET',
        path: '/tugas/{id}',
        handler: tugasHandler.getTugas,
        options: {
            pre: [{ method: accesValidation }]
        }
    },
    {
        method: 'PUT',
        path: '/tugas/{id}',
        handler: tugasHandler.updateTugas,
        options: {
            pre: [{ method: accesValidation }]
        }
    },
    {
        method: 'DELETE',
        path: '/tugas/{id}',
        handler: tugasHandler.deleteTugas,
        options: {
            pre: [{ method: accesValidation }]
        }
    },
];
