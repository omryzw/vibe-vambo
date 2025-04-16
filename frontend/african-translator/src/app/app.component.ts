import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatorComponent } from './components/translator/translator.component';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  standalone: true,
  imports: [RouterOutlet, TranslatorComponent]
})
export class AppComponent {
  title = 'african-translator';
}
