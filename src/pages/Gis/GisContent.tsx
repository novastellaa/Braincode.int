import { Component, onMount, Show } from "solid-js";
import { createSignal } from "solid-js";
import './GisContent.css'
import { Flex, Spacer } from "@hope-ui/solid"
import MapView from "../MapView";
import { Button } from "@hope-ui/solid"
import { Select, createOptions } from "@thisbeyond/solid-select";
import "@thisbeyond/solid-select/style.css";
import AgGridSolid, { AgGridSolidRef } from "ag-grid-solid";
import { ColDef } from "ag-grid-community";
import "ag-grid-enterprise";
import { BiRegularSearchAlt } from "solid-icons/bi";
import { AiOutlinePlus } from 'solid-icons/ai'
import { BsFilterSquare } from "solid-icons/bs";
// import GisMapEditorSimulator from "./GisMapEditorSimulator";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@hope-ui/solid"
import GisMap from "./GisMap";
import { JSX } from "solid-js/jsx-runtime";
import GisPopUpDataPoint from "./GisPopUpDataPoint";
import GisPopUpDataPolyline from "./GisPopUpDataPolyline";
import GisPopUpDataPolygon from "./GisPopUpDataPolygon";
import { fetchDataPoint, fetchDataPolygon, fetchDataPolyline } from "../../service/service";
// import GisPopUpAssetAdd from "./GisPopUpAssetAdd";
// import GisPopUpDataPolylineAdd from "./GisPopUpDataPolylineAdd";


type GisContentProps = {
};

const GisContent: Component<GisContentProps> = (props) => {
  let gridRefPoint: AgGridSolidRef;
  let gridRefPolyline: AgGridSolidRef;
  let gridRefPolygon: AgGridSolidRef;
  const [rowDataPoint, setRowDataPoint] = createSignal([]);
  const [rowDataPolyline, setRowDataPolyline] = createSignal([]);
  const [rowDataPolygon, setRowDataPolygon] = createSignal([]);
  const defaultColdefPoint = {
    filter: true,
    resizable: true,
    sortable: true,
  };
  const gridOptionsPoint = {
    rowHeight: 40,
    headerHeight: 50,
    rowStyle: { textAlign: "center" },
  };

  const defaultColdefPolyline = {
    filter: true,
    resizable: true,
    sortable: true,
  };
  const gridOptionsPolyline = {
    rowHeight: 40,
    headerHeight: 50,
    suppressAggFuncInHeader: true,
    rowStyle: { textAlign: "center" },
  };

  const defaultColdefPolygon = {
    filter: true,
    resizable: true,
    sortable: true,
  };
  const gridOptionsPolygon = {
    rowHeight: 40,
    headerHeight: 50,
    suppressAggFuncInHeader: true,
    rowStyle: { textAlign: "center" },
  };

  const ImageRenderer = ({ data }: { data: any }) => {
    onMount(() => {
      console.log(data)
    })
    if (data == undefined) {
      // return 'masuk'
      return
    }
    return (
      <>
        <Show
          when={data.type == 'from'}
          fallback={<span><svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="5" cy="5" r="5" fill="#FFC746" />
          </svg>
            {/* {data.latitude} */}
          </span>}
        >
          <span><svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="5" cy="5" r="5" fill="#F44336" />
          </svg>
            {/* {data.latitude} */}
          </span>
        </Show>

      </>
    );
  };
  const ImageRendererPolygon = ({ data }: { data: any }) => {
    onMount(() => {
      console.log(data)
    })
    if (data == undefined) {
      return
    }

    return (
      <>

        <span><svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="5" cy="5" r="5" fill="#F44336" />
        </svg>
        </span>

      </>
    );
  };

  const [columnDefsDataPoint, setColumnDefsDataPoint]: any = createSignal([
    {
      headerName: "Lokasi",
      field: "lokasi",
      // width: 95,
      flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
    },
    {
      headerName: "Titik",
      field: "titik",
      // width: 95,
      flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
    },
    {
      headerName: "Jenis",
      field: "jenis",
      // width: 95,
      flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
    },
    {
      headerName: "Batas",
      field: "batas",
      // width: 95,
      flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
    },
    {
      headerName: "Latitude",
      field: "lat",
      // width: 80,
      flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
    },
    {
      headerName: "Longitude",
      field: "lng",
      // width: 90,
      flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
    }
  ]);


  const autoGroupColumnDef = {
    headerName: 'Garis',
    cellStyle: {
      display: "flex",
      justifyContent: "left",
      alignItems: "center",
    }, 
    // cellClass: "center-cell",
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      innerRendererFramework: (params: any) => {
        if (params.node.group) {
          const firstRowData = params.node.allLeafChildren[0].data;
          return (
            <span>
              {firstRowData.lokasi}
            </span>
          );
        }
        return <span>{params.data.length} | {params.data.latitude} | {params.data.longitude}</span>;
      },
      suppressCount: true,
    },
  };

  const [columnDefsDataPolyline, setColumnDefsDataPolyline]: any = createSignal([

    {
      headerName: "Garis",
      field: "lokasi",
      width: 110,
      // rowGroup: true,
      hide: true,
      rowGroup: true,

      cellRenderer: "agGroupCellRenderer",
      // flex: 1,

      // cellStyle: {
      //   display: "flex",
      //   justifyContent: "center",
      //   alignItems: "center",
      // }, cellClass: "center-cell",
    },
    {
      field: "jarak_polyline",
      headerName: "Panjang",
      width: 100,
      aggFunc: (params: { values: any[]; }) => {
        let km = params.values[0] / 1000 
        return params.values && params.values[0] ? km.toFixed(1)+' km' : "N/A";
      },
      //  showRowGroup: 'length',
      // rowGroup: true, 
      // cellRenderer: "agGroupCellRenderer",
      // flex: 1, 
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }
    },
    {
      headerName: "",
      field: "type",
      width: 50,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",

      cellRenderer: ImageRenderer
    },
    {
      headerName: "Latitude",
      field: "lat",
      width: 195,
      flex: 1,
      aggFunc: (params: { values: any[]; }) => {
        return params.values && params.values[0] ? params.values[0] : "N/A";
      },
      // showRowGroup: true,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
      // cellRenderer: ImageRenderer
    },
    {
      headerName: "Longitude",
      field: "lng",
      width: 195,
      flex: 1,
      aggFunc: (params: { values: any[]; }) => {
        return params.values && params.values[0] ? params.values[0] : "N/A";
      },
      // showRowGroup: true,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
    }
  ]);

  const autoGroupColumnDefPolygon = {
    headerName: 'Area',
    cellStyle: {
      display: "flex",
      justifyContent: "left",
      alignItems: "center",
    }, 
    cellClass: "center-cell",
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      innerRendererFramework: (params: any) => {
        if (params.node.group) {
          const firstRowData = params.node.allLeafChildren[0].data;
          return (
            <span>
              {firstRowData.lokasi}
            </span>
          );
        }
        return <span>{params.data.area} | {params.data.latitude} | {params.data.longitude}</span>;
      },
      suppressCount: true,
    },
  };
  const [columnDefsDataPolygon, setColumnDefsDataPolygon]: any = createSignal([
    {
      headerName: "Area",
      field: "lokasi",
      width: 110,
      hide: true,
      rowGroup: true,
      cellRenderer: "agGroupCellRenderer",
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
    },
    {
      headerName: "Luas",
      field: "luas",
      width: 60,
      flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
      aggFunc: (params: { values: any[]; }) => {
        return params.values && params.values[0] ? convertM2ToKm2(params.values[0])+' km2' : "N/A";
      },
    },
    {
      headerName: "",
      field: "latitude",
      width: 50,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
      cellRenderer: ImageRendererPolygon
    },
    {
      headerName: "Latitude",
      field: "lat",
      width: 60,
      flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
      aggFunc: (params: { values: any[]; }) => {
        return params.values && params.values[0] ? params.values[0] : "N/A";
      },
    },
    {
      field: "lng",
      headerName: "Longitude",
      width: 100,
      flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      aggFunc: (params: { values: any[]; }) => {
        return params.values && params.values[0] ? params.values[0] : "N/A";
      },
      // cellRenderer: ButtonRenderer,
    },
  ]);

  const [dataPoint, setDataPoint] = createSignal([]);
  const [dataPolyline, setDataPolyline] : any = createSignal([]);
  const [dataPolygon, setDataPolygon] : any= createSignal([]);
  const [editorSimulatorSend, setEditorSimulatorSend]: any = createSignal([]);

  // const fetchDataPoint = async () => {
  //   try {
  //     const response = await fetch('/public/json/data-point.json');
  //     if (!response.ok) {
  //       throw new Error("Gagal");
  //     }
  //     const data = await response.json();
  //     if (data) {
  //       // const dataPointLocal : any = JSON.parse(localStorage.getItem('dataPoint'));
  //       // console.log("dataPointLocal -> ", dataPointLocal)
  //       // if(dataPointLocal == null){
  //       setDataPoint(data);
  //       setRowDataPoint(dataPoint())
       
  //       //   localStorage.setItem('dataPoint', JSON.stringify(dataPoint())); 
  //       // }else{
  //       //   setTimeout(() =>{
  //       //     setDataPoint(dataPointLocal); 
  //       //     setRowDataPoint(dataPointLocal) 
  //       //   },200)
  //       // }

  //     } else {
  //     }
  //   } catch (error) {
  //   }
  // };

  // const fetchDataPolyline = async () => {
  //   try {
  //     const response = await fetch('/public/json/data-polyline.json');
  //     if (!response.ok) {
  //       throw new Error("Gagal");
  //     }
  //     const data = await response.json();
  //     if (data) {
  //       // const dataPolylineLocal : any = JSON.parse(localStorage.getItem('dataPolyline'));
  //       // console.log("dataPolylineLocal -> ", dataPolylineLocal)
  //       // if(dataPolylineLocal == null){
       
  //       setRowDataPolyline(data)
  //       //   localStorage.setItem('dataPolyline', JSON.stringify(dataPolyline())); 
  //       // }else{
  //       //   setTimeout(() =>{
  //       //     setDataPolyline(dataPolylineLocal); 
  //       //     setRowDataPolyline(dataPolylineLocal) 
  //       //   },200)
  //       // }
        

  //       let uniqueLines = new Set(data.map((item :any)=> item.line)); 
  //       let result = [...uniqueLines].map(line => { 
  //         let filteredData = data.filter((item :any) => item.line === line); 
  //         return filteredData[0];
  //       }); 
  //       setDataPolyline(result); 

        

  //     } else {
  //     }
  //   } catch (error) {
  //   }
  // };

  // const fetchDataPolygon = async () => {
  //   try {
  //     const response = await fetch('/public/json/data-polygon.json');
  //     if (!response.ok) {
  //       throw new Error("Gagal");
  //     }
  //     const data = await response.json();
  //     if (data) {
  //       // const dataPolygonLocal : any = JSON.parse(localStorage.getItem('dataPolygon'));
  //       // console.log("dataPolygonLocal -> ", dataPolygonLocal)
  //       // if(dataPolygonLocal == null){
  //       // setDataPolygon(data);
  //       setRowDataPolygon(data)
  //       //   localStorage.setItem('dataPolygon', JSON.stringify(dataPolygon())); 
  //       // }else{
  //       //   setTimeout(() =>{
  //       //     setDataPolygon(dataPolygonLocal); 
  //       //     setRowDataPolygon(dataPolygonLocal) 
  //       //   },200)
  //       // }

  //       let uniqueArea = new Set(data.map((item :any)=> item.area)); 
  //       let result = [...uniqueArea].map(area => { 
  //         let filteredData = data.filter((item :any) => item.area === area); 
  //         return filteredData[0];
  //       }); 
  //       setDataPolygon(result); 
  //     } else {
  //     }
  //   } catch (error) {
  //   }
  // };


  const convertM2ToKm2 = (squareMeters : any) => {
    console.log("squareKilometers 1-> ", squareMeters);
    const squareKilometers = squareMeters / 1_000_000;
    console.log("squareKilometers 2-> ", squareKilometers);
    return squareKilometers.toFixed(1);
}

  onMount(() => {
    // fetchDataPoint()
    fetchDataPoint().then((data: any) => { 
      setDataPoint(data.filter);
      setRowDataPoint(data.data)

    })
    fetchDataPolyline().then((data: any) => { 
      setDataPolyline(data.filter);
      setRowDataPolyline(data.data)

    })

    fetchDataPolygon().then((data: any) => { 
      setDataPolygon(data.filter);
      setRowDataPolygon(data.data)

    })
    // fetchDataPolyline()
    // fetchDataPolygon()

    // setEditorSimulatorSend([ {
    //     "hari": "22 Juni 2024",
    //     "aset": "HQ 20",
    //     "lat": -3.30578,
    //     "lng": 117.89121,
    //     "latkoor": "3° 18' 20.8\" S",
    //     "lngkoor": "117° 53' 28.4\" E",
    //     "markers": [
    //       {
    //         "lat": 0.7533054748951525,
    //         "lng": 107.21034192825111
    //       },
    //       {
    //         "lat": -6.998264917318715,
    //         "lng": 118.76303251121074
    //       }
    //     ],
    //     "polyline": [
    //       {
    //         "lat": 0.7533054748951525,
    //         "lng": 107.21034192825111
    //       },
    //       {
    //         "lat": -0.7346159307168078,
    //         "lng": 105.91395613775582
    //       },
    //       {
    //         "lat": -3.735347101714719,
    //         "lng": 108.95791821844597
    //       },
    //       {
    //         "lat": -5.70114345958807,
    //         "lng": 111.92775553138705
    //       },
    //       {
    //         "lat": -4.597002902082299,
    //         "lng": 115.24523117763819
    //       },
    //       {
    //         "lat": -6.305438814341642,
    //         "lng": 116.24441441368486
    //       },
    //       {
    //         "lat": -6.998264917318715,
    //         "lng": 118.76303251121074
    //       }
    //     ]
    //   }
    // ]);

  })

  const dataSelectPoint = createOptions(
    dataPoint,
    { key: "lokasi" }
  )

  const dataSelectPolyline = createOptions(
    dataPolyline,
    { key: "lokasi" }
  )

  const dataSelectPolygon = createOptions(
    dataPolygon,
    { key: "lokasi" }
  )



  const onFilterPoint = (event: any) => {
    if (event == null) {
      gridRefPoint.api.setQuickFilter('')
    } else {
      gridRefPoint.api.setQuickFilter(event.lokasi)
    }
  }

  const onFilterPolyline = (event: any) => {
    if (event == null) {
      gridRefPolyline.api.setQuickFilter('')
    } else {
      gridRefPolyline.api.setQuickFilter(event.line)
    }

  }

  const onFilterPolygon = (event: any) => {
    if (event == null) {
      gridRefPolygon.api.setQuickFilter('')
    } else {

      gridRefPolygon.api.setQuickFilter(event.area)
    }
  }





  const [scrollBehavior, setScrollBehavior] = createSignal("inside");
  const [isOpenPoint, setIsOpenPoint] = createSignal(false);
  const [isOpenPolyline, setIsOpenPolyline] = createSignal(false);
  const [isOpenPolygon, setIsOpenPolygon] = createSignal(false);


  const onOpenPoint = () => setIsOpenPoint(true);
  const onClosePoint = () => {
    const dataPointLocal: any = JSON.parse(localStorage.getItem('dataPoint'));
    // setDataPoint(dataPointLocal);
    // setRowDataPoint(dataPoint())
    setIsOpenPoint(false)

  };

  const onOpenPolyline = () => setIsOpenPolyline(true);
  const onCloseDataPolyline = () => {
    const dataPolylineLocal: any = JSON.parse(localStorage.getItem('dataPolyline'));
    // setDataPolyline(dataPolylineLocal);
    // setRowDataPolyline(dataPolyline())
    setIsOpenPolyline(false)
  };

  const onOpenPolygon = () => setIsOpenPolygon(true);
  const onCloseDataPolygon = () => {
    console.log("close head")
    const dataPolygonLocal: any = JSON.parse(localStorage.getItem('dataPolygon'));
    // setDataPolygon(dataPolygonLocal);
    // setRowDataPolygon(dataPolygon())
    setIsOpenPolygon(false)
  };


  const selectionChangedCallback = (params: any) => {
    console.log('selection has changed', params.api.getSelectedRows());
    setEditorSimulatorSend(params.api.getSelectedRows())
  };

  const handlePointDetect = (res: any) => {
    console.log("RES -> ", res)
    if (res) {
      fetchDataPoint().then((data: any) => { 
        setDataPoint(data.filter);
        setRowDataPoint(data.data)
  
      })
    } 
  };
  const handlePolylineDetect = (res: any) => {
    console.log("RES -> ", res)
    if (res) {
      fetchDataPolyline().then((data: any) => { 
        setDataPolyline(data.filter);
        setRowDataPolyline(data.data)
  
      }) 
  }
} ;

const handlePolygonDetect = (res: any) => {
  console.log("RES -> ", res)
  if (res) {
    fetchDataPolygon().then((data: any) => { 
      setDataPolygon(data.filter);
      setRowDataPolygon(data.data)

    }) 
}
} ;

  return (
    <>

      {/* <div class="search-container">
        <input type="text" placeholder="Search" />
    </div> */}


      <div>
        <Flex>
          <div style="width:50%;margin: 5px;">
            <div style="border: 1px solid #c295d0c2;
      background: #251c3d;
    border-radius: 20px;">
              <div style="    border-bottom: 1px solid #c295d0c2;
    padding: 2.4vh;">
                <Flex>
                  <div style="width:50%">
                    <Flex>
                      <span>
                        <img src='/point.png' style="width:30px;height:30px"></img>
                      </span>
                      <span style="font-family: 'jaldiBold';
    color: white;
    margin-left: 10px;
    margin-top: 5px;">Data Point</span>
                    </Flex>
                  </div>
                  <div style="width:50%">
                    <Flex>
                      <BiRegularSearchAlt class="icsearchls" />
                      <Select placeholder='Search' class="custom-ls" {...dataSelectPoint} onChange={(e: any) => onFilterPoint(e)} />
                      <Button onClick={onOpenPoint} class="btstatyls" leftIcon={<AiOutlinePlus boxSize={18} style="color:black" />}>
                        <span class="fntls">Tambah</span>
                      </Button>
                    </Flex>
                  </div>
                </Flex>
              </div>
              <div class="ag-theme-balham" style="width:100%;height:330px;border: none;    padding: 2vh;">
                <AgGridSolid
                  columnDefs={columnDefsDataPoint()}
                  rowData={rowDataPoint()}
                  rowSelection="single"
                  defaultColDef={defaultColdefPoint}
                  gridOptions={gridOptionsPoint}
                  // pagination={true}
                  ref={gridRefPoint!}
                // paginationPageSize={100}
                // onGridReady={onGridReady}
                />
              </div>
            </div>
          </div>
          <div style="width:50%;margin: 5px;">
            <div style="border: 1px solid #c295d0c2;
      background: #251c3d;
    border-radius: 20px;">
              <div style="    border-bottom: 1px solid #c295d0c2;
    padding: 2.4vh;">
                <Flex>
                  <div style="width:50%">
                    <Flex>
                      <span>
                        <img src='/polyline.png' style="width:30px;height:30px"></img>
                      </span>
                      <span style="font-family: 'jaldiBold';
    color: white;
    margin-left: 10px;
    margin-top: 5px;">Data Line</span>
                    </Flex>
                  </div>
                  <div style="width:50%;">
                    <Flex>
                      <BiRegularSearchAlt class="icsearchls" />
                      <Select placeholder='Search' class="custom-ls" {...dataSelectPolyline} onChange={(e: any) => onFilterPolyline(e)} />
                      <Button onClick={onOpenPolyline} class="btstatyls" leftIcon={<AiOutlinePlus boxSize={18} style="color:black" />}>
                        <span class="fntls">Tambah</span>
                      </Button>
                    </Flex>
                  </div>
                </Flex>
              </div>
              <div class="ag-theme-balham" style="width:100%;height:330px;border: none;    padding: 2vh;">
                <AgGridSolid
                  columnDefs={columnDefsDataPolyline()}
                  rowData={rowDataPolyline()}
                  rowSelection="single"
                  defaultColDef={defaultColdefPolyline}
                  gridOptions={gridOptionsPolyline}
                  ref={gridRefPolyline!}
                  suppressRowClickSelection={true}
                  // groupDefaultExpanded={1} 
                  groupSelectsChildren={true}
                  autoGroupColumnDef={autoGroupColumnDef}
                  masterDetail={true}
                />
              </div>
            </div>
          </div>
        </Flex>
      </div>

      <div>
        <Flex>
          <div style="width:50%;margin: 5px;">
            <div style="border: 1px solid #c295d0c2;
      background: #251c3d;
    border-radius: 20px;">
              <div style="    border-bottom: 1px solid #c295d0c2;
    padding: 2.4vh;">
                <Flex>
                  <div style="width:50%">
                    <Flex>
                      <span>
                        <img src='/polygon.png' style="width:30px;height:30px"></img>
                      </span>
                      <span style="font-family: 'jaldiBold';
    color: white;
    margin-left: 10px;
    margin-top: 5px;">Data Polygon</span>
                    </Flex>
                  </div>
                  <div style="width:50%">
                    <Flex>
                      <BiRegularSearchAlt class="icsearchls" />
                      <Select placeholder='Search' class="custom-ls" {...dataSelectPolygon} onChange={(e: any) => onFilterPolygon(e)} />
                      <Button onClick={onOpenPolygon} class="btstatyls" leftIcon={<AiOutlinePlus boxSize={18} style="color:black" />}>
                        <span class="fntls">Tambah</span>
                      </Button>
                    </Flex>
                  </div>
                </Flex>
              </div>
              <div class="ag-theme-balham" style="width:100%;height:330px;border: none;    padding: 2vh;">
                <AgGridSolid
                  columnDefs={columnDefsDataPolygon()}
                  rowData={rowDataPolygon()}
                  rowSelection="single"
                  defaultColDef={defaultColdefPolygon}
                  gridOptions={gridOptionsPolygon}
                  // pagination={true}
                  ref={gridRefPolygon!}
                  groupSelectsChildren={true}
                  autoGroupColumnDef={autoGroupColumnDefPolygon}
                  masterDetail={true}
                // paginationPageSize={100}
                // onGridReady={onGridReady}
                />
              </div>
            </div>
          </div>
          <div style="width:50%;margin: 5px;">
            <div style="border: 1px solid #c295d0c2;
      background: #251c3d;
    border-radius: 20px;">
              <div style="    border-bottom: 1px solid #c295d0c2;
    padding: 2.7vh;">
                <Flex>
                  <div style="width:100%">
                    <Flex>
                      <span>
                        <img src='/gis.png' style="width:30px;height:30px"></img>
                      </span>
                      <span style="font-family: 'jaldiBold';
    color: white;
    margin-left: 10px;
    margin-top: 5px;">Map</span>
                    </Flex>
                  </div>
                </Flex>
              </div>
              <div>
                <GisMap  sendData={editorSimulatorSend()} />
              </div>
            </div>
          </div>
        </Flex>
      </div>


      {/* -----------GIS POINT------------ */}

      <Modal  centered size={'5xl'}
        scrollBehavior={scrollBehavior()}
        opened={isOpenPoint()} 
        onClosePoint={onClosePoint}
      >
        <ModalOverlay  />
        <ModalContent> 
          <ModalBody>
         <GisPopUpDataPoint  closeSend={onClosePoint()} detect={handlePointDetect}/>
          </ModalBody> 
        </ModalContent>
      </Modal>


        {/* -----------GIS POLYLINE------------ */}

        <Modal  centered size={'5xl'}
        scrollBehavior={scrollBehavior()}
        opened={isOpenPolyline()} 
        onClosePoint={onCloseDataPolyline}
      >
        <ModalOverlay  />
        <ModalContent> 
          <ModalBody>
         <GisPopUpDataPolyline  closeSend={onCloseDataPolyline()} detect={handlePolylineDetect}/>
          </ModalBody> 
        </ModalContent>
      </Modal>


 {/* -----------GIS POLYGON ----------- */}

 <Modal  centered size={'5xl'}
        scrollBehavior={scrollBehavior()}
        opened={isOpenPolygon()} 
        onClosePoint={onCloseDataPolygon}
      >
        <ModalOverlay  />
        <ModalContent> 
          <ModalBody>
         <GisPopUpDataPolygon  closeSend={onCloseDataPolygon()} detect={handlePolygonDetect}/>
          </ModalBody> 
        </ModalContent>
      </Modal>



      {/* ----------------------- */}
      {/* 
<Modal  centered size={'4xl'}
        scrollBehavior={scrollBehavior()}
        opened={isOpenDataPolyline()} 
        onClosePoint={onCloseDataPolyline}
      >
        <ModalOverlay  />
        <ModalContent> 
          <ModalBody>
         <GisPopUpDataPolylineAdd  closeSend={onCloseDataPolyline()}/>
          </ModalBody> 
        </ModalContent>
      </Modal> */}



    </>
  );
};
export default GisContent;