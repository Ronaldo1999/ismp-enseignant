import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssiduiteAuditeurComponent } from './assiduite-auditeur.component';

describe('AssiduiteAuditeurComponent', () => {
  let component: AssiduiteAuditeurComponent;
  let fixture: ComponentFixture<AssiduiteAuditeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssiduiteAuditeurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssiduiteAuditeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
