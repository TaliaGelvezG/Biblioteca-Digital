const Loan = require('./loan');
const mongoose = require('mongoose');

describe('Loan Model', () => {
    describe('Schema Validation', () => {
        test('debe tener los campos requeridos en el schema', () => {
            const schema = Loan.schema;
            expect(schema.paths.bookId).toBeDefined();
            expect(schema.paths.documentNumberUser).toBeDefined();
            expect(schema.paths.bookName).toBeDefined();
            expect(schema.paths.userName).toBeDefined();
            expect(schema.paths.loanDate).toBeDefined();
            expect(schema.paths.loanTime).toBeDefined();
        });

        test('todos los campos deben ser de tipo String o Number', () => {
            const schema = Loan.schema;
            expect(schema.paths.bookId.instance).toBe('String');
            expect(schema.paths.documentNumberUser.instance).toBe('String');
            expect(schema.paths.bookName.instance).toBe('String');
            expect(schema.paths.userName.instance).toBe('String');
            expect(schema.paths.loanDate.instance).toBe('String');
            expect(schema.paths.loanTime.instance).toBe('Number');
        });
    });

    describe('toJSON Transformation', () => {
        test('debe transformar el documento a JSON correctamente', () => {
            const loanObj = {
                _id: new mongoose.Types.ObjectId(),
                bookId: 'book123',
                documentNumberUser: '1234567890',
                bookName: 'Clean Code',
                userName: 'Juan Pérez',
                loanDate: '2023-12-08',
                loanTime: 14,
                __v: 0
            };

            const schema = Loan.schema;
            const ret = {...loanObj };
            schema.options.toJSON.transform(loanObj, ret);

            expect(ret.id).toBe(loanObj._id);
            expect(ret._id).toBeUndefined();
            expect(ret.__v).toBeUndefined();
            expect(ret.bookId).toBe('book123');
            expect(ret.documentNumberUser).toBe('1234567890');
            expect(ret.loanTime).toBe(14);
        });

        test('debe mantener todos los campos principales en toJSON', () => {
            const loanObj = {
                _id: new mongoose.Types.ObjectId(),
                bookId: 'book456',
                documentNumberUser: '0987654321',
                bookName: 'Test Book',
                userName: 'Test User',
                loanDate: '2023-12-01',
                loanTime: 7,
                __v: 0
            };

            const schema = Loan.schema;
            const ret = {...loanObj };
            schema.options.toJSON.transform(loanObj, ret);

            expect(ret).toHaveProperty('bookId');
            expect(ret).toHaveProperty('documentNumberUser');
            expect(ret).toHaveProperty('bookName');
            expect(ret).toHaveProperty('userName');
            expect(ret).toHaveProperty('loanDate');
            expect(ret).toHaveProperty('loanTime');
            expect(ret).toHaveProperty('id');
        });
    });

    describe('Campos del Préstamo', () => {
        test('bookId debe almacenar el identificador del libro', () => {
            const schema = Loan.schema;
            expect(schema.paths.bookId).toBeDefined();
        });

        test('documentNumberUser debe almacenar el documento del usuario', () => {
            const schema = Loan.schema;
            expect(schema.paths.documentNumberUser).toBeDefined();
        });

        test('loanTime debe ser un número para almacenar días', () => {
            const schema = Loan.schema;
            expect(schema.paths.loanTime.instance).toBe('Number');
        });

        test('loanDate debe ser una fecha en formato string', () => {
            const schema = Loan.schema;
            expect(schema.paths.loanDate.instance).toBe('String');
        });
    });
});