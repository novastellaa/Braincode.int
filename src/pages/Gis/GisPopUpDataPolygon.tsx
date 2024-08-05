import { Component, createEffect, onCleanup, onMount, Show } from "solid-js";
import { createSignal } from "solid-js";
import './GisPopUpDataPolygon.css'
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
import { fetchDataPolygonAdd } from "../../service/service";

type GisPopUpDataPolygonProps = {
  closeSend?: any,
  detect?: any
};

const mapLoader = new Loader({
  apiKey: 'AIzaSyCU-SCtr4kQc3yZgC2rRQbtwtZFYanfo98',
  version: 'weekly',
  libraries: ['places', 'drawing'],
});
const GisPopUpDataPolygon: Component<GisPopUpDataPolygonProps> = (props) => {

  let mapRef: HTMLDivElement | undefined;
  let drawingManager: google.maps.drawing.DrawingManager | undefined;
  let line: google.maps.Polyline | undefined;
  let polygon: google.maps.Polygon | undefined;;
  let rectangle: google.maps.Rectangle | undefined;
  let circle: google.maps.Circle | undefined;
  let marker: google.maps.Marker | undefined;

  
  const [alertStatusOk, setAlertStatusOk] = createSignal(false); 
  const [alertStatusError, setAlertStatusError] = createSignal(false); 
  const [map, setMap] = createSignal<google.maps.Map | null>(null);
  const [markers, setMarkers]: any = createSignal<google.maps.Marker[]>([]);
  const [polyline, setPolyline]: any = createSignal(null);
  const [polygonS, setPolygonS]: any = createSignal(null);
  const [markersNew, setMarkersNew]: any = createSignal(null);
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [polygonCoords, setPolygonCoords] = createSignal([]);
  const [markersArray, setMarkersArray] = createSignal([]);
  const [infoWindow, setInfoWindow]: any = createSignal(null);
  const [popupContent, setPopupContent] = createSignal(null);

  const [longlat, setLongLat]: any = createSignal({});
  const [longlatKoor, setLongLatKoor]: any = createSignal({});


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

  const isPointWithinBounds = (point: any, firstMarkerPos: any, secondMarkerPos: any) => {
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

    
        let drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.POLYGON,
          drawingControl: false,
          polygonOptions: {
            strokeColor: '#e6b238',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#e6b238',
            fillOpacity: 0.35,
            editable: false,
            draggable: false
          },
        });
        drawingManager.setMap(gmaps);
  
        const infoWindow = new google.maps.InfoWindow();
        setInfoWindow(infoWindow);
  
        google.maps.event.addListener(drawingManager, 'overlaycomplete', (event) => {
          if (event.type === google.maps.drawing.OverlayType.POLYGON) {
            let polygon = event.overlay;
            polygon.setEditable(true);
            polygon.setDraggable(true);

            const area = google.maps.geometry.spherical.computeArea(polygon.getPath()); 
            console.log("Area" , area.toFixed(2) )

  
            let path = polygon.getPath(); 
            console.log("path polygon -> " , path);
            
              if (path.getLength() == 2) { 
                const latLng = path.getAt(2);
                addMarker(latLng);
                showInfoWindowAtLastMarker();
                 setPolygonS(path);
              }
              else if (path.getLength() >= 3) { 
                while (path.getLength() > 3) {
                  path.removeAt(path.getLength() - 1);
                }
                const latLng = path.getAt(2);
                addMarker(latLng);
                showInfoWindowAtLastMarker();
                setPolygonS(path);
              } 
            google.maps.event.addListener(polygon, 'click', () => {
              if (path.getLength() >= 3) { 
                showInfoWindowAtLastMarker();
              }
            });

          //   google.maps.event.addListener(polygon, 'click', () => {
          //     if (confirm('Do you want to remove this polygon?')) {
          //         polygon.setMap(null);
          //         polygon = null; 
          //         markersArray().forEach(marker => marker.setMap(null));
          //         markersArray([])
          //     }
          // });
          }
        });
  
        const addMarker = (latLng) => { 
          const newMarker = new google.maps.Marker({
            position: latLng,
            icon: {
              url: '/rb.png',
              scaledSize: new google.maps.Size(30, 30),
            },
            map: gmaps,
            draggable: true,
          });
  
          newMarker.addListener("click", () => {
            newMarker.setMap(null);
            setMarkersArray(markersArray().filter(marker => marker !== newMarker));
          });
  
          setMarkersArray([...markersArray(), newMarker]);
        };
  
        const showInfoWindowAtLastMarker = () => {
          console.log("L")
          const lastMarker = markersArray()[markersArray().length - 1];
          infoWindow.setContent(document.getElementById('popup-container-gis-add').innerHTML);
          infoWindow.open(gmaps, lastMarker);
        };
  
        google.maps.event.addListener(infoWindow, 'domready', () => {
          const button = document.getElementById('myButton');
          if (button) {
            button.addEventListener('click', onOpen);
          }
        });
  
  });

 
      });


  const handlePolygonDrag = () => {
    const currentPolygon = polygonS();
    if (currentPolygon) {
        const paths = currentPolygon.getPaths();
        const path = paths.getAt(0);  // Mengambil cincin pertama

        const coordinates: any = [];
        for (let i = 0; i < path.getLength(); i++) {
            const latLng = path.getAt(i);
            coordinates.push({ lat: latLng.lat(), lng: latLng.lng() });
        }
        setPolygonCoords(coordinates);
        console.log('Updated Polygon Coordinates: ', coordinates);
    } else {
        console.error("Polygon is not defined");
    }
};
  onCleanup(() => {
    markers().forEach((marker: any) => {
      google.maps.event.clearInstanceListeners(marker);
    });
  });

  createEffect(() => {

  });


  const addLocation = () => {
    console.log("nama lokasi -> ", nama());

    const markerPositions = markers().map((marker: any) => ({
      lat: marker.getPosition().lat(),
      lng: marker.getPosition().lng()
    }));

    // const polygonPath = polygon().getPath().getArray().map((latLng: any) => ({
    //   lat: latLng.lat(),
    //   lng: latLng.lng()
    // }));

    let polygon_data : any = [];
    polygonS().forEach((latLng: { lat: () => any; lng: () => any; }, index: number) => {
      let lat = latLng.lat();
      let lng = latLng.lng();
      console.log(`Point ${index + 1}: Latitude: ${lat}, Longitude: ${lng}`); 
      polygon_data.push({
        "lat": lat,
        "lng": lng
      },)
    });
    const area = google.maps.geometry.spherical.computeArea(polygonS()); 
    console.log("Area" , area.toFixed(2) )
    console.log("polygon_data" , polygon_data )


    let data = {
      "lokasi": nama(),
      "luas": Number(area.toFixed(2)),
      // "latitude": longlatKoor().latitude + '(' + longlat().latitude + ')',
      // "longitude": longlatKoor().longitude + '(' + longlat().longitude + ')',
      "markers": polygon_data,
      // "polyline": polylinePath
    }
    console.log("event DATA ALL -> ", data);
    
    console.log("event DATA ALL -> ", JSON.stringify(data));

    if(nama() !== null ) { 
      fetchDataPolygonAdd(data).then((data: any) => {
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
    // onClose()
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
                    <img src='/polygon.png' style="width:30px;height:30px"></img>
                  </span>
                  <span style="font-family: 'jaldiBold';
    color: white;
    margin-left: 10px;
    margin-top: 5px;">Tambah Data Polygon</span>
                </Flex>
              </div>

              <div class="w20">
                <AiFillCloseSquare onClick={() => props.closeSend} class="cp" style="cursor:pointer" />

              </div>
            </Flex>
          </div>


          <div id="map-container-add-data-gis-polygon-point">
            <div ref={el => mapRef = el} id="map-add-data-gis-polygon" ></div>
            <Show
  when={alertStatusOk()}
  fallback={''}
>
<Alert status="success" variant="subtle">
    <AlertIcon mr="$2_5" />
   Menambah Data Polygon Berhasil !
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
                  <div class="fngis">Area Terpilih : titik longlat 1 , titik longlat 2 , titik longlat 3</div>
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
                  <span class="fngisadd">Apakah Anda ingin mengubah nama Area ini?</span>
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
export default GisPopUpDataPolygon;


function toDMS(coordinate: any, isLatitude: any) {
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