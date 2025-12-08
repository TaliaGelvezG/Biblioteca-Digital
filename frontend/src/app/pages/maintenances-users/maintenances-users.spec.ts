import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MaintenancesUsers } from './maintenances-users';

describe('MaintenancesUsers', () => {
  let component: MaintenancesUsers;
  let fixture: ComponentFixture<MaintenancesUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenancesUsers, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenancesUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
