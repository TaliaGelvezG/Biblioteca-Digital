import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenancesUsers } from './maintenances-users';

describe('MaintenancesUsers', () => {
  let component: MaintenancesUsers;
  let fixture: ComponentFixture<MaintenancesUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenancesUsers]
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
