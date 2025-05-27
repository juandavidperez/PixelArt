import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import p5 from 'p5';
import {Router, RouterLink} from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitterModule } from 'primeng/splitter';
import { ColorPickerModule } from 'primeng/colorpicker';
import { MessageService } from 'primeng/api';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { StepperModule } from 'primeng/stepper';
import { Carousel, CarouselModule } from 'primeng/carousel';
import { SliderModule } from 'primeng/slider';
import { TokenUserService } from 'src/app/shared/services/tokenUser/token-user.service';
import { PixelArtService } from 'src/app/shared/services/pixelArt/pixel-art.service';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { AiImageGeneratorComponent } from "../ai/ai-image-generator.component";
import { AiAnimationGeneratorComponent } from "../ai/ai-animation-generator/ai-animation-generator.component";


export interface Pixel {
  x: number;
  y: number;
  color: string;
}

export interface Layer {
  pixels: Pixel[];
  opacity: number;
  visible: boolean;
  locked: boolean;
  name: string;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay';
}

export interface Frame {
  layers: Layer[];
  activeLayerIndex: number;
  duration: number;
}

export interface AnimationProject {
  frames: Frame[];
  currentFrameIndex: number;
  isPlaying: boolean;
  loop: boolean;
  onionSkin: {
    enabled: boolean;
    opacity: number;
    framesToShow: number;
  };
}


@Component({
  selector: 'app-draw-test',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DragDropModule, RouterLink,
    ToolbarModule,
    StepperModule,
    ButtonModule,
    ColorPickerModule,
    SplitterModule,
    SplitButtonModule,
    DropdownModule,
    DividerModule,
    ScrollPanelModule,
    InputNumberModule,
    ToastModule,
    CarouselModule,
    SliderModule,
    CardModule,
    DialogModule,
    AiImageGeneratorComponent,
    AiAnimationGeneratorComponent
  ],
  providers: [MessageService, PixelArtService, UsersService],
  templateUrl: './draw-test.component.html',
  styleUrl: './draw-test.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DrawTestComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router ,
    protected pixelArtService: PixelArtService,
    protected usersService: UsersService,
    private cd: ChangeDetectorRef
  ) {
    this.formGroup = this.fb.group({
      color: ['#000000']
    });
    this.formPostArt = this.fb.group({
      image: [null, Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      category_id: [null, Validators.required],
      tags: [null, Validators.required],
      userId: [null, Validators.required]
    });
  }

  displayModal: boolean = false;
  formGroup: FormGroup;
  formPostArt: FormGroup;
  @Output() imageGenerated = new EventEmitter<string>();
  @ViewChild('carousel')  carousel: Carousel | any ;
  currentCarouselPage = 0;
  private p5Instance: any;
  currentColor: string = '#000000';
  showGrid: boolean = true;
  isEraser: boolean = false;

  currentTool: 'pencil' | 'bucket' = 'pencil';

  frameRate: number = 12; // FPS
  private animationInterval?: any;
  layers: Layer[] = [];
  activeLayerIndex: number = 0;
  newLayerName: string = '';
  user: any = [];

  animation: AnimationProject = {
    frames: [],
    currentFrameIndex: 0,
    isPlaying: false,
    loop: true,
    onionSkin: {
      enabled: true,
      opacity: 0.3,
      framesToShow: 1
    }
  };


  canvasSizes = [
    { name: 'Grande (64x64)', width: 64, height: 64 }
  ];

  colorPalette: string[] = [
    '#000000', // Negro
    '#FFFFFF', // Blanco
    '#FF0000', // Rojo
    '#00FF00', // Verde
    '#0000FF', // Azul
    '#FFFF00', // Amarillo
    '#FF00FF', // Magenta
    '#00FFFF', // Cian
    '#C0C0C0', // Plata
    '#808080', // Gris
    '#800000', // Marrón oscuro
    '#808000', // Oliva
    '#008000', // Verde oscuro
    '#800080', // Púrpura
    '#008080', // Verde azulado
    '#FFA500'  // Naranja
  ];




  newColor: string = '#000000';

  selectedCanvasSize: any = this.canvasSizes[0];
  private pixelSize: number = 0;
  private canvasWidth: number = 550;
  private canvasHeight: number = 550;
  animationFrameId: number | undefined;
  visibleFrames = 7;

  ngOnInit() {
    this.initializeEmptyFrame();
    this.initPixelArt(this.selectedCanvasSize.width, this.selectedCanvasSize.height);
    this.pixelArtService.loadCategories();
    this.cd.detectChanges();
  }

  //METODO PRINCIPAL PARA MANEJAR EL DIBUJO

  protected redrawCanvas(): void {
    if (!this.p5Instance) return;
    const p = this.p5Instance;
    p.clear();

    if (this.showGrid) this.drawGrid(p);

    if (this.animation.onionSkin.enabled && this.animation.currentFrameIndex > 0) {
      const prevFrame = this.animation.frames[this.animation.currentFrameIndex - 1];
      if (prevFrame?.layers) {
        prevFrame.layers.forEach(layer => {
          if (layer.visible) {
            this.drawPixels(p, layer.pixels, this.animation.onionSkin.opacity);
          }
        });
      }
    }

    const currentFrame = this.animation.frames[this.animation.currentFrameIndex];
    if (currentFrame?.layers) {
      currentFrame.layers.forEach(layer => {
        if (layer.visible) {
          this.drawPixels(p, layer.pixels, layer.opacity);
        }
      });
    }
  }

  private drawPixels(p: any, pixels: Pixel[], opacity: number = 1.0): void {
    p.push();
    p.drawingContext.globalAlpha = opacity;
    pixels.forEach(pixel => {
      if (pixel.color && pixel.color !== 'transparent') {
        p.fill(pixel.color);
        p.noStroke();
        p.rect(
          pixel.x * this.pixelSize,
          pixel.y * this.pixelSize,
          this.pixelSize,
          this.pixelSize
        );
      }
    });
    p.pop();
  }

  changeCanvasSize(): void {
    const oldPixels = this.layers[this.activeLayerIndex].pixels;

    this.initPixelArt(this.selectedCanvasSize.width, this.selectedCanvasSize.height);
  }

  initPixelArt(gridWidth: number, gridHeight: number): void {
    if (this.p5Instance) {
      this.p5Instance.remove();
      this.p5Instance = null;
    }

    const sketch = (p: any) => {

      this.p5Instance = p;

      p.setup = () => {
        const maxDimension = Math.max(gridWidth, gridHeight);
        this.pixelSize = this.canvasWidth / maxDimension;

        const canvas = p.createCanvas(this.canvasWidth, this.canvasHeight);
        canvas.parent('p5-canvas');
        p.pixelDensity(1);
        p.noStroke();
        p.drawingContext.imageSmoothingEnabled = false;
      };

      p.draw = () => {

        this.redrawCanvas();

        if (this.isCursorOnCanvas(p)) {
          this.drawPixelHighlight(p);
        }

        if (p.mouseIsPressed) {
          const x = p.mouseX;
          const y = p.mouseY;

          if (this.currentTool === 'bucket') {
            this.floodFill(x, y, this.isEraser ? 'transparent' : this.currentColor);
          } else {
            this.handleDrawing(x, y);
          }
          this.redrawCanvas();
        }
      };
    };

    new p5(sketch);
  }

  private isCursorOnCanvas(p: any): boolean {
    return p.mouseX >= 0 && p.mouseX < p.width &&
      p.mouseY >= 0 && p.mouseY < p.height;
  }

  private drawPixelHighlight(p: any): void {
    const gridX = Math.floor(p.mouseX / this.pixelSize);
    const gridY = Math.floor(p.mouseY / this.pixelSize);
    const highlightColor = this.isEraser ? '#FF0000' : this.currentColor;

    p.push();
    p.noFill();
    p.stroke(highlightColor);
    p.strokeWeight(2);
    p.rect(
      gridX * this.pixelSize + 1,
      gridY * this.pixelSize + 1,
      this.pixelSize - 2,
      this.pixelSize - 2
    );
    p.pop();
  }

  handleGeneratedImage(imageUrl: string) {
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      const currentFrame = this.animation.frames[this.animation.currentFrameIndex];
      const activeLayer = currentFrame.layers[currentFrame.activeLayerIndex];

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;

      // Limpia la capa actual
      activeLayer.pixels = [];

      for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
          const index = (y * img.width + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const a = data[index + 3];

          if (a > 0) {
            const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
            activeLayer.pixels.push({ x, y, color: hex });
          }
        }
      }

      this.redrawCanvas();
    };
  }

  loadAiFrames(frames: Frame[]) {
    this.animation.frames.push(...frames);
    this.animation.currentFrameIndex = this.animation.frames.length - frames.length;
    this.syncCurrentFrameToView();
    this.redrawCanvas();
  }



  //Modelo de las capas


  addLayer(): void {
    const currentFrame = this.animation.frames[this.animation.currentFrameIndex];
    if (!currentFrame) return;

    const newLayerName = this.newLayerName || `Capa ${currentFrame.layers.length + 1}`;

    const newLayer: Layer = {
      pixels: [],
      opacity: 1.0,
      visible: true,
      locked: false,
      name: newLayerName,
      blendMode: 'normal'
    };

    currentFrame.layers.push(newLayer);
    currentFrame.activeLayerIndex = currentFrame.layers.length - 1;

    this.newLayerName = '';
    this.syncCurrentFrameToView();
    this.syncCanvasToLayer();
    this.redrawCanvas();
  }

  removeLayer(index: number): void {
    const currentFrame = this.animation.frames[this.animation.currentFrameIndex];
    if (!currentFrame || currentFrame.layers.length <= 1) return;

    currentFrame.layers.splice(index, 1);
    currentFrame.activeLayerIndex = Math.min(
      currentFrame.activeLayerIndex,
      currentFrame.layers.length - 1
    );

    this.syncCurrentFrameToView();
    this.redrawCanvas();
  }


  toggleLayerLock(index: number) {
    this.layers[index].locked = !this.layers[index].locked;
  }

  updateLayerName(index: number, newName: string) {
    this.layers[index].name = newName;
  }

  setLayerOpacity(index: number, opacity: number): void {
    const currentFrame = this.animation.frames[this.animation.currentFrameIndex];
    if (currentFrame && currentFrame.layers[index]) {
      currentFrame.layers[index].opacity = Math.min(1, Math.max(0, opacity));
      this.syncCurrentFrameToView();
      this.redrawCanvas();
    }
  }

  toggleLayerVisibility(index: number): void {
    const currentFrame = this.animation.frames[this.animation.currentFrameIndex];
    if (currentFrame && currentFrame.layers[index]) {
      currentFrame.layers[index].visible = !currentFrame.layers[index].visible;
      this.syncCurrentFrameToView();
      this.redrawCanvas();
    }
  }

  dropLayer(event: CdkDragDrop<Layer[]>) {
    if (!this.layers[event.previousIndex].locked && !this.layers[event.currentIndex].locked) {
      moveItemInArray(this.layers, event.previousIndex, event.currentIndex);
      this.redrawCanvas();
    }
  }
  private updateLayerPixels(layer: Layer, x: number, y: number, color: string): void {
    const existingIndex = layer.pixels.findIndex(p => p.x === x && p.y === y);

    if (existingIndex === -1 && color !== 'transparent') {
      layer.pixels.push({ x, y, color });
    } else if (existingIndex !== -1) {
      if (color === 'transparent') {
        layer.pixels.splice(existingIndex, 1);
      } else {
        layer.pixels[existingIndex].color = color;
      }
    }
  }

  // METODOS DE DIBUJO

  private handleDrawing(x: number, y: number): void {


    const gridX = Math.floor(x / this.pixelSize);
    const gridY = Math.floor(y / this.pixelSize);

    if (this.currentTool === 'bucket') {
      this.floodFill(x, y, this.isEraser ? 'transparent' : this.currentColor);
    } else {

      const currentFrame = this.animation.frames[this.animation.currentFrameIndex];
      if (!currentFrame) return;

      const activeLayer = currentFrame.layers[currentFrame.activeLayerIndex];
      if (!activeLayer || activeLayer.locked) return;

      const color = this.isEraser ? 'transparent' : this.currentColor;

      this.updateLayerPixels(activeLayer, gridX, gridY, color);
      this.redrawCanvas();
    }
  }


  private drawGrid(p: any): void {
    const color1 = 220;
    const color2 = 255;

    p.background(color2);

    p.fill(color1);
    for (let x = 0; x < p.width; x += this.pixelSize * 2) {
      for (let y = 0; y < p.height; y += this.pixelSize * 2) {
        p.rect(x, y, this.pixelSize, this.pixelSize);
        p.rect(x + this.pixelSize, y + this.pixelSize, this.pixelSize, this.pixelSize);
      }
    }
  }

  handleOpacityChange(event: Event, layerIndex: number): void {
    const target = event.target as HTMLInputElement | null;
    if (!target) return;

    const opacity = Number(target.value) / 100;
    if (!isNaN(opacity)) {
      this.setLayerOpacity(layerIndex, opacity);
    }
  }

  //CUBETA


  floodFill(startX: number, startY: number, newColor: string): void {
    const gridX = Math.floor(startX / this.pixelSize);
    const gridY = Math.floor(startY / this.pixelSize);

    const currentFrame = this.animation.frames[this.animation.currentFrameIndex];
    if (!currentFrame) return;

    const activeLayer = currentFrame.layers[currentFrame.activeLayerIndex];
    if (!activeLayer || activeLayer.locked) return;

    const targetPixel = activeLayer.pixels.find(p => p.x === gridX && p.y === gridY);
    const targetColor = targetPixel ? targetPixel.color : 'transparent';

    if (targetColor === newColor) return;

    const queue: {x: number, y: number}[] = [{x: gridX, y: gridY}];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const {x, y} = queue.shift()!;
      const pixelKey = `${x},${y}`;

      if (visited.has(pixelKey) || !this.isInBounds(x, y)) continue;

      const currentPixel = activeLayer.pixels.find(p => p.x === x && p.y === y);
      const currentColor = currentPixel ? currentPixel.color : 'transparent';

      if (currentColor !== targetColor) continue;

      if (newColor === 'transparent') {
        const index = activeLayer.pixels.findIndex(p => p.x === x && p.y === y);
        if (index >= 0) {
          activeLayer.pixels.splice(index, 1);
        }
      } else {
        if (currentPixel) {
          currentPixel.color = newColor;
        } else {
          activeLayer.pixels.push({x, y, color: newColor});
        }
      }

      visited.add(pixelKey);

      queue.push(
        {x: x + 1, y},
        {x: x - 1, y},
        {x, y: y + 1},
        {x, y: y - 1}
      );
    }

    this.redrawCanvas();
  }

  private isInBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.selectedCanvasSize.width &&
      y >= 0 && y < this.selectedCanvasSize.height;
  }

  //CAMBIO DE HERRAMIENTA

  setTool(tool: 'pencil' | 'bucket'): void {
    this.currentTool = tool;
  }

  //COLORES


  addColorToPalette(): void {
    if (!this.colorPalette.includes(this.newColor)) {
      this.colorPalette.push(this.newColor);

      // Opcional: Mostrar notificación
      this.messageService.add({
        severity: 'success',
        summary: 'Color añadido',
        detail: `El color ${this.newColor} fue añadido a la paleta`
      });

      // Opcional: Seleccionar automáticamente el nuevo color
      this.selectColorFromPalette(this.newColor);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Color duplicado',
        detail: 'Este color ya existe en la paleta'
      });
    }
  }

  selectColorFromPalette(color: string): void {
    this.currentColor = color;
    this.isEraser = false;
  }

  removeColorFromPalette(index: number): void {
    if (this.colorPalette[index] === this.currentColor) {
      this.currentColor = '#000000';
    }

    this.colorPalette.splice(index, 1);

    this.messageService.add({
      severity: 'info',
      summary: 'Color eliminado',
      detail: 'El color fue removido de la paleta'
    });
  }


  toggleEraser(): void {
    this.isEraser = !this.isEraser;
    this.currentColor = this.isEraser ? 'transparent' : '#000000';
  }

  //FRAME MODELO

  addFrame() {
    if (this.animation.frames.length === 0) {
      this.initializeEmptyFrame();
      return;
    }

    const currentFrame = this.animation.frames[this.animation.currentFrameIndex];
    const newFrame: Frame = {
      layers: currentFrame.layers.map(layer => ({
        ...layer,
        pixels: layer.pixels.map(p => ({...p}))
      })),
      activeLayerIndex: currentFrame.activeLayerIndex,
      duration: currentFrame.duration
    };

    this.animation.frames.splice(this.animation.currentFrameIndex + 1, 0, newFrame);
    this.animation.currentFrameIndex++;
    this.loadCurrentFrame();
  }

  removeFrame() {
    if (this.animation.frames.length > 1) {
      this.animation.frames.splice(this.animation.currentFrameIndex, 1);
      this.animation.currentFrameIndex = Math.min(
        this.animation.currentFrameIndex,
        this.animation.frames.length - 1
      );
      this.loadCurrentFrame();
    }
  }

  toggleAnimation() {
    this.animation.isPlaying = !this.animation.isPlaying;

    if (this.animation.isPlaying) {
      this.playAnimation();
    } else {
      this.stopAnimation();
    }
  }

  private playAnimation() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }

    let startTime = performance.now();
    let frameDuration = 1000 / this.frameRate;

    const animate = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const currentFrameIndex = Math.floor(elapsed / frameDuration) % this.animation.frames.length;

      if (currentFrameIndex !== this.animation.currentFrameIndex) {
        this.animation.currentFrameIndex = currentFrameIndex;
        this.loadCurrentFrame(false);
      }

      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  private stopAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = undefined;
    }
    this.animation.isPlaying = false;
  }

  prevFrame() {
    if (this.animation.currentFrameIndex > 0) {
      this.animation.currentFrameIndex--;
      this.loadCurrentFrame();
    }
  }

  nextFrame() {
    if (this.animation.currentFrameIndex < this.animation.frames.length - 1) {
      this.animation.currentFrameIndex++;
      this.loadCurrentFrame();
    }
  }

  gotoFrame(index: number) {
    this.animation.currentFrameIndex = index;
    this.currentCarouselPage = Math.floor(index / 7); // 7 = numVisible
    this.syncCarousel();
  }

  syncCarousel() {
    if (this.carousel) {
      setTimeout(() => {
        const page = Math.floor(this.animation.currentFrameIndex / this.carousel.numVisible);
        this.carousel.page = page;
      });
    }
  }

  loadCurrentFrame(stopAnimation: boolean = true): void {
    if (stopAnimation && this.animation.isPlaying) {
      this.stopAnimation();
    }
    if (!this.animation.frames || this.animation.frames.length === 0) {
      this.initializeEmptyFrame();
      return;
    }

    this.animation.currentFrameIndex = Math.max(
      0,
      Math.min(this.animation.currentFrameIndex, this.animation.frames.length - 1)
    );

    const currentFrame = this.animation.frames[this.animation.currentFrameIndex];

    if (!currentFrame.layers || currentFrame.layers.length === 0) {
      currentFrame.layers = [this.createNewLayer('Capa 1')];
      currentFrame.activeLayerIndex = 0;
    }

    this.syncCurrentFrameToView();
    this.redrawCanvas();
  }

  private syncCurrentFrameToView(): void {
    const currentFrame = this.animation.frames[this.animation.currentFrameIndex];
    if (!currentFrame) return;

    this.layers = currentFrame.layers.map(layer => ({
      ...layer,
      pixels: [...layer.pixels]
    }));

    this.activeLayerIndex = currentFrame.activeLayerIndex;
  }

  private createNewLayer(name: string): Layer {
    return {
      pixels: [],
      opacity: 1.0,
      visible: true,
      locked: false,
      name: name,
      blendMode: 'normal'
    };
  }


  setActiveLayer(index: number): void {
    const currentFrame = this.animation.frames[this.animation.currentFrameIndex];
    if (currentFrame) {
      currentFrame.activeLayerIndex = index;
      this.activeLayerIndex = index;
    }
  }

  private syncCanvasToLayer(): void {
    const currentFrame = this.animation.frames[this.animation.currentFrameIndex];
    if (!currentFrame) return;

    const activeLayer = currentFrame.layers[currentFrame.activeLayerIndex];
    if (!activeLayer) return;

  }

  private initializeEmptyFrame(): void {
    const newFrame: Frame = {
      layers: [{
        pixels: [],
        opacity: 1.0,
        visible: true,
        locked: false,
        name: 'Capa 1',
        blendMode: 'normal'
      }],
      activeLayerIndex: 0,
      duration: 1000 / this.frameRate
    };

    this.animation.frames = [newFrame];
    this.animation.currentFrameIndex = 0;
    this.syncCurrentFrameToView();
    this.redrawCanvas();
  }

  //PUBLICAR DIBUJO

  saveDrawing(): void {
    const username = localStorage.getItem('userId');
    if (!username) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Usuario no autenticado' });
      return;
    }

    this.usersService.getUserByUsername(username).subscribe({
      next: (data) => {
        this.user = data;
        const userId = this.user.id;
        const canvasElement = document.querySelector('#p5-canvas canvas') as HTMLCanvasElement;

        if (!canvasElement) {
          console.error('Canvas no encontrado');
          return;
        }

        canvasElement.toBlob((blob) => {
          if (!blob) {
            console.error('No se pudo crear la imagen');
            return;
          }

          const tags = this.formPostArt.value.tags
            ? this.formPostArt.value.tags.split(',').map((tag: string) => tag.trim())
            : [];

          const formData = new FormData();
          formData.append('image', blob, 'drawing.png');
          formData.append('title', this.formPostArt.value.title);
          formData.append('description', this.formPostArt.value.description);
          formData.append('category_id', this.formPostArt.value.category_id);
          formData.append('tag', JSON.stringify(tags)); // o repetir múltiples formData.append('tag', t)
          formData.append('userId', userId);

          this.pixelArtService.saveArt(formData).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Publicado', detail: '¡Tu dibujo ha sido publicado!' });
              this.displayModal = false;
              this.router.navigate(['/main']);
            },
            error: (err) => {
              console.error('Error al publicar:', err);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo publicar el dibujo' });
            }
          });

        }, 'image/png');

        console.log(this.formPostArt.value); // o como se llame tu formulario
      },
      error: (err) => {
        console.error('Error obteniendo usuario:', err);
      }
    });
  }

  // AI CONTROLES

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


}
