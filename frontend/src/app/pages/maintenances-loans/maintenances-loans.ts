import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Loan } from '../../interfaces/loan';
import { Loans } from '../../services/loans';
import { Books } from '../../services/books';

@Component({
  selector: 'app-maintenances-loans',
  imports: [CommonModule, FormsModule],
  templateUrl: './maintenances-loans.html',
  styleUrl: './maintenances-loans.scss',
})
export class MaintenancesLoans {
  loans: Loan[] = [];

  showModal = false;
  isEdit = false;
  selectedIndex: number | null = null;

  form: Loan = this.emptyForm();

  constructor(private loanService: Loans, private bookService: Books){
    this.loanService.getLoans().subscribe(listedLoans => this.loans = listedLoans);
  }

  private emptyForm(): Loan {
    const today = new Date().toISOString().slice(0, 10);
    return {
      id : '',
      bookId: '',
      documentNumberUser: '',
      bookName: '',
      userName: '',
      loanDate: today,
      loanTime: 1,
    };
  }

  openCreate() {
    this.isEdit = false;
    this.form = this.emptyForm();
    this.selectedIndex = null;
    this.showModal = true;
  }

  openEdit(loan: Loan, index: number) {
    this.isEdit = true;
    this.form = { ...loan };
    this.selectedIndex = index;
    this.showModal = true;
  }

  save() {
    if (this.isEdit && this.selectedIndex !== null) {
      this.loanService.updateLoan({ ...this.form }).subscribe();
      this.loans[this.selectedIndex] = { ...this.form };
    } else {
      this.loanService
        .registerLoan(this.form)
        .subscribe((loanUpdated) => this.loans.push({ ...loanUpdated }));
      this.bookService.getBookById(this.form.bookId).subscribe((bookData) => {
        bookData.state = 'loaned';
        this.bookService.updateBook({ ...bookData }).subscribe();
      });
    }
    this.close();
  }

  remove(index: number, id: string, bookId: string) {
    this.loanService.deleteLoan(id).subscribe();
    this.bookService
      .getBookById(bookId)
      .subscribe(bookData => {
        bookData.state = 'available';
        this.bookService.updateBook({ ...bookData }).subscribe();
      });
    this.loans.splice(index, 1);
  }

  close() {
    this.showModal = false;
    this.selectedIndex = null;
  }
}
