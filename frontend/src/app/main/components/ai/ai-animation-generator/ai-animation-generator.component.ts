import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
interface ImageSize {
  width: number;
  height: number;
}

interface Base64Image {
  type: string;
  base64: string;
}

interface PixelLabAnimationRequest {
  description: string;
  action: string;
  image_size: ImageSize;
  reference_image?: Base64Image;
  negative_description?: string;
  text_guidance_scale?: number;
  image_guidance_scale?: number;
  n_frames?: number;
  start_frame_index?: number;
  view?: string;
  direction?: string;
  init_images?: Base64Image[];
  init_image_strength?: number;
}

@Component({
    standalone: true,
    selector: 'app-ai-animation-generator',
    templateUrl: './ai-animation-generator.component.html',
    styleUrls: ['./ai-animation-generator.component.css'],
    imports: [ReactiveFormsModule, CommonModule, HttpClientModule, BrowserAnimationsModule],
    animations: [
      trigger('expandCollapse', [
        state('collapsed', style({
          height: '0',
          overflow: 'hidden',
          opacity: 0
        })),
        state('expanded', style({
          height: '*',
          opacity: 1
        })),
        transition('collapsed <=> expanded', [
          animate('200ms ease-in-out')
        ])
      ])
    ]
})
export class AiAnimationGeneratorComponent {
  animationForm: FormGroup;
  loading = false;
  error: string | null = null;
  resultUrl: string | null = null;
  showAdvancedOptions = false;
  
  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.animationForm = this.fb.group({
      description: [''],
      action: [''],
      width: [64],
      height: [64],
      n_frames: [4],
      view: ['side'],
      direction: ['east'],
      reference_image: [null],
      negative_description: ['blurry, dithering'],
      text_guidance_scale: [8.0],
      image_guidance_scale: [1.4],
      start_frame_index: [0],
      init_image_strength: [300],
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.animationForm.patchValue({
          reference_image: {
            type: 'base64',
            base64: (reader.result as string).split(',')[1]
          }
        });
      };
      reader.readAsDataURL(file);
    }
  }

  toggleAdvancedOptions() {
    this.showAdvancedOptions = !this.showAdvancedOptions;
  }

  submit() {
    if (this.animationForm.invalid) return;
    this.loading = true;
    this.error = null;
    this.resultUrl = null;
    const form = this.animationForm.value;
    const payload: PixelLabAnimationRequest = {
      description: form.description,
      action: form.action,
      image_size: { width: form.width, height: form.height },
      reference_image: form.reference_image,
      negative_description: form.negative_description,
      text_guidance_scale: form.text_guidance_scale,
      image_guidance_scale: form.image_guidance_scale,
      n_frames: form.n_frames,
      start_frame_index: form.start_frame_index,
      view: form.view,
      direction: form.direction,
      init_image_strength: form.init_image_strength,
    };

    this.http.post<any>('http://localhost:8080/api/ai/animation', payload)
      .subscribe({
        next: (res) => {
          if (res && res.animated_image_base64) {
            this.resultUrl = 'data:image/gif;base64,' + res.animated_image_base64;
          } else if (res && res.url) {
            this.resultUrl = res.url;
          } else {
            this.error = 'No animation received.';
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error generating animation.';
          this.loading = false;
        }
      });
  }

  clearResult() {
    this.resultUrl = null;
    this.error = null;
  }
}