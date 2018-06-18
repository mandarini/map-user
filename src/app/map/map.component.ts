import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ScriptLoadService } from '../script-load.service';
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

  maps: any;
  map: any;
  marker: any;
  mapMarker: any;
  markersRef: AngularFireList<any>;
  markersCh: Observable<any[]>;
  editActive: boolean;

  @Input() userAuth: string;

  @ViewChild('mapElement') mapElm: ElementRef;

  constructor(private load: ScriptLoadService, db: AngularFireDatabase) {

    this.editActive = false;

    this.markersRef = db.list('/markers');

    this.markersCh = this.markersRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  ngAfterViewInit(): void {

    this.load.loadScript(url, 'gmap', () => {
      this.maps = window['google']['maps'];
      const loc = new this.maps.LatLng(32.078491, 34.766687);

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
        if (this.editActive) {
          this.placeMarkerAndPanTo(e.latLng, this.map);
          this.marker = {
            position: {
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            },
            title: this.userAuth
          };
        }
      });
    });
  }

  placeMarkerAndPanTo(latLng, map) {
    if (!this.mapMarker) {
      this.mapMarker = new this.maps.Marker({
        position: latLng,
        map: map
      });
    } else {
      this.mapMarker.setPosition(latLng);
    }
    map.panTo(latLng);
  }

  choosePlace(state: string) {
    if (state === 'choose') {
      this.editActive = true;
    } else {
      // if state === 'send'
      this.editActive = false;
      this.addMarker(this.marker);
    }
  }

  addMarker(marker: any) {
    this.markersRef.push(marker);
  }
}
