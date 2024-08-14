import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudihomeworksComponent } from './audihomeworks.component';

describe('AudihomeworksComponent', () => {
  let component: AudihomeworksComponent;
  let fixture: ComponentFixture<AudihomeworksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudihomeworksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudihomeworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
