import { createSignal, createEffect, onMount, onCleanup } from 'solid-js';
import { pointsState, titleState, setTitleState } from '../store/store';
import { Loader } from '@googlemaps/js-api-loader';
import'./MapView.css';

const mapLoader = new Loader({
  apiKey: 'AIzaSyCU-SCtr4kQc3yZgC2rRQbtwtZFYanfo98',
  version: 'weekly',
  libraries: ['places', 'drawing'],
});

function MapView() {
  let mapRef: HTMLDivElement | undefined;
  let drawingManager: google.maps.drawing.DrawingManager | undefined;
  let line: google.maps.Polyline | undefined;
  let polygon: google.maps.Polygon | undefined;
  let rectangle: google.maps.Rectangle | undefined;
  let circle: google.maps.Circle | undefined;
  let marker: google.maps.Marker | undefined;

  const [map, setMap] = createSignal<google.maps.Map | null>(null);
  const [markers, setMarkers] = createSignal<google.maps.Marker[]>([]);

  const [isModalOpen, setIsModalOpen] = createSignal(false);

  onMount(() => {
    mapLoader.load().then(() => {
      const gmaps = new google.maps.Map(mapRef as HTMLElement, {
        center: { lat: -2.592118, lng: 108.438682 }, 
        zoom: 6.5,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        fullscreenControl: false,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#4d6059" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#ffffff" }],
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "##ffffff" }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3f" }],
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b9a76" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#ffffff" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#ffffff" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }],
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3d19c" }],
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2f3948" }],
          },
          {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#24282b" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#24282b" }],
          }, 
        ]
      });
      setMap(gmaps);

      const mapMarkers = pointsState().map((user: any) => {
        const marker = new google.maps.Marker({
          position: { lat: user.latitude, lng: user.longitude },
          icon: {
            url: '/rb.png',
            scaledSize: new google.maps.Size(30, 30),
          },
        });

        const contentString = `
          <div class="custom-popup">
            <h3 class="flex justify-center">TEST ${titleState()}</h3>
          </div>
        `;
        const infoWindow = new google.maps.InfoWindow({
          content: contentString,
        });
        marker.addListener("click", () => {
          infoWindow.open(gmaps, marker);
        });

        return marker;
      });
      setMarkers(mapMarkers);

      drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            google.maps.drawing.OverlayType.MARKER,
            google.maps.drawing.OverlayType.POLYLINE,
            google.maps.drawing.OverlayType.POLYGON,
            google.maps.drawing.OverlayType.RECTANGLE,
            google.maps.drawing.OverlayType.CIRCLE,
          ],
        },
        markerOptions: {
          draggable: true,
        },
        polylineOptions: {
          strokeColor: '#FF0000',
          strokeWeight: 2,
        },
        polygonOptions: {
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
        },
        rectangleOptions: {
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
        },
        circleOptions: {
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
        },
      });
      drawingManager.setMap(gmaps);

      google.maps.event.addListener(drawingManager, 'overlaycomplete', (event: google.maps.drawing.OverlayCompleteEvent) => {
        if (event.type === google.maps.drawing.OverlayType.POLYLINE) {
          if (line) {
            line.setMap(null);
          }
          line = event.overlay as google.maps.Polyline;

          const path = line.getPath();
          const distance = google.maps.geometry.spherical.computeLength(path);

          alert(`Distance of the line: ${distance.toFixed(2)} meters`);
        } else if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          if (polygon) {
            polygon.setMap(null);
          }
          polygon = event.overlay as google.maps.Polygon;

          const area = google.maps.geometry.spherical.computeArea(polygon.getPath());

          alert(`Area of the polygon: ${area.toFixed(2)} square meters`);
        } else if (event.type === google.maps.drawing.OverlayType.RECTANGLE) {
            if (rectangle) {
                rectangle.setMap(null);
              }

              rectangle = event.overlay as google.maps.Rectangle;
          const bounds : any = (event.overlay as google.maps.Rectangle).getBounds();
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();
          alert(`Rectangle bounds: NE (${ne.lat()}, ${ne.lng()}), SW (${sw.lat()}, ${sw.lng()})`);
        } else if (event.type === google.maps.drawing.OverlayType.CIRCLE) {
            if (circle) {
                circle.setMap(null);
              }
              circle = event.overlay as google.maps.Circle;
          const radius = (event.overlay as google.maps.Circle).getRadius();
          alert(`Circle radius: ${radius.toFixed(2)} meters`);
        } else if (event.type === google.maps.drawing.OverlayType.MARKER) {
            if (marker) {
                marker.setMap(null);
              }
              marker = event.overlay as google.maps.Marker;
          const position = (event.overlay as google.maps.Marker).getPosition();
          alert(`Marker position: (${position?.lat()}, ${position?.lng()})`);
        }
      });
    });
  });

  onCleanup(() => {
    markers().forEach((marker) => {
      google.maps.event.clearInstanceListeners(marker);
    });
  });

  createEffect(() => {
    const gmap = map();
    if (gmap) {
      markers().forEach(marker => {
        marker.setMap(gmap);
      });
      gmap.addListener("zoom_changed", () => {
        const zoomLevel = gmap.getZoom();

        if (zoomLevel && zoomLevel <= 5.5) {
          markers().forEach(marker => {
            marker.setMap(gmap);
          });
        } else {
          // cluster.addMarkers(markers());
        }
      });
    }
  });

  const [newTitle, setNewTitle] = createSignal('');

  const updateTitle = () => {
    setTitleState(newTitle());
  };

  const removeDrawing = () => {
    if (line) {
      line.setMap(null);
      line = undefined;
    }
    if (polygon) {
      polygon.setMap(null);
      polygon = undefined;
    }
    if (rectangle) {
        rectangle.setMap(null);
        rectangle = undefined;
      }
      if (circle) {
        circle.setMap(null);
        circle = undefined;
      }
      if (marker) {
        marker.setMap(null);
        marker = undefined;
      }
    drawingManager?.setDrawingMode(null);
  };

  return (
    <div id="map-container">
      {/* <div>
        <h1>Home Page</h1>
        <h2>{titleState()}</h2>
        <input
          type="text"
          value={newTitle()}
          onInput={(e) => setNewTitle(e.currentTarget.value)}
        />
        <button onClick={updateTitle}>Update Title</button>
        <button onClick={removeDrawing}>Remove Drawing</button>
      </div> */}
      <div id="map" ref={el => mapRef = el}></div>
      {/* <button class="custom-button" onClick={() => setIsModalOpen(true)}>Show Modal</button> */}

      {isModalOpen() && (
        <div class="modal">
          <div class="modal-content">
            <span class="close" onClick={() => setIsModalOpen(false)}>&times;</span>
            <p>Some content in the Modal..</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapView;
