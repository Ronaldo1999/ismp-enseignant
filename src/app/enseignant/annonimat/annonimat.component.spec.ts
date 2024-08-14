import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnonimatComponent } from './annonimat.component';

describe('AnnonimatComponent', () => {
  let component: AnnonimatComponent;
  let fixture: ComponentFixture<AnnonimatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnonimatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnonimatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
