const Book = require('./book');
const mongoose = require('mongoose');

describe('Book Model', () => {
    describe('Schema Validation', () => {
        test('debe tener los campos requeridos en el schema', () => {
            const schema = Book.schema;
            expect(schema.paths.title).toBeDefined();
            expect(schema.paths.author).toBeDefined();
            expect(schema.paths.year).toBeDefined();
            expect(schema.paths.description).toBeDefined();
            expect(schema.paths.image).toBeDefined();
            expect(schema.paths.category).toBeDefined();
            expect(schema.paths.state).toBeDefined();
        });

        test('image debe ser requerido', () => {
            const schema = Book.schema;
            expect(schema.paths.image.isRequired).toBe(true);
        });

        test('state debe ser requerido', () => {
            const schema = Book.schema;
            expect(schema.paths.state.isRequired).toBe(true);
        });

        test('state debe tener enum con valores válidos', () => {
            const schema = Book.schema;
            const enumValues = schema.paths.state.enumValues;
            expect(enumValues).toContain('loaned');
            expect(enumValues).toContain('available');
        });
    });

    describe('toJSON Transformation', () => {
        test('debe transformar el documento a JSON correctamente', () => {
            const bookObj = {
                _id: new mongoose.Types.ObjectId(),
                title: 'Clean Code',
                author: 'Robert C. Martin',
                year: 2008,
                description: 'A Handbook of Agile Software Craftsmanship',
                image: 'https://example.com/image.jpg',
                category: 'Programming',
                state: 'available',
                __v: 0
            };

            const schema = Book.schema;
            const ret = {...bookObj };
            schema.options.toJSON.transform(bookObj, ret);

            expect(ret.id).toBe(bookObj._id);
            expect(ret._id).toBeUndefined();
            expect(ret.__v).toBeUndefined();
            expect(ret.title).toBe('Clean Code');
            expect(ret.author).toBe('Robert C. Martin');
            expect(ret.state).toBe('available');
        });

        test('debe mantener todos los campos principales en toJSON', () => {
            const bookObj = {
                _id: new mongoose.Types.ObjectId(),
                title: 'Test Book',
                author: 'Test Author',
                year: 2023,
                description: 'Test Description',
                image: 'https://example.com/image.jpg',
                category: 'Test',
                state: 'available',
                __v: 0
            };

            const schema = Book.schema;
            const ret = {...bookObj };
            schema.options.toJSON.transform(bookObj, ret);

            expect(ret).toHaveProperty('title');
            expect(ret).toHaveProperty('author');
            expect(ret).toHaveProperty('year');
            expect(ret).toHaveProperty('description');
            expect(ret).toHaveProperty('image');
            expect(ret).toHaveProperty('category');
            expect(ret).toHaveProperty('state');
            expect(ret).toHaveProperty('id');
        });
    });

    describe('Estados del Libro', () => {
        test('el estado inicial debe ser "available" o "loaned"', () => {
            const schema = Book.schema;
            const enumValues = schema.paths.state.enumValues;
            expect(enumValues.length).toBe(2);
        });

        test('no debe permitir estados inválidos', () => {
            const schema = Book.schema;
            const enumValues = schema.paths.state.enumValues;
            expect(enumValues).not.toContain('damaged');
            expect(enumValues).not.toContain('reserved');
        });
    });
});