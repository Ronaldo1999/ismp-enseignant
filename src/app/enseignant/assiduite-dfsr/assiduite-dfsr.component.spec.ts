import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssiduiteDfsrComponent } from './assiduite-dfsr.component';

describe('AssiduiteDfsrComponent', () => {
  let component: AssiduiteDfsrComponent;
  let fixture: ComponentFixture<AssiduiteDfsrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssiduiteDfsrComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AssiduiteDfsrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
