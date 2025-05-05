import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditImageComponent } from './edit-image.component';

describe('EditImageComponent', () => {
  let component: EditImageComponent;
  let fixture: ComponentFixture<EditImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
