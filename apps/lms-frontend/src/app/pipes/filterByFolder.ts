// filter-by-folder.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { CourseMaterial } from '../../../libs/types';

@Pipe({
  name: 'filterByFolder',
  standalone: true
})
export class FilterByFolderPipe implements PipeTransform {
  transform(materials: CourseMaterial[], folder: string): CourseMaterial[] {
    return materials.filter(material => material.folder === folder);
  }
}