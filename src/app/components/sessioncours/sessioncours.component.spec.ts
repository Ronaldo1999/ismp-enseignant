import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessioncoursComponent } from './sessioncours.component';

describe('SessioncoursComponent', () => {
  let component: SessioncoursComponent;
  let fixture: ComponentFixture<SessioncoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessioncoursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessioncoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
