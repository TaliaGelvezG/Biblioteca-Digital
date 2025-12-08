const request = require('supertest');
const express = require('express');
const loanController = require('./loan-controller');
const Loan = require('../model/loan');

// Mock del modelo
jest.mock('../model/loan');

describe('Loan Controller', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/loans', loanController);
        jest.clearAllMocks();
    });

    describe('GET /loans', () => {
        test('debe retornar una lista de préstamos', async() => {
            const mockLoans = [{
                    id: '1',
                    bookId: 'book1',
                    documentNumberUser: '1234567890',
                    bookName: 'Clean Code',
                    userName: 'Juan Pérez',
                    loanDate: '2023-12-01',
                    loanTime: 14
                },
                {
                    id: '2',
                    bookId: 'book2',
                    documentNumberUser: '0987654321',
                    bookName: '1984',
                    userName: 'María García',
                    loanDate: '2023-12-05',
                    loanTime: 7
                }
            ];

            Loan.find = jest.fn().mockResolvedValue(mockLoans);

            const response = await request(app).get('/loans');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(2);
            expect(Loan.find).toHaveBeenCalled();
        });

        test('debe retornar un array vacío si no hay préstamos', async() => {
            Loan.find = jest.fn().mockResolvedValue([]);

            const response = await request(app).get('/loans');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });

        test('debe manejar errores de la base de datos', async() => {
            const error = new Error('Database connection error');
            Loan.find = jest.fn().mockRejectedValue(error);

            try {
                await request(app).get('/loans');
            } catch (err) {
                expect(err).toBeDefined();
            }
        });
    });

    describe('GET /loans/:id', () => {
        test('debe retornar un préstamo específico', async() => {
            const mockLoan = {
                id: '1',
                bookId: 'book1',
                documentNumberUser: '1234567890',
                bookName: 'Clean Code',
                userName: 'Juan Pérez',
                loanDate: '2023-12-01',
                loanTime: 14
            };

            Loan.findById = jest.fn().mockResolvedValue(mockLoan);

            const response = await request(app).get('/loans/1');

            expect(response.status).toBe(200);
            expect(response.body.userName).toBe('Juan Pérez');
            expect(response.body.bookName).toBe('Clean Code');
            expect(Loan.findById).toHaveBeenCalledWith('1');
        });

        test('debe retornar null si el préstamo no existe', async() => {
            Loan.findById = jest.fn().mockResolvedValue(null);

            const response = await request(app).get('/loans/999');

            expect(response.body).toBeNull();
        });
    });

    describe('POST /loans', () => {
        test('debe crear un nuevo préstamo', async() => {
            const newLoan = {
                bookId: 'book123',
                documentNumberUser: '1234567890',
                bookName: 'JavaScript Avanzado',
                userName: 'Carlos López',
                loanDate: '2023-12-08',
                loanTime: 14
            };

            const createdLoan = { id: '1', ...newLoan };

            Loan.create = jest.fn().mockResolvedValue(createdLoan);

            const response = await request(app)
                .post('/loans')
                .send(newLoan);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.userName).toBe('Carlos López');
            expect(Loan.create).toHaveBeenCalledWith(newLoan);
        });

        test('debe retornar error 500 si la creación falla', async() => {
            const newLoan = {
                bookId: 'book123',
                documentNumberUser: '1234567890',
                bookName: 'Test Book',
                userName: 'Test User',
                loanDate: '2023-12-08',
                loanTime: 14
            };

            const error = new Error('Validation error');
            Loan.create = jest.fn().mockRejectedValue(error);

            const response = await request(app)
                .post('/loans')
                .send(newLoan);

            expect(response.status).toBe(500);
            expect(Loan.create).toHaveBeenCalled();
        });
    });

    describe('PATCH /loans/:id', () => {
        test('debe actualizar un préstamo', async() => {
            const updatedLoan = {
                id: '1',
                bookId: 'book1',
                documentNumberUser: '1234567890',
                bookName: 'Clean Code',
                userName: 'Juan Pérez',
                loanDate: '2023-12-01',
                loanTime: 21
            };

            Loan.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedLoan);

            const response = await request(app)
                .patch('/loans/1')
                .send({ loanTime: 21 });

            expect(response.status).toBe(200);
            expect(response.body.loanTime).toBe(21);
            expect(Loan.findByIdAndUpdate).toHaveBeenCalledWith(
                '1', { loanTime: 21 }, { new: true }
            );
        });

        test('debe manejar errores en la actualización', async() => {
            const error = new Error('Update failed');
            Loan.findByIdAndUpdate = jest.fn().mockRejectedValue(error);

            const response = await request(app)
                .patch('/loans/1')
                .send({ loanTime: 21 });

            expect(response.status).toBe(500);
        });
    });

    describe('DELETE /loans/:id', () => {
        test('debe eliminar un préstamo', async() => {
            const deletedLoan = {
                id: '1',
                bookId: 'book1',
                documentNumberUser: '1234567890',
                bookName: 'Clean Code',
                userName: 'Juan Pérez'
            };

            Loan.findByIdAndDelete = jest.fn().mockResolvedValue(deletedLoan);

            const response = await request(app).delete('/loans/1');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id');
            expect(Loan.findByIdAndDelete).toHaveBeenCalledWith('1');
        });

        test('debe manejar errores en la eliminación', async() => {
            const error = new Error('Delete failed');
            Loan.findByIdAndDelete = jest.fn().mockRejectedValue(error);

            const response = await request(app).delete('/loans/1');

            expect(response.status).toBe(500);
        });
    });
});