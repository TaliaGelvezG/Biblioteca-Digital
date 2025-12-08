import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ForgetPassword } from './forget-password';

describe('ForgetPassword', () => {
  let component: ForgetPassword;
  let fixture: ComponentFixture<ForgetPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgetPassword, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgetPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
