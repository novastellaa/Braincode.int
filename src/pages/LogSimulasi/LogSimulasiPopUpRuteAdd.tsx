import { Component, createEffect, onCleanup, onMount, Show } from "solid-js";
import { createSignal, For } from "solid-js";
import './LogSimulasiPopUpRuteAdd.css'
import { Flex, Spacer } from "@hope-ui/solid"
import { Button } from "@hope-ui/solid"
import { Select, createOptions } from "@thisbeyond/solid-select";
import "@thisbeyond/solid-select/style.css";
import AgGridSolid, { AgGridSolidRef } from "ag-grid-solid";
import { ColDef } from "ag-grid-community";
import "ag-grid-enterprise";
import { BiRegularSearchAlt } from "solid-icons/bi";
import { AiFillCloseSquare, AiOutlinePlus } from 'solid-icons/ai'
import { BsFilterSquare } from "solid-icons/bs";
import LogSimulasiMapEditorSimulator from "./LogSimulasiMapEditorSimulator";
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from "@hope-ui/solid"

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
import { fetchDataAssetKapal, fetchDataRuteKapalAdd } from "../../service/service";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
  } from "@hope-ui/solid"
// import '@rnwonder/solid-date-picker/dist/style.css' 
// import DatePicker, { PickerValue } from '@rnwonder/solid-date-picker';

type LogSimulasiPopUpRuteAddProps = {
    closeSend?: any,
    detect? : any
};

const mapLoader = new Loader({
    apiKey: 'AIzaSyCU-SCtr4kQc3yZgC2rRQbtwtZFYanfo98',
    version: 'weekly',
    libraries: ['places', 'drawing'],
});
const LogSimulasiPopUpRuteAdd: Component<LogSimulasiPopUpRuteAddProps> = (props) => {

    
  const [alertStatusOk, setAlertStatusOk] = createSignal(false);
  const [alertStatusError, setAlertStatusError] = createSignal(false);
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
    const [markersNew, setMarkersNew]: any = createSignal(null);
    const [points, setPoints] = createSignal([]);
    const [dataAsset, setDataAsset] = createSignal([]);
    const [dataGis, setDataGis] = createSignal([]);
    const [history, setHistory] = createSignal([]);


    const [isModalOpen, setIsModalOpen] = createSignal(false);

    const saveData = () => {
        const markerPositions = markers().map((marker: any) => ({
            lat: marker.getPosition().lat(),
            lng: marker.getPosition().lng()
        }));

        const polylinePath = polyline().getPath().getArray().map((latLng: any) => ({
            lat: latLng.lat(),
            lng: latLng.lng()
        }));

        const data = {
            markers: markerPositions,
            polyline: polylinePath
        };

        console.log("data -> ", data);
        // localStorage.setItem('mapData', JSON.stringify(data));
    };

    const loadData = () => {
        let dataDefault = {
            "markers": [
                {
                    "lat": -3.0803032235385572,
                    "lng": 106.28714550343328
                },
                {
                    "lat": -4.406782606583764,
                    "lng": 114.26321972218328
                }
            ],
            "polyline": [
                {
                    "lat": -3.0803032235385572,
                    "lng": 106.28714550343328
                },
                {
                    "lat": -4.346479004259621,
                    "lng": 106.17166518606473
                },
                {
                    "lat": -4.195949509013242,
                    "lng": 106.52217712963967
                },
                {
                    "lat": -3.585094780119693,
                    "lng": 106.65274090819509
                },
                {
                    "lat": -3.707725590298021,
                    "lng": 107.59546848071854
                },
                {
                    "lat": -3.3574548088700067,
                    "lng": 108.47932626136443
                },
                {
                    "lat": -3.975969630521261,
                    "lng": 109.39879921185667
                },
                {
                    "lat": -3.72579908968513,
                    "lng": 110.29837703527559
                },
                {
                    "lat": -3.9465835304065466,
                    "lng": 111.16507519093328
                },
                {
                    "lat": -4.406782606583764,
                    "lng": 114.26321972218328
                },
                {
                    "lat": -4.390351651987256,
                    "lng": 114.25223339405828
                }
            ]
        }
        localStorage.setItem('mapData', JSON.stringify(dataDefault));
        const data = JSON.parse(localStorage.getItem('mapData'));
        if (data) {
            const gmaps = map();

            // Load markers
            const newMarkers = data.markers.map(position => {
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
                    polyline().getPath().setAt(markerIndex, marker.getPosition());
                });

                marker.addListener("click", () => {
                    // Remove marker and update polyline
                    marker.setMap(null);
                    const markerIndex = markers().indexOf(marker);
                    polyline().getPath().removeAt(markerIndex);
                    setMarkers(markers().filter(m => m !== marker));
                });

                return marker;
            });

            setMarkers(newMarkers);

            // Load polyline
            const newPolyline = new google.maps.Polyline({
                path: data.polyline,
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
        }
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

            gmaps.addListener("click", (event: any) => {
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

                console.log("Latitude: ", lat, "Longitude: ", lng);
                const path = newPolyline.getPath();
                // setHistory([...history(), {
                //     markers: [...markers()],
                //     path: [...path.getArray()],
                //   }]);
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

                    setMarkers([...markers(), newMarker]);
                }
            });

            // loadData();

            const updatePolyline = () => {
                if (polyline()) {
                    polyline().setMap(null);
                }

                if (markers().length === 2) {
                    const path = markers().map(marker => marker.getPosition());
                    const newPolyline = new google.maps.Polyline({
                        path,
                        geodesic: true,
                        strokeColor: "#FF0000",
                        strokeOpacity: 1.0,
                        strokeWeight: 2,
                    });
                    newPolyline.setMap(gmaps);
                    setPolyline(newPolyline);
                }
            };

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


        // const dataAssetLocal: any = JSON.parse(localStorage.getItem('dataAsset'));
        // setDataAsset(dataAssetLocal);

        fetchDataAssetKapal().then((data: any) => {
            // setRowDataAssetKapal(data.data)
            // setDataAssetKapal(data.filter);
            setDataAsset(data.data);
            // console.log("DATA ASSET -> ", dataAsset())
          })
          
        const dataGisLocal: any = JSON.parse(localStorage.getItem('dataGis'));
        setDataGis(dataGisLocal);
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

    const [date, setDate] = createSignal("");

    const handleDateChange = (event: any) => {
        setDate(event.target.value);
    };


    const [selectedValueDateFrom, setSelectedValueDateFrom]: any = createSignal(null);
    const [selectedValueDateTo, setSelectedValueDateTo]: any = createSignal(null);
    const [selectedValueAsetFrom, setSelectedValueAsetFrom]: any = createSignal(null);
    const [selectedValueAsetTo, setSelectedValueAsetTo] : any = createSignal(null);
    const [selectedValuePosisiFrom, setSelectedValuePosisiFrom] : any = createSignal(null);
    const [selectedValuePosisiTo, setSelectedValuePosisiTo] : any = createSignal(null);

    const handleSelectChangeDateFrom = (event: any) => { setSelectedValueDateFrom(event.target.value); };
    const handleSelectChangeDateTo = (event: any) => { setSelectedValueDateTo(event.target.value); };
    const handleSelectChangeAsetFrom = (event: any) => { setSelectedValueAsetFrom(event.target.value); };
    const handleSelectChangeAsetTo = (event: any) => { setSelectedValueAsetTo(event.target.value); };
    const handleSelectChangePosisiFrom = (event: any) => { setSelectedValuePosisiFrom(event.target.value); };
    const handleSelectChangePosisiTo = (event: any) => { setSelectedValuePosisiTo(event.target.value); };

    const resetSelect = () => {
        setSelectedValueDateFrom(null);
        setSelectedValueDateTo(null);
        setSelectedValueAsetFrom(null);
        setSelectedValueAsetTo(null);
        setSelectedValuePosisiFrom(null);
        setSelectedValuePosisiTo(null);
        markers().forEach(marker => marker.setMap(null));
        setMarkers([]);

        if (polyline()) {
            polyline().setPath([]);
        }

    };

    const addSelect = () => {
        // console.log("selectedValueDateFrom",selectedValueDateFrom());
        // console.log("selectedValueDateTo",selectedValueDateTo());
        // console.log("selectedValueAsetFrom",JSON.parse(selectedValueAsetFrom()).tb+':'+JSON.parse(selectedValueAsetFrom()).id.String); 
        // console.log("selectedValuePosisiFrom",selectedValuePosisiFrom());
        // console.log("selectedValuePosisiTo",selectedValuePosisiTo());
        // const markerPositions = markers().map((marker: any) => ({
        //     lat: marker.getPosition().lat(),
        //     lng: marker.getPosition().lng()
        // }));

        // const polylinePath = polyline().getPath().getArray().map((latLng: any) => ({
        //     lat: latLng.lat(),
        //     lng: latLng.lng()
        // }));

        // const { coordinate, decimal } = extractValues();

        // const data = {
        //     markers: markerPositions,
        //     polyline: polylinePath
        // };
        // console.log("m" , extractValues(JSON.parse(selectedValuePosisiFrom()).latitude).decimal)

        const markerPositions = markers().map((marker: any) => ({
            lat: marker.getPosition().lat(),
            lng: marker.getPosition().lng()
        }));
      
        const polylinePath = polyline().getPath().getArray().map((latLng: any) => ({
            lat: latLng.lat(),
            lng: latLng.lng()
        }));

        if(selectedValueDateFrom() !== null && selectedValueDateTo() !== null && 
        selectedValueAsetFrom() !== null && selectedValuePosisiFrom() !== null && 
        selectedValuePosisiTo() !== null && markerPositions.length !== 0 && 
        polylinePath.length !== 0  ) {
            const path : any = polylinePath.map((point : any) => new google.maps.LatLng(point.lat, point.lng));
            const polylines  : any = new google.maps.Polyline({ path });
            const length = google.maps.geometry.spherical.computeLength(polylines.getPath());
          
            // console.log(`Jarak  polyline: ${length} meter`);
          
            const latLng1 = new google.maps.LatLng(markerPositions[0].lat, markerPositions[0].lng);
            const latLng2 = new google.maps.LatLng(markerPositions[1].lat, markerPositions[1].lng);
            const distance = google.maps.geometry.spherical.computeDistanceBetween(latLng1, latLng2);
            // console.log(`Jarak markers: ${distance} meter`);
    
            let all_data = {
                "start_date": convertDateFormat(selectedValueDateFrom()),
                "end_date":convertDateFormat(selectedValueDateTo()),
                "start_kapal": JSON.parse(selectedValueAsetFrom()),
                "end_kapal": JSON.parse(selectedValueAsetFrom()).tb+':'+JSON.parse(selectedValueAsetFrom()).id.String,
                "start_pos": selectedValuePosisiFrom(),
                "end_pos": selectedValuePosisiTo(),
                "jarak_polyline": length,
                "jarak_marker": distance,
                 "markers": markerPositions,
                "polylines": polylinePath
              }
    
    
              console.log("AL - DATA -> ", all_data);
 
                fetchDataRuteKapalAdd(all_data).then((data: any) => {
                  console.log("data add -> ", data);
                  if (data.status === 'ok') {
                    setAlertStatusOk(true)
                    setTimeout(() => {
                      setAlertStatusOk(false)
                    }, 1000)

                    setSelectedValueAsetFrom(null);
                    setSelectedValueDateFrom(null);
                    setSelectedValueDateTo(null);
                    setSelectedValuePosisiFrom(null);
                    setSelectedValuePosisiTo(null); 
                    // props.detect(true);   
                  }
                })
          
         
        }else{
            setAlertStatusError(true)
            setTimeout(() => {
              setAlertStatusError(false)
            }, 1000)
        }

       
      
      
        // let all_from =
        // {
        //     "hari": convertDateFormat(selectedValueDateFrom()),
        //     "aset": JSON.parse(selectedValueAsetFrom()).nama,
        //     "lat": extractValues(JSON.parse(selectedValuePosisiFrom()).latitude).decimal,
        //     "lng": extractValues(JSON.parse(selectedValuePosisiFrom()).longitude).decimal,
        //     "latkoor": extractValues(JSON.parse(selectedValuePosisiFrom()).latitude).coordinate,
        //     "lngkoor": extractValues(JSON.parse(selectedValuePosisiFrom()).longitude).coordinate,
        //     "markers": markerPositions,
        //     "polyline": polylinePath
        // }
        // let all_to = {
        //     "hari": convertDateFormat(selectedValueDateTo()),
        //     "aset": JSON.parse(selectedValueAsetTo()).nama,
        //     "lat": extractValues(JSON.parse(selectedValuePosisiTo()).latitude).decimal,
        //     "lng": extractValues(JSON.parse(selectedValuePosisiTo()).longitude).decimal,
        //     "latkoor": extractValues(JSON.parse(selectedValuePosisiTo()).latitude).coordinate,
        //     "lngkoor": extractValues(JSON.parse(selectedValuePosisiTo()).longitude).coordinate,
        //     "markers": markerPositions,
        //     "polyline": polylinePath
        // }

        // console.log("ALL -> " , all)

        // const dataEditorSimulatorLocal: any = JSON.parse(localStorage.getItem('dataEditorSimulator'));
        // dataEditorSimulatorLocal.push(all_from)
        // dataEditorSimulatorLocal.push(all_to)
        // localStorage.setItem('dataEditorSimulator', JSON.stringify(dataEditorSimulatorLocal));


    };
    const [dateStr, setDateStr] = createSignal("");
    const convertDateFormat = (date: any) => {
        let [year, month, day] = date.split("-");

        const months: any = {
            "01": "Januari", "02": "Februari", "03": "Maret", "04": "April",
            "05": "Mei", "06": "Juni", "07": "Juli", "08": "Agustus",
            "09": "September", "10": "Oktober", "11": "November", "12": "Desember"
        };

        let monthName = months[month];
        return `${parseInt(day)} ${monthName} ${year}`;
    };

    const extractValues = (param: any) => {
        const regex = /\(([^)]+)\)/;
        const match = param.match(regex);

        if (match) {
            const coordinate = param.replace(match[0], '').trim(); // "3° 18' 20.8" S"
            const decimal = parseFloat(match[1]);    // "-3.30578"
            return { coordinate, decimal };
        } else {
            return { coordinate: '', decimal: 0 };
        }
    };

    const handleChangePosisiFrom  = (event: Event) => {
        const input = event.target as HTMLInputElement; 
        setSelectedValuePosisiFrom(input.value);
      };

      const handleChangePosisiTo  = (event: Event) => {
        const input = event.target as HTMLInputElement; 
        setSelectedValuePosisiTo(input.value);
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
                                        <svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.9998 9.33444V11.1251H24.8817C25.0266 11.1253 25.1695 11.1592 25.2991 11.2239C25.4287 11.2887 25.5416 11.3826 25.6288 11.4984C25.716 11.6141 25.7752 11.7485 25.8017 11.8909C25.8282 12.0334 25.8214 12.1801 25.7817 12.3194L23.5411 20.1701C23.2053 21.3456 22.4956 22.3797 21.5196 23.1159C20.5435 23.8521 19.3542 24.2502 18.1317 24.2501H7.86793C6.64538 24.2502 5.45607 23.8521 4.48002 23.1159C3.50398 22.3797 2.79435 21.3456 2.45855 20.1701L0.216055 12.3194C0.176349 12.1801 0.169491 12.0334 0.196019 11.8909C0.222547 11.7485 0.281739 11.6141 0.368947 11.4984C0.456155 11.3826 0.569005 11.2887 0.698634 11.2239C0.828264 11.1592 0.971144 11.1253 1.11605 11.1251H11.1248V1.45381C11.1247 1.29101 11.167 1.13099 11.2475 0.989487C11.328 0.847989 11.444 0.729896 11.584 0.646832C11.724 0.563769 11.8832 0.518598 12.046 0.515767C12.2088 0.512936 12.3695 0.552542 12.5123 0.630686L12.9192 0.853811L12.9998 0.812561V0.896936L19.7873 4.60006C19.9402 4.68342 20.0669 4.80772 20.1531 4.95904C20.2393 5.11035 20.2817 5.28269 20.2755 5.45673C20.2693 5.63078 20.2147 5.79965 20.1178 5.94441C20.021 6.08917 19.8858 6.2041 19.7273 6.27631L12.9998 9.33444ZM12.9998 7.27569L17.2411 5.34819L12.9998 3.03444V7.27569ZM12.9998 13.0001H2.36105L2.89543 14.8751H23.1061L23.6404 13.0001H12.9998ZM3.43168 16.7501L4.2623 19.6563C4.48636 20.4397 4.95946 21.1287 5.61 21.6193C6.26055 22.1098 7.05317 22.3751 7.86793 22.3751H18.1317C18.9464 22.3751 19.7391 22.1098 20.3896 21.6193C21.0402 21.1287 21.5132 20.4397 21.7373 19.6563L22.5679 16.7501H3.43168Z" fill="white" />
                                        </svg>


                                    </span>
                                    <span style="font-family: 'jaldiBold';
    color: white;
    margin-left: 10px;
    margin-top: 5px;">Tambah Rute Kapal</span>
                                </Flex>
                            </div>

                            <div class="w20">
                                <AiFillCloseSquare onClick={() => props.closeSend} class="cp" style="cursor:pointer" />

                            </div>
                        </Flex>
                    </div>



                    <div id="map-container-rute ">
                        <div style="right: 10px;
    top: 13px;
    margin-bottom: -192px;
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
                                        <div style="width:40%">Waktu & Tanggal</div>
                                        <div style="width:20%">Asset</div>
                                        <div style="width:40%">Posisi</div>
                                    </Flex>
                                </div>
                                <div style="    background: #ffffff45;
    backdrop-filter: blur(1px);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;">
                                    <Flex>
                                        <div style="width:40%">
                                            <Flex>
                                                <div style="    width: 30%;
    text-align: center;
    justify-content: center;
    align-items: center;
    display: grid;">
                                                    <div style="    margin-top: 11px;">
                                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <circle cx="7.5" cy="7.5" r="7.5" fill="#699BF7" fill-opacity="0.4" />
                                                            <circle cx="7.25" cy="7.25" r="3.75" fill="#699BF7" />
                                                        </svg>

                                                    </div>
                                                    <div style="    margin-top: 11px;">
                                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <circle cx="7.5" cy="7.5" r="7.5" fill="#EC1C00" fill-opacity="0.2" />
                                                            <circle cx="7.25" cy="7.25" r="3.75" fill="#EC1C00" />
                                                        </svg>

                                                    </div>
                                                </div>
                                                <div style="width:70%">
                                                    <div style="    margin-top: 11px;">
                                                        <div class="dropdown">
                                                            <div class="input-container">
                                                                <input
                                                                    type="date"
                                                                    min="1997-01-01" max="2100-12-31"
                                                                    value={selectedValueDateFrom()}
                                                                    onInput={handleSelectChangeDateFrom}
                                                                    onClick={(e) => e.currentTarget.showPicker()}
                                                                    class={`custom-date-input ${!selectedValueDateFrom() ? "empty" : ""}`}
                                                                />
                                                                {!selectedValueDateFrom() && <span class="placeholder">Pilih Tanggal</span>}
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div style="    margin-top: 11px;">
                                                        <div class="dropdown">
                                                            <div class="input-container">
                                                                <input
                                                                    type="date"
                                                                    min="1997-01-01" max="2100-12-31"
                                                                    value={selectedValueDateTo()}
                                                                    onInput={handleSelectChangeDateTo}
                                                                    onClick={(e) => e.currentTarget.showPicker()}
                                                                    class={`custom-date-input ${!selectedValueDateTo() ? "empty" : ""}`}
                                                                />
                                                                {!selectedValueDateTo() && <span class="placeholder">Pilih Tanggal</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Flex>
                                        </div>
                                        <div style="width:30%">
                                            <div style="    margin-top: 10px;">
                                                <select name="aset" id="aset" class="slc" value={selectedValueAsetFrom()} onInput={handleSelectChangeAsetFrom}>
                                                    <option value={null} selected disabled hidden>Pilih Aset</option>
                                                    <For each={dataAsset()}>{(e: any, i) =>
                                                        <option value={JSON.stringify(e.id)}>{e.nama}</option>
                                                    }</For>
                                                </select>
                                            </div>
                                            <div style="    margin-top: 10px;">
                                                <select name="aset" id="asets" class="slc" value={selectedValueAsetFrom()} onInput={handleSelectChangeAsetFrom}>
                                                    <option value={null} selected disabled hidden>Pilih Aset</option>
                                                    <For each={dataAsset()}>{(e: any, i) =>
                                                        <option value={JSON.stringify(e.id)}>{e.nama}</option>
                                                    }</For>
                                                </select>
                                            </div>
                                        </div>
                                        <div style="width:30%">
                                            <div style="    margin-top: 10px;">
                                                
                                                {/* <select name="aset" id="aset" class="slcp" value={selectedValuePosisiFrom()} onInput={handleSelectChangePosisiFrom}>
                                                    <option value="" selected disabled hidden>Pilih Posisi</option>
                                                    <option value="1" >Tentukan Titik di Peta</option>
                                                    <For each={dataGis()}>{(e: any, i) =>
                                                        <option value={JSON.stringify(e)}>{e.lokasi}</option>
                                                    }</For>
                                                </select> */}
                                                  <input class="ipt" type="text" placeholder="input nama" onChange={handleChangePosisiFrom} />
                                            </div>
                                            <div style="    margin-top: 10px;">
                                                {/* <select name="aset" id="aset" class="slcp" value={selectedValuePosisiTo()} onInput={handleSelectChangePosisiTo}>
                                                    <option value="" selected disabled hidden>Pilih Posisi</option>
                                                    <option value="1" >Tentukan Titik di Peta</option>
                                                    <For each={dataGis()}>{(e: any, i) =>
                                                        <option value={JSON.stringify(e)}>{e.lokasi}</option>
                                                    }</For>
                                                </select> */}
                                                 <input class="ipt" type="text" placeholder="input nama" onChange={handleChangePosisiTo} />
                                            </div>
                                        </div>
                                    </Flex>

                                    <div>

                                        <div style="text-align: center; justify-content: center;display: flex;    margin-top: 10px;">
                                            <Flex>
                                                <div onClick={resetSelect} style="    margin: 7px;"><Button class="btrn" >Reset</Button></div>
                                                <div onClick={addSelect} style="    margin: 7px;"><Button class="btry" >Simpan</Button></div>
                                            </Flex>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                        <div id="map-rute" ref={el => mapRef = el}></div>
                    </div>


                    <Show
              when={alertStatusOk()}
              fallback={''}
            >
              <Alert status="success" variant="subtle">
                <AlertIcon mr="$2_5" />
                Menambah Data Rute Kapal Berhasil !
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


                </div>
            </div>

            {/* <input type="date" id="birthday" name="birthday" /> */}

            {/* <DatePicker
             type="single"
             placeholder="Date range"
      onChange={(data) => {
        
        if (data.type === "range") {
          console.log(data.startDate, data.endDate);
        }
        if (data.type === "single") {
          console.log(data.selectedDate);
        }
        if (data.type === "multiple") {
          console.log(data.multipleDates);
        }
      }}/> */}

            {/* <button onClick={saveData}>Save</button> */}

        </>
    );
};
export default LogSimulasiPopUpRuteAdd;