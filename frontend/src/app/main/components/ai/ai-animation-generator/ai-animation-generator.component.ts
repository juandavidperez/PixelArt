import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, timer } from 'rxjs'; // Import 'of' and 'timer' for mocking
import { delay, switchMap } from 'rxjs/operators'; // Import operators if using timer/delay
import { ChangeDetectorRef, NgZone } from '@angular/core'; // Add ChangeDetectorRef and NgZone
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'; // Import SafeUrl
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';

const MOCK_ANIMATION_RESPONSE = {
  "imageUrl": "data:image/gif;base64,R0lGODlhQABAAPcAABQRFBQRFRQSFRQSFRUSFRYSFRcTFRcTFRgUFhgUFxgVFxgVGBgVGBgVGBcWGBYXGRYXGRYXGRcXGRcWGhgWGhgWGxgXHBgXHBkXHRoYHRoZHRsZHBwZHB0aHB4aHR4bHR8bHR8cHSAcHiAcHiEdHyEeICEfISIgISIhIiIhIyMiJCMjJSMjJSMkJiQkJyQkKCMkKSQkKiQlKiQlKyUmKyUmKyYmKyYnLCcnLCcoLSgpLSkpLioqLyssMCwtMS4vMzAxNTEzNjM0NzU2OTc4Ojk6PDs8Pj4/QEFBQkRERUdHSExMTE9OT1FRUlNSVFZVWFhXW1pZXltbYF1dYl5eY19fZV9fZmBgZ2FhaGFhaWFiaWJiamJia2Jja2JjbGJkbGJkbWNkbmNlbmNlb2NlcGNmcWNmcWNncmNoc2Roc2Roc2RodGRodGVpdGVpdGVpdGZqdGZqdGdqdGhrdW1sc3Ftb3ZubX5waYVyZot0Y5F1YJV2Xpl3XJx4W595WaF5WKV5VKZ4Tqd3S6h2SKh1R6h1Rql0Rqp2R6t4SKx6Sq58Tq5+Ua+AVq+DW6+EXbCGX7CIYbCKZLGMaLGOa7CPba+Pb62TeqyWg6qYi6mclKiem6igoKiipKikqKmlq6qnrqypsa6stLCvt7GvuLOwuLOxuLSyubWzurW0u7W1u7W2vLW3vba3vba4vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbi6vri5vbi6vri6vbi6vbi6vbi6vri6vri6vri6vri6vri6vri6vri6vri6vri6vri6vri6vri6vri6vri6vri6vri6vri6vri6vri6vri6vri6vri6vri6vri6v7m8wLzAyMDG0MLI08bLzMrNws7QtdLTrtXVptjXn9vZmd7ckuHejOTdf+fcdOnca+rUXOrOUurKTOrIR+rEROzKQ+/NR/DOTPHRVPLYZvPgfPTolfPsqfPwvvP10vL12vH04PDz5fDz6O/z6u/07O/27u738e738u738iH/C05FVFNDQVBFMi4wAwEAAAAh+QQACgAAACwAAAAAQABAAAAI/gCRCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIMWEAAh1DCkzQbh0AkRwRrEu0bh0ClBoDrDNkaF0CmBll0lS0jgJOizppImJ386dEAgnWEaFJ06bRiCrXnTCEiGdLl08bUiDBbp0iACQIZKAQIMO6DFkZImBHAkEJROjw/fP3D0aABAHSKqRwdV27c6VatcqmTx9dAiT0IgzAmDGMIZDpeAolKpu2sQhAKj4YoJRnT2ukZFljZ1Mobdqw5d1cMEEpUaLutGhRokQGHTVIbGVt0PVrCpWCW7KU4CXvgxk8fwIunPhxhBQ8fbIDPIKGSpZWPy9Igc4mOwks/jX3ub1ggCZ07GRoXkl7+YEEKLTAExx7E+PvBwaAAYDOlvqJ5TdQAjXAUEMGW9ghRQkCDkTBDjVEWMIRmnhGnoAPGljgFnSUko0GDQLQQoERtgDDFjvsUNR7EdwTAQURwmDiiXTQceF2APjjz34RxhjjSe8R4Jc7JNQwYo8FuveckC0VWYMO3XBDSpL5RfDPlRkgiZuRK24XAV3+ZIlkjEoeR8A2c0VAIpJ2CZgAPv4QONtsNZTQ5XsBIBDBXQD0EEQQPQDZYAD1tNPOPwBkkEECd76XQDwlrfNPSdrg16AG/mjzj1/rHGKpm1f649cd25Tp6JX/UKAEIds0+h4CpzWtEwAUhjRxY5WMeEVOBoEsEmeDAgUw15VfXmnqdgGASQKmOh5rJhT36JhABtpI2yABeDClTQA9KCHIVw1SwIghhGR3Xh6HOIWhON7Q001x43wjzje3PocAHnjkkQcCFODRRL5OOLtZAEwZ4lPBhpTAb5DkHkKIwRQY4jAhhBxiiMBZEVDxIRxbTIDDHXuKJwFIIcAvvwTkmeenwLbs8sswxyyzQgEBACH5BAAKAAAALAAAAABAAEAAhxAOFBEPFREPFREPFhIQFhIQFhIQFhIQFhIQFxMQFxMQFxMQFxMQFxMRFxQRFxQSGBUTGBYTGBYUGBYVGRYVGRcVGRgVGRgWGhkXGxkXHBkYHhoYHxoZHxsZIBsaIBwaIR0aIR0bIh4cIh8cIiAcIiEeJCEgJiEhJyEiKCUkKSspLDItLjs0MUs9MmVLNnZWO4pkQJNuSp93UKp/V6mDYaqJbayPeKiVhqmZkqudmK2inq+no7GqprKtqrWxsLe1tre3u7e4vLe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbi5vbi5vbi5vbi5vbi5vbi5vbi5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbi5vbi5vbi5vbi5vbi5vbi5vbi5vbi5vbi5vbi5vbi5vbi5vbi5vbi5vbi5vbi5vbi5vbi5vbi6vri6vrm6wLm6wrm6w76+yMLCzsbG08jJ1svL2c7P3NHT39TW4tjb5Nvd593f6t/h7OHj7uPk8OXm8ufo9Onp9uzs+e3t+/Du+/Pv+vTw+vXx+vXw+vXv+fXu9/Xu9vbu9fbu8/bu8vbu7/bu6/bu5vbv3/bv1fbvx/bwtPbwp/bwlvfvivfvf/jucfjtY/nsX/rsXPvrWfvqV/vpVfvmT/rlTfvnT/zqVfzrVv3tWP3uWv3wXP3xYP3zZP70aQj+AIMJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8eIEiR89HjBnj2RIzdKMHkyZcaSMWC0dGlxZcwYM2bSlNhgJYyfMlHufCgBgEkYMX/qHMqQwlEZM37GwGnvAlOGRu3BAACgQQMAEmDIWHrVYAOTLFjsYOEMG7QfCRIAKKvQKNQZNJAVI/YMmzVr2Eh8oIuQa9wLDVK4wAGksbFnz0gQVkihR7EYLVy4uMHYWLULoCcblNDjBxAcLz58MLGYB7FiVkUTJN3YxgcaNmxc2LA7tuyBEngUA7Khxo8bN3Y0+H1QwuIbG3aoSJF7OXODCZBHd8Ei94bro1f+tNiQu/x38LN517Bxo3wC9OkvqGgBwwYNGu/hA0iA4kQKHTrgQEICGcAXDADTpXDCCTg0CIRv4CWQwoQKnsADgDwMeNAHu5X1AQn+TeifCjz8QEwKKuQ3EAnWbGPNeTtJgM4JIIo4oQqaUaiiBC1usw2MLlGQjkkkkFBhiBUqiMIGG5DwzAvYYFMNkCl9sM4Mx5BwgX8nuJAghQr65cI2L2zTzGA7beDjNpJdYCSKxRQj4oIk+NjCNi48A6FLG4SzDTYoBCMhmNPRiAIAFGBzjQrdFHkVCSY5M9gFYFJ4QgP5NSkBlTslgM2fgQ5a6QdCybZBNz5ik8EFKBy5oIrqv12AqotFkoCBCy3kuoJ1zG3gDDjbMHMBBeEYo9oHG8SF3gbWPMNbAiy90449nP6mpUAlbXONPfe8s6eBDVyDjT3veGtgQR+UIMOQ9lBw7kANHAPAWDa4WO11JMhwjAQmrGmNZAZKMIO2JGwAzjXXHHOvbGdd80wJGazA0sKESfBCCfbMEEM0GbxwF8VlWQyDC9AARkJYd8H6mwQyyAADCyWIJPILL3wrGsszyNBCgcGE9dMLKssmcM4A9xxDyy2XKjQMOe+INNI2EzavDL5dcHTLR0dNWAISQBhXSBIE/e7YZJdt9tloDxQQACH5BAAKAAAALAAAAABAAEAAhxIQDRMRDhQSDxUSEBYSERYTERcTERcTEhcTEhgTEhgTExgTExgTExgTExgTFBgTFBgTFBgTFBgTFBgTFRcTFRcSFRYSFRYSFRYSFhUSFhUSFhURFhQRFhQRFhQRFhMRFhMRFhMQFhMQFhMQFhMQFhIQFhIRFhIRFhERGBERFxESFxESFxETFxETFxEUFxIVGBMVGBQXGRUXGhcZHBgaHBobHRscHhwdHx0fIB4gIR4hIh8iIx8jJSAjJiAkJiElJyImJyQoKSYqKygsLCsuLy4xMjI0NTQ2ODc5Ozs9PkBBQkNDRUZHR0pKSk5OTlBQUVJSVFRVV1VXWldZXVlaX1pcYVtdY1xfZV1gZ15haV9ial9ja2BjbWFkbmFlb2Flb2JmcGJmcWJmcWNncmNncmNncmNnc2Nnc2Noc2Roc2Roc2RodGRodGVpdGVpdGVpdGZqdGZqdGdqdGhrdWhsdW5tc3JucHZwbnpxbH1ya4BzaoV0Z4l1Zo13Y4t4Z4t5aol7b4p9cYp/dYmAeIiCfIeEgYaGhoeHh4iIiYmKi4qLjYuMj4yNkY2Oko6Pk46PlJCRlpKTmJOUmZWWm5eYnZiZn5qboJucop2eo6ChpaKjqKWmq6iprqqrsayts62tta6utq+vt7CxuLGyuLKzubK0urO1urW2u7a4vLe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbe5vbi6vri5vbi6vri6vbi6vri6vbi6vri6vri6vri6vri6vri6vri6vri6vri6vri6vri6vri6vri6vri6vrm6vru7v728wL68wL+9wMC9wMG9wcG9wcK+wcK+wcO+wcO+wsS/wsbBxMrFx8/JzNPNz9TO0NTP0dXR0tbS09jT1dnV1tvX2NzZ2t7c3eHf3+Pi4ubl5enp6erq6uvr6+zs7O3t7e7u7u/v8PDy8vDz9PL18/T18fX27/b37vj47Pn56vr66Pv75/z85vz85v395f395f7+5f//5gj+AIcJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mgx4YgBHUMKdCFu2wiRHCdo64PNJEqNI0b1YeniZcaYM/tsm2HT4gBsTXJuq9lT4gAA1o7k7KMtRtGIMUptK7J0ZimnTxvSwDZzwIQYMVygGIviRlaGLrCNwNEHnbt45dzly4dvBsizCV2I6mNN3DdRoUSh4hRK21sXMUYAwGtwBFkaSiLXiRQpE6fL2zItI8q4oItqokRlWiMly5o6hiKhOoK1s2fAnAzlwIHjxgwgOU66PugiVChOLgIJz5RpROvdBUf45hQDE3HiKJAjjGHZUPMYMwJlOi594IjJhlz+ZBqeKXr3ghNu1CkUPJPzQNzPDwMLxFAgTNr7TJDveQgKLVII50d88gHQwxA0GFKIFnfxR5ALQwAxgxaGiGKegwJNMMSGQOAwQwwNYhgDEBGSCEQPBJ43Qg9AuADEiyfqhuEIJ7pYIhAyOjjAizaWmCN/A9DjTg5D9JBNEThiONJbNnAYIU9KBplPkxH20MOP8rlATzxNwsjZjPTkg8KGG2IpXwxhojNmhCl2NwM8+cSD3Qw4mKniDPiYE4M6iCk50AA4oGADOPl8GaUm1biDDj1tyjfCCPH8Mw6Ufgo0wA19mHNPo+dNcMQefLhzYaUx9MEHH/GM6mcMkaQzl6FKfs4wgzmFVjrQBOOEc8NitlrKjTnxeBKinwP08cc22sCKIQB7QHHEEXYCOdMeM6m6bFXK8jdCVfvZOoILj37Eaa/klmvuuejuFhAAIfkEAAoAAAAsAAAAAEAAQACHGRQWGBQXFxQXFhMXFhMXFhMXFhQYFxQYFxUZGBUZGBYZGBYaGBYaGBcbGBcbGBccGRcbGRgbGRgbGhkbGxkbHBobHBsbHhwbIBwaIRwaIh0aIh0aIx0aJB0aIx0aIx0aIh0bIR0cIB0dHx0eHR0fHR0gHB0hHB0iHB0iHB4jHB4kGx4lGx8mGh8nGh8nGh8oGh8oGyAoGyAoHCApHCApHSApHiEqHyIqHyIqICMqIiQrIyUrJCUsJScuJygvKCkwKioxLCwyLi4zMDA1MzM3NzY6Ozs+QUFCRENERkZHSkpKS0tLTktKVUxIWkxHX01GY01FZk1EaE5Da05Dbk9Cc1FCeVNBflVBgldBhllBiVtBjV1CkmBDlmNEmGREmmVDm2ZDnGZDnmdDn2hDoGlDoWlDompDo2tDpGtDpGxEpGxEpG1EpW1EpW1FpW5Fpm9Fpm9Gp3BGp3BGp3BHp3FHp3FHp3FHp3FHp3FHpnFIpnFIpnFJpXFJpXFKpHJLo3JMo3JNonNPoXRRn3RUnnVWoXlbonxgpH5kpIFppINtooVyoIh4nol8m4uBmI2GlZSQlJWWlpiamZuem52hnaCkn6KnoaSpoqaspKiupquyqa61q7C4rbK6rrS8r7W+sLa/sLbAsbfBsbjBsrjCsrjCsrjCsrrAs7y/s76+s7+9s8K8tcW6tce4tse4tsi4tsW5t8K6t7+7t7y8t7q9t7q9t7q9t7q9t7q9t7q9t7q9t7q9t7q9t7q9t7q9t7q9t7q9t7q9t7q9t7q9t7q9t7q9t7q9t7q9uLq+uLq+uLq+uLq+uLq+uLq+uLq+uLq+uLq+uLq+uLq+uLq+uLq+uLu/ub/CusHEu8PGvMbIwczLxtPOzNnS0NzW0tzY1d3d2d/e3eLh4OXj4eXj4ebk4ufk4ujl4+jm4+jm5Onn5enn5ero5uvp5+vp6Ozq6e3r6+7s7e/u7vDv8PHy8/Pz9PT09fX19vb29/f3+Pj4+fn5+vr6+/v7/Pz8/f39/v7+////CP4AjwkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbJkRxAKFJikaKKESzx4BqyMaAImTCJ4VM50qOCBlx0dOhAZmnLnwpobNtjE44WIhZxGEwrA8wCPIEEdYCKxKSCqQaVK9YhNAQDPIqxKdXo9VqJFiwFw4T6IO0ABzAdrjz34du4bX7+A/34zQRiv1wfbsilezLhxtm2Go5rIRqoyKVSVMaPajAobthJqo/acUeTHjyFDTqc+DSJyXr2KTPyIxYmTJSuFCpl4XVABoh07Yq06hMjKoUOuefsudEj4cePIeRNUwPzQIk2HCk3Jnpx3ieqHBv49eTLFiHSDIIx4obJjyxYb5w0qsKQglqYNnB7sjk+wkglEimAyAxE8zLBffAD4V8ggNhTIgw02hMYbALG0AOEONpgAoQ07yHSeAj9AqJ8NBipAYndrmQjhDBC2MCKEEqYIoQk7mMCDNgZqaAOKoj1IYjv02BCiCS3M0AIIeSkAgAIa+vgDixjOsM8+/LSQIiKIzKEADz5uuCOV/PADn1fUAYKFiQ9y+SCR/EwJD48lAQDIHFyAuJppP1Clzj7yHEgmCBs80M6g98QDDh5dPZBhfA/cAw8/VtzTzjlW8ifQBlBAYQU98HSzg6UCmQDPPvC0A882PwBgqQIl3OPKq7KvdrBFLHAapYA258BKjysbbDGHKzHutCQIAIRhBTyvnoMSCHPQCU+wJtm1VBbdPLKNTgA8gsYcz6aIhxng4pHFNq6oOpAJ26IBTq0ibdAFuGbgQUU3rhQ0QLNofHOtVwBsYdMWHZhLkKC5ArtWr+CGITBBADhhRRZddLGwsFuYsUWwAEyBxbvfbpBiUQghbNPECIbxbbxhIAmqCXp8e3KdoB6T0swzx2zzzTjnrPPOBAUEADs="
};
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
    imports: [
      ReactiveFormsModule, 
      HttpClientModule, 
      BrowserAnimationsModule,
      CommonModule, 
      CardModule,
      FormsModule
    ],
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
  resultUrl: SafeUrl | null = null; 
  private rawResultUrl: string | null = null;
  showAdvancedOptions = false;
  private useMockData = false;
  constructor(private fb: FormBuilder, private http: HttpClient,
    private cdr: ChangeDetectorRef, // Inject ChangeDetectorRef
    private ngZone: NgZone,
    private sanitizer: DomSanitizer 
  ) {
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
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      console.log('Image loaded, base64 length:', base64.length);
      
      this.animationForm.patchValue({
        reference_image: {
            type: 'base64',
            base64: base64
          }
        });
        console.log('Form updated with reference image');
      };
      reader.readAsDataURL(file);
    }
  }

  toggleAdvancedOptions() {
    this.showAdvancedOptions = !this.showAdvancedOptions;
  }
 
 
  private base64ToBlobUrl(base64Data: string, contentType: string = 'image/gif'): SafeUrl | null {
    try {
      const base64String = base64Data.split(',')[1] || base64Data;
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: contentType });
      const blobUrl = URL.createObjectURL(blob);

      this.revokePreviousUrl(); 
      this.rawResultUrl = blobUrl;

      
      return this.sanitizer.bypassSecurityTrustUrl(blobUrl);
    } catch (error) {
      console.error("Error converting base64 to Blob URL:", error);
      this.error = "Failed to process generated animation data.";
      return null;
    }
  }


  private revokePreviousUrl() {
      if (this.rawResultUrl) {
          URL.revokeObjectURL(this.rawResultUrl);
          this.rawResultUrl = null;
          console.log('Revoked previous Blob URL');
      }
  }

  submit() {
    console.log('--- Submit triggered ---'); 
    console.log('Form valid:', !this.animationForm.invalid); 
     // Check validity
     if (!this.animationForm.valid) { // Check using .valid
      console.error('Form is invalid. Checking control statuses...');

      // Log status and errors for each control to find the culprit
      Object.keys(this.animationForm.controls).forEach(key => {
        const control = this.animationForm.get(key);
        if (control) { // Check if control exists
            console.log(`Control '${key}' status: ${control.status}`, // Log status
                        ` | Valid: ${control.valid}`,
                        ` | Touched: ${control.touched}`,
                        ` | Dirty: ${control.dirty}`);
            if (control.invalid) {
                console.error(`---> Control '${key}' IS INVALID. Value:`, control.value, ' Errors:', control.errors);
            }
        } else {
            console.warn(`Control '${key}' not found in form group.`);
        }
      });

      this.animationForm.markAllAsTouched(); // Mark all as touched to show potential UI errors
      this.error = 'Please fix the errors in the form before submitting.'; // Provide user feedback
      this.loading = false;
      return;
    }

    // --- If the form IS valid, proceed ---
    console.log('Form is valid, proceeding with submission.');
    this.loading = true;
    this.error = null;
    this.resultUrl = null;
    const form = this.animationForm.value; // Use .value for valid form

    console.log('Form values before payload creation:', form);
    console.log('Current useMockData:', this.useMockData);
    
    if (!form.reference_image && !this.useMockData) { 
        console.error('Reference image is required for actual generation.'); 
        this.error = 'Reference image is required for actual generation.';
        this.loading = false;
        return;
    }
     
    if (!form.reference_image && this.useMockData) {
         console.warn('Reference image missing, but using mock data. Ensure payload structure is okay if image is expected.');
         
    }


    const payload: PixelLabAnimationRequest = {
      description: form.description || '',
      action: form.action || '',
      image_size: { width: form.width || 64, height: form.height || 64 },
      
      ...(form.reference_image && { reference_image: form.reference_image }),
      negative_description: form.negative_description || 'blurry, dithering',
      text_guidance_scale: form.text_guidance_scale || 8.0,
      image_guidance_scale: form.image_guidance_scale || 1.4,
      n_frames: form.n_frames || 4,
      start_frame_index: form.start_frame_index || 0,
      view: form.view || 'side',
      direction: form.direction || 'east',
      init_image_strength: form.init_image_strength || 300,
    };

    // --- Corrected Mock Data Logic ---
    if (this.useMockData) {
      console.log('--- Using Mock Data ---');
      console.log('Setting up mock timer...');
      timer(500).subscribe(() => {
        this.ngZone.run(() => { // Use ngZone.run
          console.log('--- Mock Timer Fired (inside ngZone.run) ---');
          this.resultUrl = this.base64ToBlobUrl(MOCK_ANIMATION_RESPONSE.imageUrl);
          console.log('Mock resultUrl set.');
          this.loading = false; // Loading becomes false
          console.log('Mock loading set to false.');
          this.error = null;

          // *** ADD THIS LINE ***
          console.log('Triggering Change Detection in Child');
          this.cdr.detectChanges(); // Tell Angular to check this component
        });
      });
      console.log('Mock timer subscription setup complete.');

    } else { 

      // --- Actual HTTP Request Logic ---
      console.log('--- Making Real API Call ---'); 
      console.log('Sending animation request payload:', payload);

      
      if (!payload.reference_image) {
          console.error('Reference image is missing for API request.');
          this.error = 'Reference image is missing for API request.';
          this.loading = false;
          return;
      }

      console.log('Calling http.post...'); 
      
      this.http.post<any>('http://localhost:4002/api/images/generate-animation', payload)
        .subscribe({
          next: (res) => {
            console.log('--- Real API Response received (next block) ---', res); 
            let base64String: string | null = null;
            if (res && res.animated_image_base64) {
              base64String = 'data:image/gif;base64,' + res.animated_image_base64;
              console.log('Using animated_image_base64');
            } else if (res && res.imageUrl && res.imageUrl.startsWith('data:image/')) {
               // Assuming imageUrl might also be a data URL
              base64String = res.imageUrl;
              console.log('Using imageUrl (as data URL)');
            } else if (res && res.url && !res.url.startsWith('data:image/')) {
               console.log('Received a direct URL, attempting to use directly (will not be Blob):', res.url);
               // If the API can return a direct URL (not base64)
               this.revokePreviousUrl(); // Clean up any previous blob
               this.resultUrl = this.sanitizer.bypassSecurityTrustUrl(res.url);
               this.rawResultUrl = null; // Not a blob url we created
            } else {
              console.warn('Response received, but no expected animation data found.', res);
              this.error = 'No animation data found in the response.';
            }

            if (base64String && !this.resultUrl) { // Only convert if we haven't set a direct URL
              this.resultUrl = this.base64ToBlobUrl(base64String);
               if (this.resultUrl) {
                   console.log('Real API Blob URL created and sanitized.');
               } else {
                   console.error('Failed to create Blob URL from API response.');
               }
            }

            this.loading = false; 
            console.log('Real API loading set to false in NEXT block.'); 
          },
          error: (err) => {
            console.error('--- Real API Error occurred (error block) ---', err); 
            this.error = `Error generating animation: ${err.message || 'Unknown server error'}`;
            if (err.error && typeof err.error === 'string') {
                this.error += ` (Server: ${err.error})`;
            } else if (err.error && err.error.message) {
                 this.error += ` (Server: ${err.error.message})`;
            }
            this.revokePreviousUrl(); // Clean up on error too
            this.loading = false;
            console.log('Real API loading set to false in ERROR block.');
            this.cdr.detectChanges(); 
          },
          complete: () => {
            console.log('--- Real API Call Observable Completed ---'); 
          }
        });
        console.log('Real http.post subscription setup complete.'); 

    } 

    console.log('--- Submit function end ---'); 
  }

  clearResult() {
    this.revokePreviousUrl(); // Revoke the URL when clearing
    this.resultUrl = null;
    this.error = null;
  }
}