import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface InfoClickData {
  title: string;
  content: string;
  confirmationBtnText?: string;
  iconName?: string;
}

@Component({
  selector: 'shared-page-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss',
})
export class PageHeaderComponent {
  @Input({ required: true }) headerText!: string;

  @Input() infoTitle?: string;
  @Input() infoContent?: string;
  @Input() confirmationBtnText?: string;
  @Input() iconName: string = 'info_outline';

  @Output() infoClick = new EventEmitter<InfoClickData>();

  onInfoClick(): void {
    if (this.infoContent) {
      this.infoClick.emit({
        title: this.infoTitle || 'Informacja',
        content: this.infoContent,
        confirmationBtnText: this.confirmationBtnText,
        iconName: this.iconName,
      });
    }
  }
}
