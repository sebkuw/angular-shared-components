import { InjectionToken } from '@angular/core';
import { MenuItem } from '../models/menu-item.interface';

export const MENU_DATA_TOKEN = new InjectionToken<MenuItem[]>('MENU_DATA');
