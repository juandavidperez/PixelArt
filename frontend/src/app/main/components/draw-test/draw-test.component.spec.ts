import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawTestComponent } from './draw-test.component';

describe('DrawTestComponent', () => {
  let component: DrawTestComponent;
  let fixture: ComponentFixture<DrawTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
