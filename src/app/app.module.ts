import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ScriptLoadService } from './script-load.service';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';

const config = {
  apiKey: "AIzaSyC3X9Wdp9jgpOR2nCVhe4a8QV3nsns9Ie8",
  authDomain: "map-psybercity.firebaseapp.com",
  databaseURL: "https://map-psybercity.firebaseio.com",
  projectId: "map-psybercity",
  storageBucket: "",
  messagingSenderId: "114738124484"
};


@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule
  ],
  providers: [ScriptLoadService],
  bootstrap: [AppComponent]
})
export class AppModule { }
