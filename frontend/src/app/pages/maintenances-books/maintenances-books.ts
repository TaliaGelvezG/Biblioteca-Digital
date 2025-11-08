import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Book } from '../../interfaces/book';
import { Books } from '../../services/books';

@Component({
  selector: 'app-maintenances-books',
  imports: [CommonModule, FormsModule],
  templateUrl: './maintenances-books.html',
  styleUrl: './maintenances-books.scss',
})
export class MaintenancesBooks {
  books: Book[] = [];

  selectedBook: Book | null = null;
  modalOpen = false;
  isEditMode = false;

  constructor(private bookService: Books){
    bookService.getBooks().subscribe(newBooks => this.books = newBooks);
  }

  openModal(book?: Book) {
    this.isEditMode = !!book;
    this.selectedBook = book
      ? { ...book }
      : {
          id: '',
          title: '',
          author: '',
          year: new Date().getFullYear(),
          description: '',
          image: '',
          category: '',
          state: 'available',
        };
    this.modalOpen = true;
  }

  saveBook() {
    if (this.isEditMode && this.selectedBook) {
      const index = this.books.findIndex((b) => b.title === this.selectedBook!.title);
      this.books[index] = this.selectedBook!;
      this.bookService.updateBook(this.selectedBook!).subscribe(updateBook => console.log(updateBook));
    } else {
      this.bookService
        .registerBook(this.selectedBook!)
        .subscribe((newBook) => this.books.push(newBook));
    }
    this.closeModal();
  }

  deleteBook(book: Book) {
    this.bookService
      .deleteBook(book.id)
      .subscribe((isDeleted) => (this.books = this.books.filter((b) => b !== book)));
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedBook = null;
  }
}
