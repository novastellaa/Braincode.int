import { Component, createEffect, onCleanup, onMount, Show } from "solid-js";
import { createSignal } from "solid-js";
import './GisPopUpDataPolyline.css'
import { Flex, Spacer } from "@hope-ui/solid"
import { Button } from "@hope-ui/solid"
import { Select, createOptions } from "@thisbeyond/solid-select";
import "@thisbeyond/solid-select/style.css";
import AgGridSolid, { AgGridSolidRef } from "ag-grid-solid";
import { ColDef } from "ag-grid-community";
import "ag-grid-enterprise";
import { BiRegularSearchAlt } from "solid-icons/bi";
import { AiOutlinePlus } from 'solid-icons/ai'
import { BsFilterSquare } from "solid-icons/bs"; 
import { AiFillCloseSquare } from 'solid-icons/ai'
import { 
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@hope-ui/solid"
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@hope-ui/solid"
import { Portal } from 'solid-js/web';

import {
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
} from "@hope-ui/solid"
import { AiTwotoneCloseCircle } from 'solid-icons/ai'

import { pointsState, titleState, setTitleState } from '../../store/store';
import { Loader } from '@googlemaps/js-api-loader';
import { fetchDataPolylineAdd } from "../../service/service";

type GisPopUpDataPolylineProps = {
  closeSend?: any,
  
  detect?: any
};

const mapLoader = new Loader({
  apiKey: 'AIzaSyCU-SCtr4kQc3yZgC2rRQbtwtZFYanfo98',
  version: 'weekly',
  libraries: ['places', 'drawing'],
});
const GisPopUpDataPolyline: Component<GisPopUpDataPolylineProps> = (props) => {

  let mapRef: HTMLDivElement | undefined;
  let drawingManager: google.maps.drawing.DrawingManager | undefined;
  let line: google.maps.Polyline | undefined;
  let polygon: google.maps.Polygon | undefined;
  let rectangle: google.maps.Rectangle | undefined;
  let circle: google.maps.Circle | undefined;
  let marker: google.maps.Marker | undefined;

  
  const [alertStatusOk, setAlertStatusOk] = createSignal(false); 
  const [alertStatusError, setAlertStatusError] = createSignal(false); 
  const [map, setMap] = createSignal<google.maps.Map | null>(null);
  const [markers, setMarkers] : any = createSignal<google.maps.Marker[]>([]);
  const [polyline, setPolyline]: any = createSignal(null);
  const [markersNew, setMarkersNew]: any = createSignal(null);
  const [isModalOpen, setIsModalOpen] = createSignal(false);

  const [infoWindow, setInfoWindow] : any = createSignal(null);
  const [popupContent, setPopupContent] = createSignal(null);
  
  const [longlat, setLongLat] : any = createSignal({});
  const [longlatKoor, setLongLatKoor] : any = createSignal({});


  const [isOpenKoor, setisOpenKoor] = createSignal(false);

  const onOpen = () => setisOpenKoor(true);
  const onClose = () => {
    console.log("onClose")
      setisOpenKoor(false)
  };

  const [nama, setNama] : any = createSignal(null);
  const [luas, setLuas] = createSignal("2.173.362 km²"); 
  const handleChangeNama = (event: Event) => {
   const input = event.target as HTMLInputElement; 
   setNama(input.value);
 };

 const isPointWithinBounds = (point: any, firstMarkerPos:any, secondMarkerPos: any) => {
  const bounds = new google.maps.LatLngBounds();
  bounds.extend(firstMarkerPos);
  bounds.extend(secondMarkerPos);
  return bounds.contains(point);
};
  

  onMount(() => {
    mapLoader.load().then(() => {
      const gmaps = new google.maps.Map(mapRef as HTMLElement, {
        center: { lat: -2.5, lng: 118.0 },
        zoom: 4.8,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        fullscreenControl: true,
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

      //   const mapMarkers = pointsState().map((user: any) => {
      //     const marker = new google.maps.Marker({
      //       position: { lat: user.latitude, lng: user.longitude },
      //       icon: {
      //         url: '/rb.png',
      //         scaledSize: new google.maps.Size(30, 30),
      //       },
      //     });

      //     const contentString = `
      //       <div class="custom-popup">
      //         <h3 class="flex justify-center">${user.province}</h3>
      //       </div>
      //     `;
      //     const infoWindow = new google.maps.InfoWindow({
      //       content: contentString,
      //     });
      //     marker.addListener("click", () => {
      //       infoWindow.open(gmaps, marker);
      //     });

      //     return marker;
      //   });
      //   setMarkers(mapMarkers);

      
      const newPolyline = new google.maps.Polyline({
        path: [],
        geodesic: true,
        strokeColor: "#ffc746",
        strokeOpacity: 1.0,
        strokeWeight: 0.4,
        editable: true,
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

    const path = newPolyline.getPath();

    path.addListener('set_at', () => {
      console.log("Polyline point set at new position");
      handlePolylineDrag();
  });
  
  path.addListener('insert_at', () => {
      console.log("New point inserted into polyline");
      handlePolylineDrag();
  });
  
  path.addListener('remove_at', () => {
      console.log("Point removed from polyline");
      handlePolylineDrag();
  });
  
  newPolyline.addListener('mouseup', () => {
      console.log("Polyline drag ended");
      handlePolylineDrag();
  });
  
  const handlePolylineDrag = () => {
      if (markers().length === 2) {
          const polylinePath = newPolyline.getPath();
          const subPath = new google.maps.MVCArray();
   
          for (let i = 0; i < polylinePath.getLength(); i++) {
              const point = polylinePath.getAt(i);
              if (point.equals(markers()[0].getPosition()) || subPath.getLength() > 0) {
                  subPath.push(point);
              }
              if (point.equals(markers()[1].getPosition())) {
                  break;
              }
          }
  
          const distance = google.maps.geometry.spherical.computeLength(subPath);
  
          console.log("jarak: ", distance, " meter");
      }
  };
  


      const infoWindow = new google.maps.InfoWindow();
      setInfoWindow(infoWindow);

      gmaps.addListener("click", (event: any) => {
        console.log('masuk click polyline')
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        if (markers().length >= 2) {
                    
          console.log( "marker -> ", markers())
         
          // Get positions of the first and second markers
          const firstMarkerPos = markers()[0].getPosition();
          const secondMarkerPos = markers()[1].getPosition();
  
          // Restrict clicks outside the bounds of the markers
          if (!isPointWithinBounds(event.latLng, firstMarkerPos, secondMarkerPos)) {
            return;
          }
        }


        
        const path = newPolyline.getPath();

        path.push(event.latLng);
                if (markers().length < 2) {
                    const newMarker = new google.maps.Marker({
                        position: event.latLng,
                        icon: {
                            url: '/rb.png',
                            scaledSize: new google.maps.Size(30, 30),
                        },
                        map: gmaps,
                        draggable: true, 
                    });

                    setMarkersNew(newMarker);

                    newMarker.addListener("drag", () => {
                        const markerIndex = markers().indexOf(newMarker);
                        path.setAt(markerIndex, newMarker.getPosition());
                    });

                    newMarker.addListener("click", () => {
                        newMarker.setMap(null);
                        const markerIndex = markers().indexOf(newMarker);
                        path.removeAt(markerIndex);
                        setMarkers(markers().filter(marker => marker !== newMarker));
                    });

                    if(markers().length == 1){
                    infoWindow.setContent(document.getElementById('popup-container-gis-add').innerHTML);
        
                    console.log("NEW -> ", newMarker);
                    infoWindow.open(gmaps, newMarker);
                  }
            
                    setMarkers([...markers(), newMarker]);
                }
        

        console.log("Latitude: ", lat, "Longitude: ", lng);
        setLongLat({"latitude": lat, "longitude": lng})
        const latDMS = toDMS(lat, true);
        const lonDMS = toDMS(lng, false);
        setLongLatKoor({"latitude": latDMS, "longitude": lonDMS})
        if (markers().length === 2) {

        console.log("M 1", markers()[0].getPosition() );
        const firstMarkerPos = markers()[0].getPosition();
        const latFirst = firstMarkerPos.lat();
        const lngFirst = firstMarkerPos.lng();
        
        console.log("Latitude of first marker: ", latFirst);
        console.log("Longitude of first marker: ", lngFirst);

        console.log("M 2", markers()[1].getPosition() ); 
        const secondMarkerPos = markers()[1].getPosition();
        const latSecond = secondMarkerPos.lat();
        const lngSecond = secondMarkerPos.lng();
        
        console.log("Latitude of second marker: ", latSecond);
        console.log("Longitude of second marker: ", lngSecond);
        }

      //   if (markers().length === 2) {

      //     const distance = google.maps.geometry.spherical.computeDistanceBetween(
      //         markers()[0].getPosition(),
      //         markers()[1].getPosition()
      //     );
 
      //     console.log("Distance between markers: ", distance, " meters");
      // }

      if (markers().length === 2) {
        handlePolylineDrag();
    }

      });

      google.maps.event.addListener(infoWindow, 'domready', () => {
        const button = document.getElementById('myButton');
        if (button) {
          button.addEventListener('click', onOpen);
        } 
      })

     

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
          const bounds: any = (event.overlay as google.maps.Rectangle).getBounds();
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
  

   const addLocation = () => { 
    console.log("nama lokasi -> " , nama());

    const markerPositions = markers().map((marker: any) => ({
      lat: marker.getPosition().lat(),
      lng: marker.getPosition().lng()
  }));

  const polylinePath = polyline().getPath().getArray().map((latLng: any) => ({
      lat: latLng.lat(),
      lng: latLng.lng()
  }));

  console.log("JSON -> ", JSON.stringify(polylinePath))

  const path : any = polylinePath.map((point : any) => new google.maps.LatLng(point.lat, point.lng));
  const polylines  : any = new google.maps.Polyline({ path });
  const length = google.maps.geometry.spherical.computeLength(polylines.getPath());

  console.log(`Jarak  polyline: ${length} meter`);

  const latLng1 = new google.maps.LatLng(markerPositions[0].lat, markerPositions[0].lng);
  const latLng2 = new google.maps.LatLng(markerPositions[1].lat, markerPositions[1].lng);
  const distance = google.maps.geometry.spherical.computeDistanceBetween(latLng1, latLng2);
  console.log(`Jarak markers: ${distance} meter`);

    
    let data = {
        "lokasi": nama(),
        "jarak_polyline": length,
        "jarak_marker": distance,
        // "lat": longlat().latitude,
        // "lng":longlat().longitude,
        // "lat_koor": longlatKoor().latitude,
        // "lng_koor": longlatKoor().longitude,
        "markers": markerPositions,
        "polylines": polylinePath
    } 
    console.log("event DATA ALL -> ", data);
    console.log("event DATA ALL -> ", JSON.stringify(data));
     
    if(nama() !== null ) { 
      fetchDataPolylineAdd(data).then((data: any) => {
        console.log("data add -> ", data);
        if(data.status === 'ok'){
        setAlertStatusOk(true)
        setTimeout(() => {
    setAlertStatusOk(false)
        },1000) 
        setNama(null); 
        props.detect(true);  
        onClose()  
      }
      }) 
   
    }else{
      setAlertStatusError(true)
      setTimeout(() => {
  setAlertStatusError(false)
      },1000) 
   
    }
//     const dataGisLocal : any = JSON.parse(localStorage.getItem('dataGis')); 
// console.log("before add -> ", dataGisLocal);
// dataGisLocal.push(data)
//     localStorage.setItem('dataGis', JSON.stringify(dataGisLocal));  
   
  };

  return ( 
    <>

      <div style="border: 1px solid #c295d0c2;
      background: #817f86;
    border-radius: 20px;">
        <div style="   
    padding: 2.4vh;">

          <div style="width:100%" class="dvp">
            <Flex>
              <div style="width:80%">
                <Flex>
                <span>
                        <img src='/polyline.png' style="width:30px;height:30px"></img>
                      </span>
                  <span style="font-family: 'jaldiBold';
    color: white;
    margin-left: 10px;
    margin-top: 5px;">Tambah Data Line</span>
                </Flex>
              </div>

              <div class="w20">
                <AiFillCloseSquare onClick={() => props.closeSend} class="cp" style="cursor:pointer" />

              </div>
            </Flex>
          </div>

  
          <div id="map-container-add-data-gis-polyline-point">
            <div id="map-add-data-gis-polyline" ref={el => mapRef = el}></div>
            <Show
  when={alertStatusOk()}
  fallback={''}
>
<Alert status="success" variant="subtle">
    <AlertIcon mr="$2_5" />
   Menambah Data Line Berhasil !
  </Alert>
</Show>


<Show
  when={alertStatusError()}
  fallback={''}
>
<Alert status="danger" variant="subtle">
    <AlertIcon mr="$2_5" />
  Lengkapi isian form terlebih dahulu !
  </Alert>
</Show>
            <div id="popup-container-gis-add" style={{ display: 'none' }}>
              <div style="      margin-top: 10px;
    background: #85319C80;
    padding: 20px;
    padding-left: 30px;">
                <Flex>
                  {/* <div class="fngis">Garis Terpilih : {longlatKoor().latitude} ({longlat().latitude}) , {longlatKoor().longitude} ({longlat().longitude})</div> */}
                  <div class="fngis">Garis Terpilih : titik longlat 1 , titik longlat 2</div>
                  <div>
                    <Button id="myButton" class="btgis" leftIcon={<AiOutlinePlus boxSize={18} style="color:black;    font-size: 13px !important;" />}>
                      <span class="fntlsgis">Tambah</span>
                    </Button> 
                  </div>

                </Flex>
              </div>
            </div>
          </div>

          <Modal size={'xs'} opened={isOpenKoor()} onClose={onClose} centered="true">
        <ModalOverlay />
        <ModalContent>
          {/* <ModalCloseButton /> */}
          {/* <ModalHeader>Modal Title</ModalHeader> */}
          <ModalBody>
            <div style="    text-align: end;
    justify-content: end;
    display: flex;
    margin-top: 10px;cursor:pointer">
            <AiFillCloseSquare onClick={onClose} class="w20i" />
            </div>
            <div style="    text-align: center;
    margin-top: 10px;">
          <span class="fngisadd">Apakah Anda ingin mengubah nama Garis ini?</span>
           <div style="padding: 35px;
    padding-top: 10px;
    padding-bottom: 20px;"> 
             <Input onChange={handleChangeNama} style="text-align: center !important;
    font-family: jaldiBold;
    border: 1px solid #626262 !important;
    color: #404040 !important;" placeholder="Ubah Nama" size="sm" />
             </div>
          
          <div style="text-align: center;
    margin-bottom: 10px;
    margin-top: 10px;">
            <Button class="btgisadd">
             <span class="fntlsgisadd" onClick={addLocation}>Simpan</span>
              </Button> 
              </div>
              </div>
          </ModalBody>
          {/* <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>


        </div>
      </div>

    </>
  );
};
export default GisPopUpDataPolyline;


function toDMS(coordinate : any, isLatitude : any) {
  const absolute = Math.abs(coordinate);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);

  const direction = coordinate < 0 
    ? isLatitude ? 'S' : 'W' 
    : isLatitude ? 'N' : 'E';

  return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
}