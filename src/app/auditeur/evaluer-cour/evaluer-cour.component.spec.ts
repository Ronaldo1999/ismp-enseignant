import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluerCourComponent } from './evaluer-cour.component';

describe('EvaluerCourComponent', () => {
  let component: EvaluerCourComponent;
  let fixture: ComponentFixture<EvaluerCourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluerCourComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluerCourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
