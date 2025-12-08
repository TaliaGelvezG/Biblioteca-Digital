import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Books } from './books';
import { Book } from '../interfaces/book';

describe('Books', () => {
  let service: Books;
  let httpMock: HttpTestingController;
  const basePath = 'http://localhost:3000/api/v1/biblioteca-digital/books';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Books],
    });
    service = TestBed.inject(Books);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBooks', () => {
    it('should fetch all books', () => {
      const mockBooks: Book[] = [
        {
          id: '1',
          title: 'Book 1',
          author: 'Author 1',
          year: 2020,
          description: 'Description 1',
          image: 'image1.jpg',
          category: 'Fiction',
          state: 'available',
        },
        {
          id: '2',
          title: 'Book 2',
          author: 'Author 2',
          year: 2021,
          description: 'Description 2',
          image: 'image2.jpg',
          category: 'Science',
          state: 'loaned',
        },
      ];

      service.getBooks().subscribe((books) => {
        expect(books).toEqual(mockBooks);
        expect(books.length).toBe(2);
      });

      const req = httpMock.expectOne(basePath);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBe(true);
      req.flush(mockBooks);
    });
  });

  describe('getBookById', () => {
    it('should fetch a book by ID', () => {
      const bookId = '1';
      const mockBook: Book = {
        id: '1',
        title: 'Book 1',
        author: 'Author 1',
        year: 2020,
        description: 'Description 1',
        image: 'image1.jpg',
        category: 'Fiction',
        state: 'available',
      };

      service.getBookById(bookId).subscribe((book) => {
        expect(book).toEqual(mockBook);
        expect(book.id).toBe('1');
      });

      const req = httpMock.expectOne(`${basePath}/${bookId}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBe(true);
      req.flush(mockBook);
    });
  });

  describe('registerBook', () => {
    it('should register a new book', () => {
      const mockBook: Book = {
        id: '3',
        title: 'New Book',
        author: 'New Author',
        year: 2023,
        description: 'New Description',
        image: 'newimage.jpg',
        category: 'Mystery',
        state: 'available',
      };

      service.registerBook(mockBook).subscribe((book) => {
        expect(book).toEqual(mockBook);
        expect(book.title).toBe('New Book');
      });

      const req = httpMock.expectOne(basePath);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockBook);
      expect(req.request.headers.has('Authorization')).toBe(true);
      req.flush(mockBook);
    });
  });

  describe('updateBook', () => {
    it('should update an existing book', () => {
      const mockBook: Book = {
        id: '1',
        title: 'Updated Book',
        author: 'Updated Author',
        year: 2024,
        description: 'Updated Description',
        image: 'updated.jpg',
        category: 'Fiction',
        state: 'loaned',
      };

      service.updateBook(mockBook).subscribe((book) => {
        expect(book).toEqual(mockBook);
        expect(book.title).toBe('Updated Book');
        expect(book.state).toBe('loaned');
      });

      const req = httpMock.expectOne(`${basePath}/${mockBook.id}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(mockBook);
      expect(req.request.headers.has('Authorization')).toBe(true);
      req.flush(mockBook);
    });
  });

  describe('deleteBook', () => {
    it('should delete a book', () => {
      const bookId = '1';

      service.deleteBook(bookId).subscribe();

      const req = httpMock.expectOne(`${basePath}/${bookId}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.has('Authorization')).toBe(true);
      req.flush({});
    });
  });

  describe('getJwt', () => {
    it('should return JWT token with Bearer prefix', () => {
      const token = 'test-jwt-token';
      localStorage.setItem('jwt', token);

      const result = service.getJwt();

      expect(result).toBe(`Bearer ${token}`);
    });

    it('should return "Bearer null" if no token in localStorage', () => {
      const result = service.getJwt();

      expect(result).toBe('Bearer null');
    });
  });

  describe('getHeaderAuthorization', () => {
    it('should return HttpHeaders with authorization', () => {
      localStorage.setItem('jwt', 'test-token');

      const headers = service.getHeaderAuthorization();

      expect(headers.has('Content-Type')).toBe(true);
      expect(headers.has('Authorization')).toBe(true);
      expect(headers.get('Content-Type')).toBe('application/json');
    });

    it('should include Bearer token in Authorization header', () => {
      const token = 'test-token';
      localStorage.setItem('jwt', token);

      const headers = service.getHeaderAuthorization();

      expect(headers.get('Authorization')).toContain('Bearer');
      expect(headers.get('Authorization')).toContain(token);
    });
  });
});
