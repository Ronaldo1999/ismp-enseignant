import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotevalidationComponent } from './notevalidation.component';

describe('NotevalidationComponent', () => {
  let component: NotevalidationComponent;
  let fixture: ComponentFixture<NotevalidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotevalidationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotevalidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
