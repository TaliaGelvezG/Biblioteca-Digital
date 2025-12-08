const User = require('./user');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Mock de bcrypt
jest.mock('bcrypt');

describe('User Model', () => {
    describe('Schema Validation', () => {
        test('debe tener los campos requeridos en el schema', () => {
            const schema = User.schema;
            expect(schema.paths.name).toBeDefined();
            expect(schema.paths.documentNumber).toBeDefined();
            expect(schema.paths.documentType).toBeDefined();
            expect(schema.paths.email).toBeDefined();
            expect(schema.paths.password).toBeDefined();
            expect(schema.paths.rol).toBeDefined();
        });

        test('documentNumber debe ser único y requerido', () => {
            const schema = User.schema;
            expect(schema.paths.documentNumber.isRequired).toBe(true);
            expect(schema.paths.documentNumber.options.unique).toBe(true);
        });

        test('email debe ser único y requerido', () => {
            const schema = User.schema;
            expect(schema.paths.email.isRequired).toBe(true);
            expect(schema.paths.email.options.unique).toBe(true);
        });

        test('rol debe tener enum con valores válidos', () => {
            const schema = User.schema;
            const enumValues = schema.paths.rol.enumValues;
            expect(enumValues).toContain('admin');
            expect(enumValues).toContain('user');
            expect(enumValues).toContain('librarian');
        });
    });

    describe('Métodos del Schema', () => {
        test('comparePassword debe comparar contraseñas correctamente', async() => {
            bcrypt.compare.mockResolvedValue(true);
            const mockUser = { comparePassword: User.schema.methods.comparePassword, password: 'hashed' };

            const result = await mockUser.comparePassword('password123');
            expect(result).toBe(true);
        });

        test('comparePassword debe retornar false si la contraseña no coincide', async() => {
            bcrypt.compare.mockResolvedValue(false);
            const mockUser = { comparePassword: User.schema.methods.comparePassword, password: 'hashed' };

            const result = await mockUser.comparePassword('wrongpassword');
            expect(result).toBe(false);
        });
    });

    describe('toJSON Transformation', () => {
        test('debe transformar el documento a JSON eliminando campos sensibles', () => {
            const userObj = {
                _id: new mongoose.Types.ObjectId(),
                name: 'Juan Pérez',
                documentNumber: '1234567890',
                documentType: 'Cédula',
                email: 'juan@example.com',
                password: 'hashed_password',
                rol: 'user',
                __v: 0
            };

            const schema = User.schema;
            const ret = {...userObj };
            // la función transform muta `ret` en lugar de retornarlo
            schema.options.toJSON.transform(userObj, ret);

            expect(ret.id).toBe(userObj._id);
            expect(ret._id).toBeUndefined();
            expect(ret.__v).toBeUndefined();
            expect(ret.password).toBeUndefined();
            expect(ret.name).toBe('Juan Pérez');
            expect(ret.rol).toBe('user');
        });
    });
});