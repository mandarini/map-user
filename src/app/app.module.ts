import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ScriptLoadService } from './script-load.service';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [ScriptLoadService],
  bootstrap: [AppComponent]
})
export class AppModule { }
