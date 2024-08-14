import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteanonymeComponent } from './noteanonyme.component';

describe('NoteanonymeComponent', () => {
  let component: NoteanonymeComponent;
  let fixture: ComponentFixture<NoteanonymeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteanonymeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteanonymeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
