import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RotatePhoneComponent } from './rotate-phone.component';

describe('RotatePhoneComponent', () => {
  let component: RotatePhoneComponent;
  let fixture: ComponentFixture<RotatePhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RotatePhoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RotatePhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
