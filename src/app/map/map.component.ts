import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ScriptLoadService } from '../script-load.service';

const your_API_key = 'AIzaSyAwVnwE1bEZf_Bkk_pSkGM0XlBSXJocVUY';
const url = 'https://maps.googleapis.com/maps/api/js?key=' + your_API_key;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  @ViewChild('mapElement') mapElm: ElementRef;

  constructor(private load: ScriptLoadService) {
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
        console.log(e);
        this.placeMarkerAndPanTo(e.latLng, this.map);
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

}
