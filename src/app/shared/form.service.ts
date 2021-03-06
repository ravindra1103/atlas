import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class FormService {
  dataChangeEmitter: Subject<any> = new Subject<any>();

  statusChangeEmitter: Subject<any> = new Subject<any>();
}