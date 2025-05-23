import {CommonModule, NgIf} from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {TokenUserService} from "../../../shared/services/tokenUser/token-user.service";
import {Router} from "@angular/router";
import {PixelArtService} from "../../../shared/services/pixelArt/pixel-art.service";
import {UsersService} from "../../../shared/services/users/users.service";
import { AiImageGeneratorComponent } from "../ai/ai-image-generator.component";
import { EditImageComponent } from '../edit-image/edit-image.component';
import { AiAnimationGeneratorComponent } from '../ai/ai-animation-generator/ai-animation-generator.component';
import { NgSwitch, NgSwitchCase } from '@angular/common';

@Component({
    selector: 'app-draw',
    templateUrl: './draw.component.html',
    styleUrls: ['./draw.component.css'],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      NgIf,
      AiImageGeneratorComponent,
      EditImageComponent,
      AiAnimationGeneratorComponent,

],
    providers: [PixelArtService, UsersService],

})

export class DrawComponent implements OnInit{

  showAITools = false;
  activeAITab: 'image' | 'animation' = 'image';


  toggleAITools() {
    console.log('--- toggleAITools called ---'); // <-- ADD THIS
    this.showAITools = !this.showAITools;
    console.log('showAITools is now:', this.showAITools); // <-- ADD THIS
    // Keep markForCheck for now, or try detectChanges later
    this.cd.detectChanges();
  }


  setActiveTab(tab: 'image' | 'animation') {
    console.log('--- setActiveTab called with:', tab); // <-- ADD THIS
    this.activeAITab = tab;
    // Keep markForCheck for now, or try detectChanges later
    this.cd.detectChanges();
  }



  constructor(private fb: FormBuilder,
              protected token: TokenUserService,
              private router: Router ,
              private pixelArtService: PixelArtService,
              protected usersService: UsersService,
              private cd: ChangeDetectorRef) {

    this.initializePixelData(this.canvasWidth, this.canvasHeight);

    this.pixelSize = this.fb.group({
      width: [this.canvasWidth, Validators.required],
      height: [this.canvasHeight, Validators.required]
    });

    this.formPostArt = this.fb.group({
      image: [null, Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  navigateToMain() {
    this.router.navigate(['/main'], { skipLocationChange: false }).then(() => {
      window.location.reload();
    });
  }

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  isVisibleView = false;
  selectedColor: string = '#000000';
  isDrawing: boolean = false;
  pixelData: string[][] = [];
  canvasWidth: number = 64;
  canvasHeight: number = 64;
  brushSize: number = 1;
  isBucketActive: boolean = false;
  isAuthenticated: boolean = false;
  previewImageUrl: string | null = null;
  formPostArt: FormGroup;
  pixelSize: FormGroup;
  user: any = [];
  displayWidth: number = 540;
  displayHeight: number = 540;
  scaleFactor: number = 5;


  ngOnInit() {
    this.openPostModal()
    this.setupCanvas();
    this.isAuthenticated = this.token.isAuthenticated();
    this.applyCanvasScaling();


  }

  triggerChangeDetection() {
    this.cd.detectChanges();
  }

  saveCanvasAsPNG() {
    if (!this.canvas || !this.ctx) {
      console.error("El lienzo o el contexto no están definidos.");
      return;
    }

    const imageDataUrl = this.canvas.nativeElement.toDataURL("image/png");

    const downloadLink = document.createElement("a");
    downloadLink.href = imageDataUrl;
    downloadLink.download = "pixel_art.png";

    downloadLink.click();
  }

  setupCanvas() {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.applyCanvasScaling();
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.canvas.nativeElement.addEventListener('mousedown', (event) => this.startDrawing(event));
    this.canvas.nativeElement.addEventListener('mousemove', (event) => this.draw(event));
    this.canvas.nativeElement.addEventListener('mouseup', () => this.stopDrawing());
    this.canvas.nativeElement.addEventListener('mouseout', () => this.stopDrawing());
  }

  applyCanvasScaling() {
    this.canvas.nativeElement.width = this.canvasWidth;
    this.canvas.nativeElement.height = this.canvasHeight;
    this.canvas.nativeElement.style.width = `${this.displayWidth}px`;
    this.canvas.nativeElement.style.height = `${this.displayHeight}px`;
  }

  initializePixelData(width: number, height: number) {
    const rows = Math.ceil(height / this.brushSize);
    const cols = Math.ceil(width / this.brushSize);
    this.pixelData = Array.from({ length: rows }, () => Array(cols).fill('transparent'));
  }

  startDrawing(event: MouseEvent) {
    if (this.isBucketActive) {
      this.fillWithBucket(event);
    } else {
      this.isDrawing = true;
      this.draw(event);
    }
  }

  draw(event: MouseEvent) {
    if (!this.isDrawing) return;

    const rect = this.canvas.nativeElement.getBoundingClientRect();


    const scaleX = this.canvasWidth / rect.width;
    const scaleY = this.canvasHeight / rect.height;

    const x = Math.floor((event.clientX - rect.left) * scaleX / this.brushSize) * this.brushSize;
    const y = Math.floor((event.clientY - rect.top) * scaleY / this.brushSize) * this.brushSize;

    if (this.selectedColor === 'transparent') {
      this.erase(x, y);
    } else {
      this.fillPixel(x, y);
    }
  }

  fillPixel(x: number, y: number) {
    this.ctx.fillStyle = this.selectedColor;
    this.ctx.fillRect(x, y, this.brushSize, this.brushSize);
    this.updatePixelData(x, y, this.selectedColor);
  }

  erase(x: number, y: number) {
    this.ctx.clearRect(x, y, this.brushSize, this.brushSize);
    this.updatePixelData(x, y, 'transparent');
  }

  updatePixelData(x: number, y: number, color: string) {
    this.pixelData[Math.floor(y / this.brushSize)][Math.floor(x / this.brushSize)] = color;
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.initializePixelData(this.canvasWidth, this.canvasHeight);
  }

  activateEraser() {
    this.selectedColor = 'transparent';
  }

  deactivateEraser(originalColor: string) {
    this.selectedColor = originalColor;
  }

  activateBucket() {
    this.isBucketActive = true;
  }

  getPixelColor(x: number, y: number): string {
    const pixel = this.ctx.getImageData(x, y, 1, 1).data;
    return `rgba(${pixel[0]},${pixel[1]},${pixel[2]},${pixel[3] / 255})`;
  }

  fillWithBucket(event: MouseEvent) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();


    const scaleX = this.canvasWidth / rect.width;
    const scaleY = this.canvasHeight / rect.height;

    const x = Math.floor((event.clientX - rect.left) * scaleX / this.brushSize) * this.brushSize;
    const y = Math.floor((event.clientY - rect.top) * scaleY / this.brushSize) * this.brushSize;

    const startColor = this.getPixelColor(x, y);
    if (startColor === this.selectedColor) return;

    this.recursiveFloodFill(x, y, startColor, this.selectedColor);
    this.isBucketActive = false;
  }

  recursiveFloodFill(x: number, y: number, startColor: string, fillColor: string) {
    if (x < 0 || y < 0 || x >= this.canvasWidth || y >= this.canvasHeight) return;

    const currentColor = this.getPixelColor(x, y);

    if (currentColor !== startColor || currentColor === fillColor) return;

    this.fillPixel(x, y);

    this.recursiveFloodFill(x + this.brushSize, y, startColor, fillColor); // Derecha
    this.recursiveFloodFill(x - this.brushSize, y, startColor, fillColor); // Izquierda
    this.recursiveFloodFill(x, y + this.brushSize, startColor, fillColor); // Abajo
    this.recursiveFloodFill(x, y - this.brushSize, startColor, fillColor); // Arriba
  }


  openPostModal(): void {
    this.triggerChangeDetection();
    const canvasElement = this.canvas.nativeElement;

    canvasElement.toBlob((blob) => {
      if (blob) {
        this.formPostArt.patchValue({ image: blob });
        this.previewImageUrl = URL.createObjectURL(blob);
      } else {
        console.error('No se pudo convertir el canvas a Blob.');
      }
    }, 'image/png');
  }


  postArt(): void {
    const dataName = localStorage.getItem('userId');
    console.log('ID del usuario:', dataName);

    if (!dataName) {
      console.error('ID de usuario no encontrado.');
      return;
    }

    this.usersService.getUserByUsername(dataName).subscribe(
      (data) => {
        this.user = data;
        console.log(this.user);

        const idData = this.user.id;

        console.log('ID del usuario:', idData);

        const formData = new FormData();
        formData.append('image', this.formPostArt.value.image);
        formData.append('title', this.formPostArt.value.title);
        formData.append('description', this.formPostArt.value.description);
        formData.append('userId', idData);

        console.log('Imagen seleccionada:', this.formPostArt.value.image);

        this.pixelArtService.saveArt(formData).subscribe({
          next: () => {
            console.log('Arte publicado con éxito');
            this.router.navigate(['/main']);
          },
          error: (err) => console.error('Error al publicar:', err),
        });
      },
      error => {
        console.error("Error al cargar datos del usuario:", error);
      }
    );

    alert("¡Dibujo guardado con exito!")
  }

  changeBrushSize(size: number) {
    this.brushSize = size;
  }

  viewModal(): void {
    this.isVisibleView = true;
  }

  handleOkRegister(): void {
    this.router.navigate(['/login']);
    this.isVisibleView = false;
  }


}
