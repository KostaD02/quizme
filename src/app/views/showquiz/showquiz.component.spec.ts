import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowquizComponent } from './showquiz.component';

describe('ShowquizComponent', () => {
  let component: ShowquizComponent;
  let fixture: ComponentFixture<ShowquizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowquizComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowquizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
