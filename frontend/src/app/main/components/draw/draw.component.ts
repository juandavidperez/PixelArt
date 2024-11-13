import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.css'],
  imports: [
    NgOptimizedImage ,
    FormsModule, 
    ReactiveFormsModule
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DrawComponent {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  selectedColor: string = '#000000';
  isDrawing: boolean = false;
  pixelData: string[][] = [];
  pixelSize: FormGroup;
  canvasWidth: number = 600;
  canvasHeight: number = 600;
  private imageData!: ImageData;
  brushSize: number = 10; 
  isBucketActive: boolean = false; 

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
    this.pixelSize = this.fb.group({
      width: [this.canvasWidth, Validators.required],
      height: [this.canvasHeight, Validators.required]
    });

    this.initializePixelData(this.canvasWidth, this.canvasHeight);
  }

  ngOnInit() {
    this.setupCanvas();
  }

  saveCanvasAsPNG() {
    if (!this.canvas || !this.ctx) {
      console.error("El lienzo o el contexto no están definidos.");
      return;
    }

    const imageDataUrl = this.canvas.nativeElement.toDataURL("image/png");

    // Crear un enlace de descarga
    const downloadLink = document.createElement("a");
    downloadLink.href = imageDataUrl;
    downloadLink.download = "pixel_art.png"; 

    downloadLink.click();
  }


  setupCanvas() {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.canvas.nativeElement.addEventListener('mousedown', (event) => this.startDrawing(event));
    this.canvas.nativeElement.addEventListener('mousemove', (event) => this.draw(event));
    this.canvas.nativeElement.addEventListener('mouseup', () => this.stopDrawing());
    this.canvas.nativeElement.addEventListener('mouseout', () => this.stopDrawing());
  }

  initializePixelData(width: number, height: number) {
    const rows = Math.floor(height / 10);
    const cols = Math.floor(width / 10);
    this.pixelData = Array.from({ length: rows }, () => Array(cols).fill('transparent'));
  }

  startDrawing(event: MouseEvent) {
    if (this.isBucketActive) {
      this.fillWithBucket(event); // Si la cubeta está activa, la usamos para llenar
    } else {
      this.isDrawing = true;
      this.draw(event);
    }
  }

  draw(event: MouseEvent) {
    if (!this.isDrawing) return;

    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / this.brushSize) * this.brushSize;
    const y = Math.floor((event.clientY - rect.top) / this.brushSize) * this.brushSize;

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

  // Activa la herramienta cubeta
  activateBucket() {
    this.isBucketActive = true;
  }

  fillWithBucket(event: MouseEvent) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / this.brushSize) * this.brushSize;
    const y = Math.floor((event.clientY - rect.top) / this.brushSize) * this.brushSize;

    const startColor = this.getPixelColor(x, y);
    if (startColor === this.selectedColor) return; 

    this.floodFill(x, y, startColor, this.selectedColor);
    this.isBucketActive = false;
  }

  getPixelColor(x: number, y: number): string {
    const pixel = this.ctx.getImageData(x, y, 1, 1).data;
    return `rgba(${pixel[0]},${pixel[1]},${pixel[2]},${pixel[3] / 255})`;
  }


  floodFill(x: number, y: number, startColor: string, fillColor: string) {
    const pixelStack = [[x, y]];

    while (pixelStack.length > 0) {
      const [px, py] = pixelStack.pop()!;

      const currentColor = this.getPixelColor(px, py);
      if (currentColor !== startColor) continue;

      this.fillPixel(px, py);

      if (px + this.brushSize < this.canvasWidth) pixelStack.push([px + this.brushSize, py]);
      if (px - this.brushSize >= 0) pixelStack.push([px - this.brushSize, py]);
      if (py + this.brushSize < this.canvasHeight) pixelStack.push([px, py + this.brushSize]);
      if (py - this.brushSize >= 0) pixelStack.push([px, py - this.brushSize]);
    }
  }

  changeBrushSize(size: number) {
    this.brushSize = size; // Actualiza el tamaño del pincel basado en el valor del input range
  }
  
  saveCanvasData() {
    this.imageData = this.ctx.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }
  
  restoreCanvasData() {
    this.ctx.putImageData(this.imageData, 0, 0);
  }

  applyCanvasSize() {
    this.saveCanvasData();

    this.canvasWidth = this.pixelSize.get('width')?.value || 300;
    this.canvasHeight = this.pixelSize.get('height')?.value || 300;
    this.canvas.nativeElement.width = this.canvasWidth;
    this.canvas.nativeElement.height = this.canvasHeight;

    this.restoreCanvasData();
    this.setupCanvas();
  }
}

