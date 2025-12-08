import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenancesBooks } from './maintenances-books';

describe('MaintenancesBooks', () => {
  let component: MaintenancesBooks;
  let fixture: ComponentFixture<MaintenancesBooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenancesBooks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenancesBooks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
