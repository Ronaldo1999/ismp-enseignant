import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssiduiteComponent } from './assiduite.component';

describe('AssiduiteComponent', () => {
  let component: AssiduiteComponent;
  let fixture: ComponentFixture<AssiduiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssiduiteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssiduiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
