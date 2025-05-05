import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    DragDropModule
  ],
  declarations: [],
  providers: [],
  bootstrap: []
})
export class AppModule { }

