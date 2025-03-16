import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiImageGeneratorComponent } from './ai-image-generator.component';

describe('AiImageGeneratorComponent', () => {
  let component: AiImageGeneratorComponent;
  let fixture: ComponentFixture<AiImageGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        AiImageGeneratorComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AiImageGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
