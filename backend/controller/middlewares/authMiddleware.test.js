const authMiddleware = require('./authMiddleware');
const jwt = require('jsonwebtoken');

// Mock de jsonwebtoken
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {},
            path: '/protected'
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('Rutas Públicas', () => {
        test('debe permitir acceso a /register sin token', () => {
            req.path = '/register';
            req.headers.authorization = undefined;

            authMiddleware(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        test('debe permitir acceso a /login sin token', () => {
            req.path = '/login';
            req.headers.authorization = undefined;

            authMiddleware(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        test('debe permitir acceso a /health sin token', () => {
            req.path = '/health';
            req.headers.authorization = undefined;

            authMiddleware(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    describe('Rutas Protegidas', () => {
        test('debe rechazar si no hay token en rutas protegidas', () => {
            req.path = '/protected/resource';
            req.headers.authorization = undefined;

            authMiddleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'JWT is required' });
            expect(next).not.toHaveBeenCalled();
        });

        test('debe rechazar si el header Authorization no tiene formato correcto', () => {
            req.path = '/protected/resource';
            req.headers.authorization = 'InvalidToken';

            authMiddleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'JWT is required' });
        });

        test('debe aceptar un token válido', () => {
            const validToken = 'valid.jwt.token';
            const decoded = { email: 'user@example.com', rol: 'user' };

            req.path = '/protected/resource';
            req.headers.authorization = `Bearer ${validToken}`;

            jwt.verify = jest.fn().mockReturnValue(decoded);

            authMiddleware(req, res, next);

            expect(jwt.verify).toHaveBeenCalledWith(validToken, process.env.JWT_SECRET);
            expect(req.user).toEqual(decoded);
            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        test('debe rechazar un token expirado', () => {
            const expiredToken = 'expired.jwt.token';

            req.path = '/protected/resource';
            req.headers.authorization = `Bearer ${expiredToken}`;

            const error = new Error('jwt expired');
            jwt.verify = jest.fn().mockImplementation(() => {
                throw error;
            });

            authMiddleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Expired or invalid JWT' });
            expect(next).not.toHaveBeenCalled();
        });

        test('debe rechazar un token inválido', () => {
            const invalidToken = 'invalid.jwt.token';

            req.path = '/protected/resource';
            req.headers.authorization = `Bearer ${invalidToken}`;

            const error = new Error('invalid token');
            jwt.verify = jest.fn().mockImplementation(() => {
                throw error;
            });

            authMiddleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Expired or invalid JWT' });
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('Extracción del Token', () => {
        test('debe extraer correctamente el token del header Bearer', () => {
            const token = 'extracted.jwt.token';
            const decoded = { email: 'test@example.com', rol: 'admin' };

            req.path = '/protected/resource';
            req.headers.authorization = `Bearer ${token}`;

            jwt.verify = jest.fn().mockReturnValue(decoded);

            authMiddleware(req, res, next);

            expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
        });

        test('debe rechazar si el header Authorization tiene espacios extra entre Bearer y el token', () => {
            const token = 'token.with.spaces';

            req.path = '/protected/resource';
            // Header con múltiples espacios entre Bearer y el token
            req.headers.authorization = `Bearer   ${token}`;

            jwt.verify = jest.fn().mockReturnValue({ email: 'test@example.com' });

            authMiddleware(req, res, next);

            // Con la implementación actual el split por " " devuelve una cadena vacía en [1],
            // por lo que no se llega a verificar el token y se debe responder 401
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'JWT is required' });
            expect(jwt.verify).not.toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('Información del Usuario en Request', () => {
        test('debe establecer req.user con los datos del token decodificado', () => {
            const token = 'valid.jwt.token';
            const decoded = {
                email: 'user@example.com',
                rol: 'user',
                userName: 'Juan Pérez'
            };

            req.path = '/protected/resource';
            req.headers.authorization = `Bearer ${token}`;

            jwt.verify = jest.fn().mockReturnValue(decoded);

            authMiddleware(req, res, next);

            expect(req.user).toEqual(decoded);
            expect(req.user.email).toBe('user@example.com');
            expect(req.user.rol).toBe('user');
            expect(req.user.userName).toBe('Juan Pérez');
        });
    });

    describe('Casos Edge', () => {
        test('debe manejar path que incluya las rutas públicas', () => {
            req.path = '/api/v1/register';
            req.headers.authorization = undefined;

            authMiddleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        test('debe rechazar si el header authorization es null', () => {
            req.path = '/protected/resource';
            req.headers.authorization = null;

            authMiddleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'JWT is required' });
        });

        test('debe rechazar si no hay header authorization', () => {
            req.path = '/protected/resource';
            delete req.headers.authorization;

            authMiddleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'JWT is required' });
        });
    });
});