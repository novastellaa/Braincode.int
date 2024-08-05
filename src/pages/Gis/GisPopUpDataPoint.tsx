import { Component, createEffect, onCleanup, onMount, Show } from "solid-js";
import { createSignal } from "solid-js";
import './GisPopUpDataPoint.css'
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
import { fetchDataPointAdd } from "../../service/service";

type GisPopUpDataPointProps = {
  closeSend?: any,
  
  detect?: any
};

const mapLoader = new Loader({
  apiKey: 'AIzaSyCU-SCtr4kQc3yZgC2rRQbtwtZFYanfo98',
  version: 'weekly',
  libraries: ['places', 'drawing'],
});
const GisPopUpDataPoint: Component<GisPopUpDataPointProps> = (props) => {

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
  const [markers, setMarkers] = createSignal<google.maps.Marker[]>([]);

  const [isModalOpen, setIsModalOpen] = createSignal(false);

  const [infoWindow, setInfoWindow] = createSignal(null);
  const [popupContent, setPopupContent] = createSignal(null);
  
  const [longlat, setLongLat] : any = createSignal({});
  const [longlatKoor, setLongLatKoor] : any = createSignal({});


  const [isOpenKoor, setisOpenKoor] = createSignal(false);

  const onOpen = () => setisOpenKoor(true);
  const onClose = () => {
    console.log("onClose")
      setisOpenKoor(false)
  };

  const [lokasi, setLokasi] : any = createSignal(null);
  const [jenis, setJenis] : any = createSignal(null);
  const [titik, setTitik] : any = createSignal(null);
  const [batas, setBatas] : any = createSignal(null);
  const [luas, setLuas] = createSignal("2.173.362 km²"); 
  const handleChangeLokasi = (event: Event) => {
   const input = event.target as HTMLInputElement; 
   setLokasi(input.value);
 };
 const handleChangeJenis = (event: Event) => {
  const input = event.target as HTMLInputElement; 
  setJenis(input.value);
};
const handleChangeTitik = (event: Event) => {
  const input = event.target as HTMLInputElement; 
  setTitik(input.value);
};
const handleChangeBatas = (event: Event) => {
  const input = event.target as HTMLInputElement; 
  setBatas(input.value);
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
      const infoWindow = new google.maps.InfoWindow();
      setInfoWindow(infoWindow);

      gmaps.addListener("click", (event: any) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        console.log("Latitude: ", lat, "Longitude: ", lng);
        setLongLat({"latitude": lat, "longitude": lng})
        const latDMS = toDMS(lat, true);
        const lonDMS = toDMS(lng, false);
        setLongLatKoor({"latitude": latDMS, "longitude": lonDMS})

        const newMarker = new google.maps.Marker({
          position: event.latLng,
          icon: {
            url: '/rb.png',
            scaledSize: new google.maps.Size(30, 30),
          },
          map: gmaps,
          draggable: true,
        });
        infoWindow.setContent(document.getElementById('popup-container-gis-add').innerHTML);
        
        infoWindow.open(gmaps, newMarker);

        newMarker.addListener("click", () => {
          newMarker.setMap(null);
          setMarkers(markers().filter(marker => marker !== newMarker));
        });

        setMarkers([...markers(), newMarker]);

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
    
    
    let data = 
    {
      "batas": batas(), 
      "jenis": jenis(),
      "lat": longlat().latitude.toString(),
      "lat_koor":  longlatKoor().latitude,
      "lng": longlat().longitude.toString(),
      "lng_koor": longlatKoor().longitude,
      "lokasi": lokasi(),
      "no": 0,
      "titik": titik()
    }
    if(batas() !== null && jenis() !== null && lokasi() !== null && titik() !== null ) { 
      fetchDataPointAdd(data).then((data: any) => {
        console.log("data add -> ", data);
        if(data.status === 'ok'){
        setAlertStatusOk(true)
        setTimeout(() => {
    setAlertStatusOk(false)
        },1000) 
        setBatas(null);
        setJenis(null);
        setTitik(null);
        setLokasi(null);
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
                        <img src='/point.png' style="width:30px;height:30px"></img>
                      </span>
                  <span style="font-family: 'jaldiBold';
    color: white;
    margin-left: 10px;
    margin-top: 5px;">Tambah Data Point</span>
                </Flex>
              </div>

              <div class="w20">
                <AiFillCloseSquare onClick={() => props.closeSend} class="cp" style="cursor:pointer" />

              </div>
            </Flex>
          </div>

  
          <div id="map-container-add-data-gis-point -point">
            <div id="map-add-data-gis-point" ref={el => mapRef = el}></div>
            <Show
  when={alertStatusOk()}
  fallback={''}
>
<Alert status="success" variant="subtle">
    <AlertIcon mr="$2_5" />
   Menambah Data Point Berhasil !
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
                  <div class="fngis">Titik Terpilih : {longlatKoor().latitude} ({longlat().latitude}) , {longlatKoor().longitude} ({longlat().longitude})</div>
                  <div>
                    <Button id="myButton" class="btgis" leftIcon={<AiOutlinePlus boxSize={18} style="color:black;font-size: 13px !important;" />}>
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
          <span class="fngisadd">Tambah Data Point ?</span>
          <div style="padding: 35px;
    padding-top: 20px;
    padding-bottom: 0px;"> 
             <Input onChange={handleChangeLokasi} style="text-align: center !important;
    font-family: jaldiBold;
    border: 1px solid #626262 !important;
    color: #404040 !important;" placeholder="Lokasi"   _placeholder={{ 
      color: 'rgb(114 114 114) !important',  
    }} size="sm" />
             </div>
             <div style="padding: 35px;
    padding-top: 10px;
    padding-bottom: 0px;"> 
             <Input onChange={handleChangeTitik} style="text-align: center !important;
    font-family: jaldiBold;
    border: 1px solid #626262 !important;
    color: #404040 !important;" placeholder="Titik"   _placeholder={{ 
      color: 'rgb(114 114 114) !important',  
    }}  size="sm" />
             </div>
             <div style="padding: 35px;
    padding-top: 10px;
    padding-bottom: 0px;"> 
             <Input onChange={handleChangeJenis} style="text-align: center !important;
    font-family: jaldiBold;
    border: 1px solid #626262 !important;
    color: #404040 !important;" placeholder="Jenis"   _placeholder={{ 
      color: 'rgb(114 114 114) !important',  
    }}  size="sm" />
             </div>
             <div style="padding: 35px;
    padding-top: 10px;
    padding-bottom: 20px;"> 
             <Input onChange={handleChangeBatas} style="text-align: center !important;
    font-family: jaldiBold;
    border: 1px solid #626262 !important;
    color: #404040 !important;" placeholder="Batas"   _placeholder={{ 
      color: 'rgb(114 114 114) !important',  
    }}  size="sm" />
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
export default GisPopUpDataPoint;


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