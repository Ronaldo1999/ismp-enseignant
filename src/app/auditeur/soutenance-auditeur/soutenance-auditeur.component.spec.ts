import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoutenanceAuditeurComponent } from './soutenance-auditeur.component';

describe('SoutenanceAuditeurComponent', () => {
  let component: SoutenanceAuditeurComponent;
  let fixture: ComponentFixture<SoutenanceAuditeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoutenanceAuditeurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoutenanceAuditeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
