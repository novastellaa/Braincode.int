import { createSignal, createEffect, onMount, onCleanup, Component } from 'solid-js';
import { pointsState, titleState, setTitleState } from '../../store/store';
import { Loader } from '@googlemaps/js-api-loader';
import'./LogSimulasiMapEditorSimulator.css';
import { Portal } from 'solid-js/web';
import { Flex, Spacer } from "@hope-ui/solid"
import { AiOutlinePlus } from 'solid-icons/ai'
import { Button } from "@hope-ui/solid"
import { 
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@hope-ui/solid" 
import LogSimulasiPopUpRuteAdd from './LogSimulasiPopUpRuteAdd';


type LogSimulasiMapEditorSimulatorProps = {
  closeSend?: any,
  sendData?: any,
  detect?: any,
};

const mapLoader = new Loader({
  apiKey: 'AIzaSyCU-SCtr4kQc3yZgC2rRQbtwtZFYanfo98',
  version: 'weekly',
  libraries: ['places', 'drawing'],
});

const LogSimulasiMapEditorSimulator : Component<LogSimulasiMapEditorSimulatorProps> = (props) =>  {
  let mapRef: HTMLDivElement | undefined;
  let drawingManager: google.maps.drawing.DrawingManager | undefined;
  let line: google.maps.Polyline | undefined;
  let polygon: google.maps.Polygon | undefined;
  let rectangle: google.maps.Rectangle | undefined;
  let circle: google.maps.Circle | undefined;
  let marker: google.maps.Marker | undefined;

  const [map, setMap] = createSignal<google.maps.Map | null>(null);
  const [markers, setMarkers] = createSignal<google.maps.Marker[]>([]);
  const [polyline, setPolyline]: any = createSignal(null);
  const [isModalOpen, setIsModalOpen] = createSignal(false);

  const [infoWindow, setInfoWindow] = createSignal(null);
  const [popupContent, setPopupContent] = createSignal(null);

  
  const [longlat, setLongLat] : any = createSignal({});
  const [longlatKoor, setLongLatKoor] : any = createSignal({});

  createEffect(() => {
    // console.log("props data -> ", props.sendData)
    showDataTable(props.sendData[0])
  })

  
  const showDataTable = (data : any) => {

   
    if (data) {
      console.log("data -> ", data)
      setTimeout(() => {
  markers().forEach(marker => marker.setMap(null));
    setMarkers([]);
 
    if (polyline()) {
      polyline().setPath([]);  
    }
      },100)
     

      setTimeout(() => {
      const gmaps = map(); 
      const newMarkers = data.markers.map((position : any) => {
          const marker = new google.maps.Marker({
              position,
              icon: {
                  url: '/rb.png',
                  scaledSize: new google.maps.Size(30, 30),
              },
              map: gmaps,
              draggable: false,
          });

          marker.addListener("drag", () => {
              // Update the path of the polyline when marker is dragged
              const markerIndex = markers().indexOf(marker);
              polyline().getPath().setAt(markerIndex, marker.getPosition());
          });

          marker.addListener("click", () => {
              // Remove marker and update polyline
              // marker.setMap(null);
              // const markerIndex = markers().indexOf(marker);
              // polyline().getPath().removeAt(markerIndex);
              // setMarkers(markers().filter(m => m !== marker));
          });

          return marker;
      });

      setMarkers(newMarkers);

      console.log("data.polyline -> ", data.polyline)
      // Load polyline
      const newPolyline = new google.maps.Polyline({
          path: data.polylines,
          geodesic: true,
          strokeColor: "#ffc746",
          strokeOpacity: 1.0,
          strokeWeight: 0.4,
          // editable: true,
          icons: [{
              icon: {
                  path: 'M 0,-1 0,1',
                  strokeOpacity: 1,
                  scale: 2
              },
              offset: '0',
              repeat: '10px'
          }],
      });

      newPolyline.setMap(gmaps);
      setPolyline(newPolyline);

    },200)
  }
  }

  const saveData = () => {
    let data = [
      { 
              "lat": -3.1826727634663876,
              "lng": 106.74753669772981,
               "latkoor": "3° 10' 57.62\" S",
              "lngkoor": "106° 44' 51.13\" E"
          
      },  {
              "lat": -3.393216503044212,
              "lng": 111.39729685419874,
               "latkoor": "3° 23' 35.58\" S",
              "lngkoor": "111° 23' 50.27\" E"
           
      },  {
              "lat": -6.60507220477149,
              "lng": 109.93039137953596,
               "latkoor": "6° 36' 18.26\" S",
              "lngkoor": "109° 55' 49.41\" E"
          } 
      
  ]
  
    localStorage.setItem('mapDataSimulator', JSON.stringify(data));
  }

  const loadData = () => {
    const data : any = JSON.parse(localStorage.getItem('mapDataSimulator'));
   
    
   
    if (data) { 
      const gmaps = map();
 
      // Load markers
      const newMarkers = data.map(position => {
        const marker = new google.maps.Marker({
          position,
          icon: {
            url: '/rb.png',
            scaledSize: new google.maps.Size(30, 30),
          },
          map: gmaps,
          draggable: true,
        });
       

        marker.addListener("drag", () => {
          // Update the path of the polyline when marker is dragged
          const markerIndex = markers().indexOf(marker); 
        });

        const infoWindow = new google.maps.InfoWindow();
        setInfoWindow(infoWindow);

        marker.addListener("click", () => {
          // Remove marker and update polyline
          // marker.setMap(null);
          const markerIndex = markers().indexOf(marker); 
          setMarkers(markers().filter(m => m !== marker));
 
        setLongLat({"latitude": position.lat, "longitude": position.lng}) 
        setLongLatKoor({"latitude": position.latkoor, "longitude": position.lngkoor})
        infoWindow.setContent(document.getElementById('popup-container-gis-simulator').innerHTML);
         infoWindow.open(gmaps, marker);
        });

        return marker;
      });

      setMarkers(newMarkers); 
  }
};



  onMount(() => {
    

    
    setTimeout(() => {
      saveData()
    },100)
    mapLoader.load().then(() => {
      const gmaps = new google.maps.Map(mapRef as HTMLElement, {
        center: { lat: -2.5, lng: 118.0 },
        zoom: 4.8,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: false,
        mapTypeControl: false,
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

      // gmaps.data.addGeoJson({
      //   "type": "FeatureCollection",
      //   "features": [
      //     {
      //       "type": "Feature",
      //       "properties": {
      //         "id": "1",
      //         "region": "Tg. Berakit",
      //         "place": "Tg. Berakit",
      //         "titik_dasar": "Titik Dasar No. TD.001",
      //         "no": "No. 431",
      //         "pilar_pendekat": "Pilar Pendekat No. TR.001",
      //         "scale": "1 : 200.000",
      //         "distance": "Jarak TD.001-TD.001A = 19.19 nm",
      //         "garis_pangkal": "Garis Pangkal Lurus Kepulauan"
      //       },
      //       "geometry": {
      //         "type": "Point",
      //         "coordinates": [
      //           104.57555555555555,
      //           1.2408333333333335
      //         ]
      //       }
      //     },
      //     {
      //       "type": "Feature",
      //       "properties": {
      //         "id": "2",
      //         "region": "P. Sentut",
      //         "place": "P. Sentut",
      //         "titik_dasar": "Titik Dasar No. TD.001A",
      //         "no": "No. 430, 431",
      //         "pilar_pendekat": "Pilar Pendekat No. TR.001A",
      //         "scale": "1 : 200.000",
      //         "distance": "Jarak TD.001A-TD.022 = 88.06 nm",
      //         "garis_pangkal": "Garis Pangkal Lurus Kepulauan"
      //       },
      //       "geometry": {
      //         "type": "Point",
      //         "coordinates": [
      //           104.83055555555555,
      //           1.047777777777778
      //         ]
      //       }
      //     },
      //     {
      //       "type": "Feature",
      //       "properties": {
      //         "id": "3",
      //         "region": "P.Tokong Malang Biru",
      //         "place": "P.Tokong Malang Biru",
      //         "titik_dasar": "Titik Dasar No. TD.022",
      //         "no": "No. 430",
      //         "pilar_pendekat": "Pilar Pendekat No. TR.022",
      //         "scale": "1 : 200.000",
      //         "distance": "Jarak TD.022-TD.023 = 29.50 nm",
      //         "garis_pangkal": "Garis Pangkal Lurus Kepulauan"
      //       },
      //       "geometry": {
      //         "type": "Point",
      //         "coordinates": [
      //           105.59638888888888,
      //           2.3
      //         ]
      //       }
      //     }
      //   ]
      // })

      // const mapMarkers = pointsState().map((user: any) => {
      //   const marker = new google.maps.Marker({
      //     position: { lat: user.latitude, lng: user.longitude },
      //     icon: {
      //       url: '/rb.png',
      //       scaledSize: new google.maps.Size(30, 30),
      //     },
      //   });

      //   const contentString = `
      //     <div class="custom-popup">
      //       <h3 class="flex justify-center">${user.province}</h3>
      //     </div>
      //   `;
      //   const infoWindow = new google.maps.InfoWindow({
      //     content: contentString,
      //   });
      //   marker.addListener("click", () => {
      //     infoWindow.open(gmaps, marker);
      //   });

      //   return marker;
      // });
      // setMarkers(mapMarkers);

      const infoWindow = new google.maps.InfoWindow();
      setInfoWindow(infoWindow);

      gmaps.addListener("click", (event : any) => {
        // const path = newPolyline.getPath();
        // path.push(event.latLng);

        // const newMarker = new google.maps.Marker({
        //   position: event.latLng,
        //   icon: {
        //     url: '/rb.png',
        //     scaledSize: new google.maps.Size(30, 30),
        //   },
        //   map: gmaps,
        //   draggable: true,
        // });

        // newMarker.addListener("drag", () => {
        //   // Update the path of the polyline when marker is dragged
        //   const markerIndex = markers().indexOf(newMarker);
        //   path.setAt(markerIndex, newMarker.getPosition());
        // });

        // newMarker.addListener("click", () => { 
        //   setPopupContent(
        //     <MarkerPopup
        //       title="Marker Info"
        //       description={`Latitude: ${event.latLng.lat()}, Longitude: ${event.latLng.lng()}`}
        //     />
        //   );

        //   infoWindow.setContent(document.getElementById('popup-container').innerHTML);
        //   infoWindow.open(gmaps, newMarker);
        // });

        // setMarkers([...markers(), newMarker]);

        
      })

      setTimeout(() => {

        // loadData();
      },100)

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
    //   drawingManager.setMap(gmaps);

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

    if (popupContent()) {
      infoWindow().setContent(document.getElementById('popup-container').innerHTML);
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

  
  
  const [scrollBehavior, setScrollBehavior] = createSignal("inside"); 
const [isOpenDataRute, setIsOpenDataRute] = createSignal(false); 
const onOpenDataRute = () => setIsOpenDataRute(true);
const onCloseDataRute = () => {
  props.closeSend
  console.log("close data -> ")
  // const dataRuteLocal : any = JSON.parse(localStorage.getItem('dataRute')); 
  setIsOpenDataRute(false)
 
};


const handleRuteKapalDetect = (res: any) => {
  props.detect = true;
};

  return (
    
    <>
    <div id="map-container">
       <Button   onClick={onOpenDataRute} style="  
              margin-bottom: -10vh;
    right: 10px;
    top: 10px;
    z-index: 10;
    float: inline-end;" class="btstatyls"   leftIcon={<AiOutlinePlus boxSize={18} style="color:black"  />}>
                                <span class="fntls">Tambah</span>
                            </Button>
      <div id="map-simulator" ref={el => mapRef = el}>
     
      </div>
      <div id="popup-container-gis-simulator" style={{ display: 'none' }}>
              <div style="      margin-top: 10px;
    background: #85319C80;
    padding: 20px;
    padding-left: 30px;">
                <Flex>
                  <div class="fngis">Area Terpilih : {longlatKoor().latitude} ({longlat().latitude}) , {longlatKoor().longitude} ({longlat().longitude})</div>
                  <div>
                    {/* <Button id="myButton" class="btgis" leftIcon={<AiOutlinePlus boxSize={18} style="color:black;    font-size: 13px !important;" />}>
                      <span class="fntlsgis">Tambah</span>
                    </Button>  */}
                  </div>

                </Flex>
              </div>
            </div>
    </div>

    <Modal  centered size={'6xl'}
        scrollBehavior={scrollBehavior()}
        opened={isOpenDataRute()} 
        onCloseAsset={onCloseDataRute}
      >
        <ModalOverlay  />
        <ModalContent> 
          <ModalBody>
         <LogSimulasiPopUpRuteAdd  closeSend={onCloseDataRute()} detect={props.detect}/>
          </ModalBody> 
        </ModalContent>
      </Modal>
    </>
  );
}

export default LogSimulasiMapEditorSimulator;




const MarkerPopup = (props : any) => {
  return (
    <div class="custom-popup">
    <h1>cek</h1>
    </div>
  );
};

