import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevoirComponent } from './devoir.component';

describe('DevoirComponent', () => {
  let component: DevoirComponent;
  let fixture: ComponentFixture<DevoirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevoirComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevoirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
