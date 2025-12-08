const request = require('supertest');
const express = require('express');
const userController = require('./user-controller');
const User = require('../model/user');
const jwt = require('jsonwebtoken');

// Mock de los modelos
jest.mock('../model/user');
jest.mock('jsonwebtoken');

describe('User Controller', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/users', userController);
        jest.clearAllMocks();
    });

    describe('GET /users', () => {
        test('debe retornar una lista de usuarios', async() => {
            const mockUsers = [
                { id: '1', name: 'Juan', email: 'juan@example.com', rol: 'user' },
                { id: '2', name: 'María', email: 'maria@example.com', rol: 'admin' }
            ];

            User.find = jest.fn().mockResolvedValue(mockUsers);

            const response = await request(app).get('/users');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(User.find).toHaveBeenCalled();
        });

        test('debe manejar errores al obtener usuarios', async() => {
            User.find = jest.fn().mockRejectedValue(new Error('Database error'));

            try {
                await request(app).get('/users');
            } catch (error) {
                expect(error).toBeDefined();
            }
        });
    });

    describe('GET /users/:id', () => {
        test('debe retornar un usuario específico', async() => {
            const mockUser = {
                id: '1',
                name: 'Juan',
                email: 'juan@example.com',
                rol: 'user'
            };

            User.findById = jest.fn().mockResolvedValue(mockUser);

            const response = await request(app).get('/users/1');

            expect(response.status).toBe(200);
            expect(User.findById).toHaveBeenCalledWith('1');
        });

        test('debe retornar null si el usuario no existe', async() => {
            User.findById = jest.fn().mockResolvedValue(null);

            const response = await request(app).get('/users/999');

            expect(response.body).toBeNull();
            expect(User.findById).toHaveBeenCalledWith('999');
        });
    });

    describe('POST /users/register', () => {
        test('debe crear un nuevo usuario', async() => {
            const newUser = {
                name: 'Carlos',
                documentNumber: '1234567890',
                documentType: 'Cédula',
                email: 'carlos@example.com',
                password: 'password123',
                rol: 'user'
            };

            const createdUser = { id: '1', ...newUser };

            User.create = jest.fn().mockResolvedValue(createdUser);

            const response = await request(app)
                .post('/users/register')
                .send(newUser);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(User.create).toHaveBeenCalledWith(newUser);
        });

        test('debe retornar error 500 si la creación falla', async() => {
            const newUser = {
                name: 'Carlos',
                documentNumber: '1234567890',
                email: 'carlos@example.com',
                password: 'password123',
                rol: 'user'
            };

            const error = new Error('Email already exists');
            User.create = jest.fn().mockRejectedValue(error);

            const response = await request(app)
                .post('/users/register')
                .send(newUser);

            expect(response.status).toBe(500);
            expect(User.create).toHaveBeenCalled();
        });
    });

    describe('POST /users/login', () => {
        test('debe retornar un JWT token si las credenciales son válidas', async() => {
            const mockUser = {
                _id: '1',
                name: 'Juan',
                email: 'juan@example.com',
                password: 'hashed_password',
                rol: 'user',
                comparePassword: jest.fn().mockResolvedValue(true)
            };

            const token = 'jwt_token_123';

            User.findOne = jest.fn().mockResolvedValue(mockUser);
            jwt.sign = jest.fn().mockReturnValue(token);

            const response = await request(app)
                .post('/users/login')
                .send({
                    email: 'juan@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body.token).toBe(token);
            expect(User.findOne).toHaveBeenCalledWith({ email: 'juan@example.com' });
        });

        test('debe retornar error 404 si el usuario no existe', async() => {
            User.findOne = jest.fn().mockResolvedValue(null);

            const response = await request(app)
                .post('/users/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message');
        });

        test('debe retornar error 401 si la contraseña es incorrecta', async() => {
            const mockUser = {
                _id: '1',
                email: 'juan@example.com',
                password: 'hashed_password',
                rol: 'user',
                comparePassword: jest.fn().mockResolvedValue(false)
            };

            User.findOne = jest.fn().mockResolvedValue(mockUser);

            const response = await request(app)
                .post('/users/login')
                .send({
                    email: 'juan@example.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message');
        });
    });

    describe('PATCH /users/:id', () => {
        test('debe actualizar un usuario', async() => {
            const updatedUser = {
                id: '1',
                name: 'Juan Actualizado',
                email: 'juan.updated@example.com',
                rol: 'admin'
            };

            User.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedUser);

            const response = await request(app)
                .patch('/users/1')
                .send({ name: 'Juan Actualizado' });

            expect(response.status).toBe(200);
            expect(response.body.name).toBe('Juan Actualizado');
            expect(User.findByIdAndUpdate).toHaveBeenCalledWith('1', { name: 'Juan Actualizado' }, { new: true });
        });

        test('debe retornar error 500 si la actualización falla', async() => {
            const error = new Error('Update failed');
            User.findByIdAndUpdate = jest.fn().mockRejectedValue(error);

            const response = await request(app)
                .patch('/users/1')
                .send({ name: 'New Name' });

            expect(response.status).toBe(500);
        });
    });

    describe('DELETE /users/:id', () => {
        test('debe eliminar un usuario', async() => {
            const deletedUser = {
                id: '1',
                name: 'Juan',
                email: 'juan@example.com'
            };

            User.findByIdAndDelete = jest.fn().mockResolvedValue(deletedUser);

            const response = await request(app).delete('/users/1');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id');
            expect(User.findByIdAndDelete).toHaveBeenCalledWith('1');
        });

        test('debe retornar error 500 si la eliminación falla', async() => {
            const error = new Error('Delete failed');
            User.findByIdAndDelete = jest.fn().mockRejectedValue(error);

            const response = await request(app).delete('/users/1');

            expect(response.status).toBe(500);
        });
    });
});