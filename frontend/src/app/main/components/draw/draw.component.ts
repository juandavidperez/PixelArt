import {NgIf, NgOptimizedImage} from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {NzButtonModule} from "ng-zorro-antd/button";
import {TokenUserService} from "../../../shared/services/tokenUser/token-user.service";
import {Router, RouterLink} from "@angular/router";
import {PixelArtService} from "../../../shared/services/pixelArt/pixel-art.service";
import {UserInterface} from "../../../interfaces/user.interface";
import {UsersService} from "../../../shared/services/users/users.service";



@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.css'],
  imports: [
    NgOptimizedImage,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NgIf,
    RouterLink
  ],
  providers: [PixelArtService, UsersService],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DrawComponent implements OnInit{

  constructor(private fb: FormBuilder,
              protected token: TokenUserService,
              private router: Router ,
              private pixelArtService: PixelArtService,
              protected usersService: UsersService,
              private cd: ChangeDetectorRef) {

    this.initializePixelData(this.canvasWidth, this.canvasHeight);

    this.formPostArt = this.fb.group({
      image: [null, Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
    });

  }

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('modalFooter', { static: false }) modalFooter!: TemplateRef<any>;
  private ctx!: CanvasRenderingContext2D;
  isVisibleView = false;
  selectedColor: string = '#000000';
  isDrawing: boolean = false;
  pixelData: string[][] = [];
  canvasWidth: number = 600;
  canvasHeight: number = 600;
  brushSize: number = 10;
  isBucketActive: boolean = false;
  isAuthenticated: boolean = false;
  formPostArt: FormGroup;
  previewImageUrl: string | null = null;
  user: any = [];


  ngOnInit() {
    this.openPostModal()
    this.setupCanvas();
    this.isAuthenticated = this.token.isAuthenticated();

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
      this.fillWithBucket(event);
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

  openPostModal(): void {
    this.triggerChangeDetection();
    const canvasElement = this.canvas.nativeElement;

    canvasElement.toBlob((blob) => {
      if (blob) {
        this.formPostArt.patchValue({ image: blob }); // Asignamos el Blob al formulario
        this.previewImageUrl = URL.createObjectURL(blob); // Generamos URL de previsualización
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

        const idData = this.user.id; // Obtener el ID del usuario

        console.log('ID del usuario:', idData);

        // Crear el FormData para enviar al servidor
        const formData = new FormData();
        formData.append('image', this.formPostArt.value.image); // Aquí enviamos el Blob de la imagen
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

  handleOk(): void {
    this.isVisibleView = false;
    this.postArt()
  }

  handleOkRegister(): void {
    this.router.navigate(['/login']);
    this.isVisibleView = false;
  }

  handleCancel(): void {
    this.isVisibleView = false;
  }

}

