import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Book } from '../../interfaces/book';
import { Loan } from '../../interfaces/loan';
import { Users } from '../../services/users';
import { JwtPayload } from '../../interfaces/jwt';
import { Router } from '@angular/router';
import { Books } from '../../services/books';
import { Loans } from '../../services/loans';

@Component({
  selector: 'app-main',
  imports: [FormsModule, CommonModule],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements OnInit {
  books: Book[] = [];

  filteredBooks: Book[] = [];
  selectedState: string = 'all';
  selectedCategory: string = 'all';
  categories: string[] = [];

  selectedBook: Book | null = null;
  loan: Loan = {
    id: '',
    bookId: '',
    documentNumberUser: '',
    bookName: '',
    userName: '',
    loanDate: '',
    loanTime: 0,
  };

  isUserAdmin: boolean = false;
  user: JwtPayload | null = null;

  constructor(private userService: Users, private router: Router,
    private bookService: Books, private loanService: Loans
  ) {
    const token = localStorage.getItem('jwt');
    this.user = userService.getUserRole(token!);

    if (this.user?.rol === 'admin') this.isUserAdmin = true;
  }

  ngOnInit(): void {
    this.bookService.getBooks().subscribe((books) => this.updateBooks(books));
  }

  private updateBooks(books: Book[]) {
    this.books = books;
    this.filteredBooks = [...books];
    this.categories = Array.from(new Set(books.map((b) => b.category)));
  }

  filterBooks() {
    this.filteredBooks = this.books.filter((book) => {
      const stateMatch = this.selectedState === 'all' || book.state === this.selectedState;
      const categoryMatch =
      this.selectedCategory === 'all' || book.category === this.selectedCategory;
      return stateMatch && categoryMatch;
    });
  }

  openLoanModal(book: Book) {
    this.selectedBook = book;
    this.loan = {
      id: '',
      bookId: book.id,
      documentNumberUser: '',
      bookName: book.title,
      userName: '',
      loanDate: '',
      loanTime: 0,
    };

    const modal = new bootstrap.Modal(document.getElementById('loanModal'));
    modal.show();
  }

  submitLoan() {
    if (this.selectedBook) {
      this.selectedBook.state = 'loaned';
      this.bookService.updateBook(this.selectedBook).subscribe();
      this.loanService.registerLoan(this.loan).subscribe();
      this.filterBooks();

    }

    const modal = bootstrap.Modal.getInstance(document.getElementById('loanModal'));
    modal.hide();
  }

  logout() {
    this.userService.logout();
  }

  goToMaintenances() {
    this.router.navigateByUrl('/maintenances');
  }
}
