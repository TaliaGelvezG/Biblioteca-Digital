export interface User {
  id: string,
  name: string;
  documentNumber: string;
  documentType: string;
  email: string;
  password: string;
  rol: 'admin' | 'user';
}
