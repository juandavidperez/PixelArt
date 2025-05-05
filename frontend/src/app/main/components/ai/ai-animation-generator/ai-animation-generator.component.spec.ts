import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAnimationGeneratorComponent } from './ai-animation-generator.component';

describe('AiAnimationGeneratorComponent', () => {
  let component: AiAnimationGeneratorComponent;
  let fixture: ComponentFixture<AiAnimationGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiAnimationGeneratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiAnimationGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
