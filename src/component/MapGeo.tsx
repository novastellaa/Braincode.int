import { Component, createEffect, onCleanup, onMount, Show } from "solid-js";
import { createSignal } from "solid-js";
import './MapGeo.css'
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

import { pointsState, titleState, setTitleState } from '../store/store';
import { Loader } from '@googlemaps/js-api-loader';
import { FaSolidDrawPolygon } from 'solid-icons/fa'
import { AiOutlineDash } from 'solid-icons/ai'
import { BiRegularCurrentLocation } from 'solid-icons/bi'

type MapGeoProps = {
    closeSend?: any
};

const mapLoader = new Loader({
    apiKey: 'AIzaSyCU-SCtr4kQc3yZgC2rRQbtwtZFYanfo98',
    version: 'weekly',
    libraries: ['places', 'drawing'],
});
const MapGeo: Component<MapGeoProps> = (props) => {

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
    const [polygonS, setPolygonS]: any = createSignal(null);
    const [points, setPoints] = createSignal([]);
    const [infoWindow, setInfoWindow] = createSignal(null);
    const [popupContent, setPopupContent] = createSignal(null);
    const [isModalOpen, setIsModalOpen] = createSignal(false);
    const [elevationService, setElevationService] : any = createSignal(null);

    const isOverWater = (elevation: any) => {
        return elevation === 0;
      };
    
      const filterPointsOverWater = async (path : any) => {
        const locations = path.map((coord: any) => ({ lat: coord.lat, lng: coord.lng }));
        const elevationResults : any = await getElevationData(locations);
    
        return path.filter((coord: any, index: any) => isOverWater(elevationResults[index].elevation));
      };
    
      const getElevationData = (locations : any) => {
        return new Promise((resolve, reject) => {
          elevationService().getElevationForLocations({ locations }, (results: any, status: any) => {
            if (status === google.maps.ElevationStatus.OK) {
              resolve(results);
            } else {
              reject(status);
            }
          });
        });
      };

      
    const saveData = () => {
        const markerPositions = markers().map((marker: any) => ({
            lat: marker.getPosition().lat(),
            lng: marker.getPosition().lng()
        }));

        const polylinePath = polyline().getPath().getArray().map(latLng => ({
            lat: latLng.lat(),
            lng: latLng.lng()
        }));

        const data = {
            markers: markerPositions,
            polyline: polylinePath
        };

        localStorage.setItem('mapData', JSON.stringify(data));
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
                editable: false,
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

    const [dataGeo, setDataGeo]: any = createSignal([]);
    const fetchGeo = async () => {
        try {
            const response = await fetch('/public/json/geo.json');
            if (!response.ok) {
                throw new Error("Gagal");
            }
            const data = await response.json();
            if (data) {
                const dataGeoLocal: any = JSON.parse(localStorage.getItem('dataGeo'));
                // console.log("dataGeoLocal -> ", dataGeoLocal)
                setDataGeo(data);
                if (dataGeoLocal == null) {
                    setDataGeo(data);
                    localStorage.setItem('dataGeo', JSON.stringify(dataGeo()));
                } else {
                    //   setTimeout(() =>{
                    setDataGeo(dataGeoLocal);
                    //   },200)
                }

            } else {
            }
        } catch (error) {
        }
    };

    const loadGeoJsonLine = () => {
        polygonS().setPath([]);
        markers().forEach(marker => marker.setMap(null));
        setMarkers([]);
        // console.log(" dataGeo() -> ",  dataGeo())
        const points = dataGeo().features.map((feature: any) => {
            const [lng, lat] = feature.geometry.coordinates;
            return { lat, lng, name: feature.properties.name };
        });
        // console.log("points -> ", points);

        

        points.forEach((point: any) => {
            //   const newMarker = new google.maps.Marker({
            //     position: point,
            //     icon: {
            //       url: '/rb.png',
            //       scaledSize: new google.maps.Size(30, 30),
            //     },
            //     map: map(),
            //     draggable: true,
            //   });

            //   newMarker.addListener("click", () => {
            //     const contentString = document.createElement('div');
            //     setPopupContent(
            //       <MarkerPopup
            //         title="Marker Info"
            //         description={`Latitude: ${point.lat}, Longitude: ${point.lng}`}
            //         cek={cek}
            //       />
            //     );
            //     contentString.innerHTML = document.getElementById('popup-container').innerHTML;
            //     infoWindow().setContent(contentString);
            //     infoWindow().open(map(), newMarker);
            //   });

            //   newMarker.addListener("drag", () => {
            //     const markerIndex = markers().indexOf(newMarker);
            //     polyline().getPath().setAt(markerIndex, newMarker.getPosition());
            //   });

            //   setMarkers([...markers(), newMarker]);
        });
        

        const path = points.map((point: any) => new google.maps.LatLng(point.lat, point.lng));
        polyline().setPath(path);
    };

    const loadGeoJsonPolygon = () => {
        polyline().setPath([]);
        markers().forEach(marker => marker.setMap(null));
        setMarkers([]);

        // console.log(" dataGeo() -> ", dataGeo())
        const points = dataGeo().features.map((feature: any) => {
            const [lng, lat] = feature.geometry.coordinates;
            if (lng === 109.64527777777778 && lat === 2.0861111111111112) {
                return null;
            } else if (lng === 117.87805555555555 && lat === 3.4658333333333333) {
                return null;
            }
            return { lat, lng, name: feature.properties.name };
        }).filter((point: any) => point !== null);;

        const path = points.map((point: any) => new google.maps.LatLng(point.lat, point.lng));
        // console.log("points -> ", points);
        const polygon = new google.maps.Polygon({
            paths: path,
            strokeColor: '#e6b238',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#e6b238',
            fillOpacity: 0.35,
            editable: false,
            draggable: false
        });

       
        polygon.setMap(map());
        setPolygonS(polygon);

        // points.forEach((point : any ) => {
        //   const newMarker = new google.maps.Marker({
        //     position: point,
        //     icon: {
        //       url: '/rb.png',
        //       scaledSize: new google.maps.Size(30, 30),
        //     },
        //     map: map(),
        //     draggable: true,
        //   });

        //   newMarker.addListener("click", () => {
        //     const contentString = document.createElement('div');
        //     setPopupContent(
        //       <MarkerPopup
        //         title="Marker Info"
        //         description={`Latitude: ${point.lat}, Longitude: ${point.lng}`}
        //         cek={cek}
        //       />
        //     );
        //     contentString.innerHTML = document.getElementById('popup-container').innerHTML;
        //     infoWindow().setContent(contentString);
        //     infoWindow().open(map(), newMarker);
        //   });

        //   newMarker.addListener("drag", () => {
        //     const markerIndex = markers().indexOf(newMarker);
        //     polyline().getPath().setAt(markerIndex, newMarker.getPosition());
        //   });

        //   setMarkers([...markers(), newMarker]);
        // });

    }
    const loadGeoJsonMarker = () => {
        polyline().setPath([]);
        polygonS().setPath([]);
        // console.log(" dataGeo() -> ", dataGeo())
        const points = dataGeo().features.map((feature: any) => {
            const [lng, lat] = feature.geometry.coordinates;
            if (lng === 109.64527777777778 && lat === 2.0861111111111112) {
                return null;
            } else if (lng === 117.87805555555555 && lat === 3.4658333333333333) {
                return null;
            }
            return { lat, lng, name: feature.properties.name };
        }).filter((point: any) => point !== null);;

      
        points.forEach((point : any ) => {
          const newMarker = new google.maps.Marker({
            position: point,
            icon: {
              url: '/rb.png',
              scaledSize: new google.maps.Size(30, 30),
            },
            map: map(),
            draggable: true,
          });

        //   newMarker.addListener("click", () => {
        //     const contentString = document.createElement('div');
        //     setPopupContent(
        //       <MarkerPopup
        //         title="Marker Info"
        //         description={`Latitude: ${point.lat}, Longitude: ${point.lng}`}
        //         cek={cek}
        //       />
        //     );
        //     contentString.innerHTML = document.getElementById('popup-container').innerHTML;
        //     infoWindow().setContent(contentString);
        //     infoWindow().open(map(), newMarker);
        //   });

        //   newMarker.addListener("drag", () => {
        //     const markerIndex = markers().indexOf(newMarker);
        //     polyline().getPath().setAt(markerIndex, newMarker.getPosition());
        //   });

          setMarkers([...markers(), newMarker]);
        });

    }


    onMount(() => {
        fetchGeo()
        mapLoader.load().then(() => {
            const gmaps = new google.maps.Map(mapRef as HTMLElement, {
                center: { lat: -2.7, lng: 119.0 },
                zoom: 5,
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

            //   setTimeout(() => {
            //      gmaps.data.addGeoJson(dataGeo())
            //   },100)

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
                strokeColor: "#e6b238",
                strokeOpacity: 1.0,
                strokeWeight: 0.4,
                editable: false,
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

            const polygon = new google.maps.Polygon({
                paths: [],
                strokeColor: '#e6b238',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#e6b238',
                fillOpacity: 0.35,
                editable: false,
                draggable: false
            });

            polygon.setMap(gmaps);
            setPolygonS(polygon);

            gmaps.addListener("click", (event: any) => {
                const lat = event.latLng.lat();
                const lng = event.latLng.lng();

                console.log("Latitude: ", lat, "Longitude: ", lng);
                // const path = newPolyline.getPath();
                // path.push(event.latLng);
                // if (markers().length < 2) {
                //     const newMarker = new google.maps.Marker({
                //         position: event.latLng,
                //         icon: {
                //             url: '/rb.png',
                //             scaledSize: new google.maps.Size(30, 30),
                //         },
                //         map: gmaps,
                //         draggable: true,
                //     });

                //     newMarker.addListener("drag", () => { 
                //         const markerIndex = markers().indexOf(newMarker);
                //         path.setAt(markerIndex, newMarker.getPosition());
                //     });

                //     newMarker.addListener("click", () => {
                //         // Remove marker and update polyline
                //         newMarker.setMap(null);
                //         const markerIndex = markers().indexOf(newMarker);
                //         path.removeAt(markerIndex);
                //         setMarkers(markers().filter(marker => marker !== newMarker));
                //     });

                //     setMarkers([...markers(), newMarker]);
                // }
            });

            // loadData();
            const infoWindow: any = new google.maps.InfoWindow();
            setInfoWindow(infoWindow);



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
        setTimeout(() => { loadGeoJsonLine() }, 1000)
        // setTimeout(() => { loadGeoJsonPolygon()},200)


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

    const changeMap = (param : any) =>{
        if(param == 'line'){
            setTimeout(() => { loadGeoJsonLine() }, 300)
        }else if (param == 'polygon'){
            setTimeout(() => { loadGeoJsonPolygon()},300)
        }else{
            setTimeout(() => { loadGeoJsonMarker()},300)
        }
       
       
    }


    return (
        <>


            <Flex style="margin-bottom: 10px;">
            <Button onClick={() => changeMap('line')} class="btgis" leftIcon={<AiOutlineDash boxSize={18} style="color:black;    font-size: 13px !important;" />}>
                <span class="fntlsgis">Polyline</span>
            </Button>
            <Button onClick={() => changeMap('polygon')} class="btgis" leftIcon={<FaSolidDrawPolygon boxSize={18} style="color:black;    font-size: 13px !important;" />}>
                <span class="fntlsgis">Polygon</span>
            </Button>
            <Button onClick={() => changeMap('marker')} class="btgis" leftIcon={<BiRegularCurrentLocation  boxSize={18} style="color:black;    font-size: 13px !important;" />}>
                <span class="fntlsgis">Marker</span>
            </Button>
            </Flex>

            <div id="map-container-history ">
                <div id="map-history" ref={el => mapRef = el}></div>
            </div>


            {/* <button onClick={saveData}>Save</button> */}

        </>
    );
};
export default MapGeo;