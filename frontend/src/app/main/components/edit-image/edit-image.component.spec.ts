import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageEditorComponent } from './edit-image.component';

describe('EditImageComponent', () => {
  let component: ImageEditorComponent;
  let fixture: ComponentFixture<ImageEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
