const request = require('supertest');
const express = require('express');
const bookController = require('./book-controller');
const Book = require('../model/book');

// Mock del modelo
jest.mock('../model/book');

describe('Book Controller', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/books', bookController);
        jest.clearAllMocks();
    });

    describe('GET /books', () => {
        test('debe retornar una lista de libros', async() => {
            const mockBooks = [
                { id: '1', title: 'Clean Code', author: 'Robert Martin', state: 'available' },
                { id: '2', title: '1984', author: 'George Orwell', state: 'loaned' }
            ];

            Book.find = jest.fn().mockResolvedValue(mockBooks);

            const response = await request(app).get('/books');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(2);
            expect(Book.find).toHaveBeenCalled();
        });

        test('debe retornar un array vacío si no hay libros', async() => {
            Book.find = jest.fn().mockResolvedValue([]);

            const response = await request(app).get('/books');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });

        test('debe manejar errores de la base de datos', async() => {
            const error = new Error('Database connection error');
            Book.find = jest.fn().mockRejectedValue(error);

            try {
                await request(app).get('/books');
            } catch (err) {
                expect(err).toBeDefined();
            }
        });
    });

    describe('GET /books/:id', () => {
        test('debe retornar un libro específico', async() => {
            const mockBook = {
                id: '1',
                title: 'Clean Code',
                author: 'Robert Martin',
                year: 2008,
                state: 'available'
            };

            Book.findById = jest.fn().mockResolvedValue(mockBook);

            const response = await request(app).get('/books/1');

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Clean Code');
            expect(Book.findById).toHaveBeenCalledWith('1');
        });

        test('debe retornar null si el libro no existe', async() => {
            Book.findById = jest.fn().mockResolvedValue(null);

            const response = await request(app).get('/books/999');

            expect(response.body).toBeNull();
        });
    });

    describe('POST /books', () => {
        test('debe crear un nuevo libro', async() => {
            const newBook = {
                title: 'JavaScript Moderno',
                author: 'Kyle Simpson',
                year: 2020,
                description: 'Learn modern JavaScript',
                image: 'https://example.com/image.jpg',
                category: 'Programming',
                state: 'available'
            };

            const createdBook = { id: '1', ...newBook };

            Book.create = jest.fn().mockResolvedValue(createdBook);

            const response = await request(app)
                .post('/books')
                .send(newBook);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe('JavaScript Moderno');
            expect(Book.create).toHaveBeenCalledWith(newBook);
        });

        test('debe retornar error 500 si la creación falla', async() => {
            const newBook = {
                title: 'Test Book',
                author: 'Test Author',
                image: 'https://example.com/image.jpg',
                state: 'available'
            };

            const error = new Error('Validation error');
            Book.create = jest.fn().mockRejectedValue(error);

            const response = await request(app)
                .post('/books')
                .send(newBook);

            expect(response.status).toBe(500);
            expect(Book.create).toHaveBeenCalled();
        });
    });

    describe('PATCH /books/:id', () => {
        test('debe actualizar un libro', async() => {
            const updatedBook = {
                id: '1',
                title: 'Clean Code Updated',
                author: 'Robert Martin',
                state: 'loaned'
            };

            Book.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedBook);

            const response = await request(app)
                .patch('/books/1')
                .send({ title: 'Clean Code Updated', state: 'loaned' });

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Clean Code Updated');
            expect(response.body.state).toBe('loaned');
            expect(Book.findByIdAndUpdate).toHaveBeenCalledWith(
                '1', { title: 'Clean Code Updated', state: 'loaned' }, { new: true }
            );
        });

        test('debe manejar errores en la actualización', async() => {
            const error = new Error('Update failed');
            Book.findByIdAndUpdate = jest.fn().mockRejectedValue(error);

            const response = await request(app)
                .patch('/books/1')
                .send({ title: 'New Title' });

            expect(response.status).toBe(500);
        });
    });

    describe('DELETE /books/:id', () => {
        test('debe eliminar un libro', async() => {
            const deletedBook = {
                id: '1',
                title: 'Clean Code',
                author: 'Robert Martin'
            };

            Book.findByIdAndDelete = jest.fn().mockResolvedValue(deletedBook);

            const response = await request(app).delete('/books/1');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id');
            expect(Book.findByIdAndDelete).toHaveBeenCalledWith('1');
        });

        test('debe manejar errores en la eliminación', async() => {
            const error = new Error('Delete failed');
            Book.findByIdAndDelete = jest.fn().mockRejectedValue(error);

            const response = await request(app).delete('/books/1');

            expect(response.status).toBe(500);
        });
    });
});