
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Maintenances } from './maintenances';

describe('Maintenances', () => {
  let component: Maintenances;
  let fixture: ComponentFixture<Maintenances>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Maintenances, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Maintenances);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
