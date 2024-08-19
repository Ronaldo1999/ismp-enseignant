import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoutenanceComponent } from './soutenance.component';

describe('SoutenanceComponent', () => {
  let component: SoutenanceComponent;
  let fixture: ComponentFixture<SoutenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoutenanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoutenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
