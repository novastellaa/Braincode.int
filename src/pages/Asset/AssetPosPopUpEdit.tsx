import { Component, createEffect, onCleanup, onMount, Show } from "solid-js";
import { createSignal } from "solid-js";
import './AssetPosPopUpEdit.css'
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
import { fetchDataAssetPosAdd, fetchDataAssetPosUpdate } from "../../service/service";
import { RiSystemDeleteBin2Line } from "solid-icons/ri";
import { FiEdit } from "solid-icons/fi";

type AssetPosPopUpEditProps = {
  closeSend?: any,
  detect?: any,
  dataPos?: any,
};

const mapLoader = new Loader({
  apiKey: 'AIzaSyCU-SCtr4kQc3yZgC2rRQbtwtZFYanfo98',
  version: 'weekly',
  libraries: ['places', 'drawing'],
});
const AssetPosPopUpEdit: Component<AssetPosPopUpEditProps> = (props) => {

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

  const [infoWindow, setInfoWindow] : any = createSignal(null);
  const [popupContent, setPopupContent] = createSignal(null);

  const [longlat, setLongLat]: any = createSignal({});
  const [longlatKoor, setLongLatKoor]: any = createSignal({});


  const [isOpenKoor, setisOpenKoor] = createSignal(false);

  const onOpen = () => setisOpenKoor(true);
  const onClose = () => {
    console.log("onClose")
    setisOpenKoor(false)
  };
  


  onMount(() => {

    console.log("data POS -> ", props.dataPos);
    let dataEditPos = props.dataPos;
    setAssetGrup(dataEditPos.grup);
    setLokasi(dataEditPos.lokasi);
    setLatitude(dataEditPos.lat);
    setLongitude(dataEditPos.lng);
    setIdLokasi(dataEditPos.id.id.String);


    setLongLat({ "latitude": dataEditPos.lat, "longitude": dataEditPos.lng })
        const latDMS = toDMS(dataEditPos.lat, true);
        const lonDMS = toDMS(dataEditPos.lng, false);
        setLongLatKoor({ "latitude": latDMS, "longitude": lonDMS })

    mapLoader.load().then(() => {
      const gmaps = new google.maps.Map(mapRef as HTMLElement, {
        center: { lat: Number(latitude()), lng: Number(longitude()) },
        zoom: 5.8,
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

    setTimeout(() => {
      loadEditMap(gmaps);
    }, 100)

      const infoWindow = new google.maps.InfoWindow();
      setInfoWindow(infoWindow);

      gmaps.addListener("click", (event: any) => { 
        console.log("event.latLng -> ", event.latLng)
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        console.log("Latitude: ", lat, "Longitude: ", lng);
        setLongLat({ "latitude": lat, "longitude": lng })
        const latDMS = toDMS(lat, true);
        const lonDMS = toDMS(lng, false);
        setLongLatKoor({ "latitude": latDMS, "longitude": lonDMS })
        setLatitude(event.latLng.lat())
        setLongitude(event.latLng.lng())

        const newMarker = new google.maps.Marker({
          position: event.latLng,
          icon: {
            url: '/rb.png',
            scaledSize: new google.maps.Size(30, 30),
          },
          map: gmaps,
          draggable: true,
        });
        infoWindow.setContent(document.getElementById('popup-container-gis-edit-new').innerHTML);

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

  
    // setTimeout(() => {  
      
    //   loadEditMap()
    // },1000)
  
   
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

  const loadEditMap = (param : any) => {
  

    const newMarker = new google.maps.Marker({
      position:{ lat: Number(latitude()), lng: Number(longitude()) },
      icon: {
        url: '/rb.png',
        scaledSize: new google.maps.Size(30, 30),
      },
      map: param,
      draggable: true,
    });
    const infoWindows  : any = new google.maps.InfoWindow();
    setInfoWindow(infoWindows);
    infoWindows.setContent(document.getElementById('popup-container-gis-edit').innerHTML);
    infoWindows.open(param, newMarker);

    newMarker.addListener("click", () => {
      newMarker.setMap(null);
      setMarkers(markers().filter(marker => marker !== newMarker));
    });

    setMarkers([...markers(), newMarker]);
  }


  const [assetGrup, setAssetGrup] : any = createSignal(null);
  const [lokasi, setLokasi] : any = createSignal(null);
  const [latitude, setLatitude] : any= createSignal(null);
  const [longitude, setLongitude] : any = createSignal(null);
  const [idLokasi, setIdLokasi] : any = createSignal(null);

 
  const handleChangeAssetGrup = (event: Event) => {
    const input = event.target as HTMLInputElement; 
    setAssetGrup(input.value); 
  };
  const handleChangeLokasi = (event: Event) => {
    const input = event.target as HTMLInputElement; 
    setLokasi(input.value); 
  };
  const handleChangeLatitude = (event: Event) => {
    const input = event.target as HTMLInputElement; 
    setLatitude(input.value); 
  };
  const handleChangeLongitude = (event: Event) => {
    const input = event.target as HTMLInputElement; 
    setLongitude(input.value); 
  };


  const editLocation = () => {
    // console.log("nama lokasi -> ", nama());

    let data = {
      "lokasi": lokasi(),
      "grup": assetGrup(),
      "lat": longlat().latitude.toString(),
      "lng": longlat().longitude.toString() ,
      "id":`asset_pos:${idLokasi()}`
    }
    // console.log("event DATA ALL -> ", data);

    if (lokasi() !== null && lokasi() !== "" && assetGrup() !== null && assetGrup() !== "") {



      fetchDataAssetPosUpdate(data).then((data: any) => {
        console.log("data add -> ", data);
        if (data.status === 'ok') {
          setAlertStatusOk(true)
          setTimeout(() => {
            setAlertStatusOk(false)
          }, 1000) 
          props.detect(true);
          onClose()
        }
      })

    } else {
      setAlertStatusError(true)
      setTimeout(() => {
        setAlertStatusError(false)
      }, 1000)

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
                    <img src='/asset_pos.png' style="width:30px;height:30px"></img>
                  </span>
                  <span style="font-family: 'jaldiBold';
    color: white;
    margin-left: 10px;
    margin-top: 5px;">Edit Data POS</span>
                </Flex>
              </div>

              <div class="w20">
                <AiFillCloseSquare onClick={() => props.closeSend} class="cp" style="cursor:pointer" />

              </div>
            </Flex>
          </div>


          <div id="map-container-asset-pos-edit">
            <div style="right: 10px;
    top: 25px;
    margin-bottom: -270px;
    z-index: 10;
    float: inline-end;
    background: none !important;
    position: relative !important;
    width: 400px;" >
              <div>
                <div style="    text-align: center;
    font-family: 'jaldiBold';
    font-size: 0.9em;
    height: 45px;
    backdrop-filter: blur(3px);
    padding-top: 11px;
    background: #ffffff8a;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    color: white;">
                  <Flex>
                    <div style="width:30%">Title</div>
                    <div style="width:5%"></div>
                    <div style="width:65%">Form</div>
                  </Flex>
                </div>
                <div style="    background: #ffffff45;
    backdrop-filter: blur(1px);
    border-bottom-left-radius: 10px;    padding-top: 8px;
    border-bottom-right-radius: 10px;    padding-bottom: 15px;">

                  <Flex style="    padding: 5px;">
                  <div style="width:30%;font-family: 'jaldiReg';
    color: white;
    font-size: 0.9em;
    margin-top: 5px;
    text-align: center;">Asset Grup</div>
                    <div style="width:5%; color: white;">:</div>
                    <div style="width:65%"><Input  onChange={handleChangeAssetGrup} value={assetGrup()} style="color: white; font-family: 'jaldiBold'; " placeholder="Asset Grup" size="sm" /></div>
                  </Flex>
                  <Flex style="    padding: 5px;">
                  <div style="width:30%;font-family: 'jaldiReg';
    color: white;
    font-size: 0.9em;
    margin-top: 5px;
    text-align: center;">Lokasi</div>
                    <div style="width:5%; color: white;">:</div>
                    <div style="width:65%"><Input  onChange={handleChangeLokasi} value={lokasi()}  style="color: white; font-family: 'jaldiBold'; " placeholder="Lokasi" size="sm" /></div>
                  </Flex>
                  <Flex style="    padding: 5px;">
                  <div style="width:30%;font-family: 'jaldiReg';
    color: white;
    font-size: 0.9em;
    margin-top: 5px;
    text-align: center;">Longitude</div>
                    <div style="width:5%; color: white;">:</div>
                    <div style="width:65%"><Input  onChange={handleChangeLongitude} value={longitude()} style="color: white; font-family: 'jaldiBold'; " placeholder="Longitude" size="sm" /></div>
                  </Flex>
                  <Flex style="    padding: 5px;">
                  <div style="width:30%;font-family: 'jaldiReg';
    color: white;
    font-size: 0.9em;
    margin-top: 5px;
    text-align: center;">Latitude</div>
                    <div style="width:5%; color: white;">:</div>
                    <div style="width:65%"><Input  onChange={handleChangeLatitude} value={latitude()}  style="color: white; font-family: 'jaldiBold'; " placeholder="Latitude" size="sm" /></div>
                  </Flex>
                  
                  <div style="    text-align: center;
    margin-top: 20px;">
                  <Button onClick={editLocation} style="background: rgb(136 19 198);box-shadow: 0px 4px 4px 0px #00000040;
    font-family: 'jaldiBold';" size="sm"  leftIcon={<FiEdit boxSize={17} />}>Edit</Button>
                  </div>

                </div>
              </div>
            </div>

            <div id="map-asset-pos-edit" ref={el => mapRef = el}></div>

            <Show
              when={alertStatusOk()}
              fallback={''}
            >
              <Alert status="success" variant="subtle">
                <AlertIcon mr="$2_5" />
                Mengedit Data POS Berhasil !
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


            <div id="popup-container-gis-edit" style={{ display: 'none' }}>
              <div style="      margin-top: 10px;
    background: #85319C80;
    padding: 20px;
    padding-left: 30px;">
                <Flex>
                  <div class="fngis">Titik Terpilih : {longlatKoor().latitude} ({longlat().latitude}) , {longlatKoor().longitude} ({longlat().longitude})</div>
                  </Flex>
              </div>
            </div>
            <div id="popup-container-gis-edit-new" style={{ display: 'none' }}>
              <div style="      margin-top: 10px;
    background: #85319C80;
    padding: 20px;
    padding-left: 30px;">
                <Flex>
                  <div class="fngisnew">Titik Baru : {longlatKoor().latitude} ({longlat().latitude}) , {longlatKoor().longitude} ({longlat().longitude})</div>
                  </Flex>
              </div>
            </div>

          </div>

       

        </div>
      </div>

    </>
  );
};
export default AssetPosPopUpEdit;


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