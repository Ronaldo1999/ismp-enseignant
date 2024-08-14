import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoteSyntheseComponent } from './notesynthese.component';


describe('SyntheseComponent', () => {
  let component: NoteSyntheseComponent;
  let fixture: ComponentFixture<NoteSyntheseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoteSyntheseComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NoteSyntheseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
