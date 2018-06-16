import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ScriptLoadService } from '../script-load.service';
import { Marker } from '../marker';
import { FirebaseApp } from 'angularfire2';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const your_API_key = 'AIzaSyAwVnwE1bEZf_Bkk_pSkGM0XlBSXJocVUY';
const url = 'https://maps.googleapis.com/maps/api/js?key=' + your_API_key;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  markersRef: AngularFireList<any>;
  markers: Observable<Marker[]>;
  markersCh: Observable<Marker[]>;
  newMarker: Marker;
  newName: string;

  @ViewChild('mapElement') mapElm: ElementRef;

  constructor(private load: ScriptLoadService, db: AngularFireDatabase) {

    this.markers = db.list('/markers').valueChanges();

    this.markers.subscribe(x => {
      console.log(x);
    });

    this.markersRef = db.list('/markers');

    this.markersCh = this.markersRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );

    this.newName = 'Anonymous';
  }

  ngAfterViewInit(): void {

    this.load.loadScript(url, 'gmap', () => {
      this.maps = window['google']['maps'];
      console.log(this.maps);
      const loc = new this.maps.LatLng(51.561638, -0.14);

      this.map = new this.maps.Map(this.mapElm.nativeElement, {
        zoom: 11,
        center: loc,
        scrollwheel: true,
        panControl: false,
        mapTypeControl: false,
        zoomControl: true,
        streetViewControl: false,
        scaleControl: true,
        zoomControlOptions: {
          style: this.maps.ZoomControlStyle.LARGE,
          position: this.maps.ControlPosition.RIGHT_BOTTOM
        }
      });

      this.map.addListener('click', (e) => {
        console.log(e.latLng, e.latLng.lat(), e.latLng.lng());
        this.placeMarkerAndPanTo(e.latLng, this.map);
        this.newMarker = {
          position: {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
          },
          title: this.newName
        }
        this.addMarker(this.newMarker);
      });
    }
  }

  placeMarkerAndPanTo(latLng, map) {
    let marker = new this.maps.Marker({
      position: latLng,
      map: map
    });
    map.panTo(latLng);
  }

  // addItem(newName: string) {
  //   this.markersRef.push({ text: newName });
  // }

  addMarker(marker: Marker) {
    this.markersRef.push(marker);
  }

  userName(name: string) {
    this.newName= name;
  }

  // updateItem(key: string, newText: string) {
  //   this.markersRef.update(key, { text: newText });
  // }
  // deleteItem(key: string) {
  //   this.markersRef.remove(key);
  // }
  // deleteEverything() {
  //   this.markersRef.remove();
  // }

}
