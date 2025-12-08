import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MaintenancesLoans } from './maintenances-loans';

describe('MaintenancesLoans', () => {
  let component: MaintenancesLoans;
  let fixture: ComponentFixture<MaintenancesLoans>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenancesLoans, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenancesLoans);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
