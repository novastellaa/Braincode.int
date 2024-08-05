import { Component, onMount, Show } from "solid-js";
import { createSignal } from "solid-js";
import './LogSimulasiContent.css'
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
import LogSimulasiPopUpAssetAdd from "./LogSimulasiPopUpAssetAdd";
import LogSimulasiPopUpDataGisAdd from "./LogSimulasiPopUpDataGisAdd";
import { fetchDataRuteKapal } from "../../service/service";


type LogSimulasiContentProps = { 
};

const LogSimulasiContent: Component<LogSimulasiContentProps> = (props) => {
  let gridRefAsset: AgGridSolidRef;
  let gridRefGis: AgGridSolidRef;
  let gridRefEditorSimulator: AgGridSolidRef;
  const [rowDataAsset, setRowDataAsset] = createSignal([]);
  const [rowDataGis, setRowDataGis] = createSignal([]);
  const [rowDataEditorSimulator, setRowDataEditorSimulator] = createSignal([]);
  const defaultColdefAsset = {
    filter: true,
    resizable: true,
    sortable: true, 
  };
  const gridOptionsAsset = {
    rowHeight: 70, 
    headerHeight: 50,   
    rowStyle: { textAlign: "center" },
  }; 

  const defaultColdefGis = {
    filter: true,
    resizable: true,
    sortable: true, 
  };
  const gridOptionsGis = {
    rowHeight: 40, 
    headerHeight: 50,   
    rowStyle: { textAlign: "center" },
  }; 

  const defaultColdefEditorSimulator = {
    filter: true,
    resizable: true,
    sortable: true, 
  };
  const gridOptionsEditorSimulator = {
    rowHeight: 40, 
    headerHeight: 50,   
    rowStyle: { textAlign: "center" },
  }; 

  const ImageRenderer = ({ data }: { data: any }) => { 
    onMount(() => {
// console.log(data)
    })
    return (
     <>
     <img class="imgs-lssb" style="    width: 70px;  height: 60px; " src={`${data.image}`} />
     </>
    );
  };

  const ButtonRenderer = ({ data }: { data: any }) => { 
    return (
     <>
     <span style="cursor:pointer">
     <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.667 1.66663H3.33366C2.40866 1.66663 1.66699 2.40829 1.66699 3.33329V16.6666C1.66699 17.5916 2.40866 18.3333 3.33366 18.3333H16.667C17.592 18.3333 18.3337 17.5916 18.3337 16.6666V3.33329C18.3337 2.40829 17.592 1.66663 16.667 1.66663ZM16.667 16.6666H3.33366V3.33329H16.667M7.35866 8.54163L6.07533 7.25829L5.00033 8.33329V4.99996H8.33366L7.25866 6.07496L8.54199 7.35829M11.4587 7.35829L12.742 6.07496L11.667 4.99996H15.0003V8.33329L13.9253 7.25829L12.642 8.54163M12.642 11.4583L13.9253 12.7416L15.0003 11.6666V15H11.667L12.742 13.925L11.4587 12.6416M8.54199 12.6416L7.25866 13.925L8.33366 15H5.00033V11.6666L6.07533 12.7416L7.35866 11.4583" fill="#9BEC00"/>
</svg>
</span>
     </>
    );
  };
  const [columnDefsDataAsset, setColumnDefsDataAsset]: any = createSignal([
    {
      headerName: "Nama Asset", 
      field: "nama",
      width: 95,
      // flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
    }, 
    {
      field: "image",
      headerName: "Gambar Asset",
      width: 110,
      // flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: ImageRenderer,
    },
    {
      headerName: "Dimensi", 
      field: "dimensi",
      width: 80,
      // flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
    }, 
    {
      headerName: "Kecepatan", 
      field: "kecepatan",
      width: 90,
      // flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
    }, 
    {
      headerName: "Jarak", 
      field: "jarak",
      width: 80,
      // flex: 1, 
      headerClass: 'ag-header-cell',
      cellStyle: {
        display: "flex",
        // textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
    }, 
    {
      headerName: "Unit", 
      field: "unit",
      width: 90,
      flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
    }, 
  ]);

  const [columnDefsDataGis, setColumnDefsDataGis]: any = createSignal([
    {
      headerName: "Lokasi", 
      field: "lokasi",
      width: 110,
      // flex: 1,
      cellStyle: {
        // display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
    }, 
    {
      field: "luas",
      headerName: "Luas",
      width: 100,
      // flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }
    },
    {
      headerName: "Latitude", 
      field: "latitude",
      width: 195,
      flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
    }, 
    {
      headerName: "Longitude", 
      field: "longitude",
      width: 195,
      flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
    }
  ]);

  const [columnDefsDataEditorSimulator, setColumnDefsDataEditorSimulator]: any = createSignal([
    {
      field: "detail",
      headerName: "",
      width: 50,
      // flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: ButtonRenderer,
    },
    {
      headerName: "Pos Mulai", 
      field: "start_pos",
      width: 90,
      // flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
    }, {
      headerName: "Pos Stop", 
      field: "end_pos",
      width: 90,
      // flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
    },{
      headerName: "Mulai", 
      field: "start_date",
      width: 80,
      // flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
    },
    {
      headerName: "Stop", 
      field: "end_date",
      width: 80,
      // flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
    },
    {
      headerName: "Kapal", 
      field: "start_kapal.nama",
      width: 100,
      // flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
    }, 
    {
      headerName: "Jarak Titik", 
      field: "jarak_marker",
      width: 100,
      // flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
      valueFormatter: (params: any) => {
        return `${(params.value / 1000).toFixed(2)} km`;
    },
    },
     {
      headerName: "Jarak Garis", 
      field: "jarak_polyline",
      width: 100,
      // flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
      valueFormatter: (params: any) => {
        return `${(params.value / 1000).toFixed(2)} km`;
    },
    } 
       
  ]);

  const [dataAsset, setDataAsset] = createSignal([]);
  const [dataGis, setDataGis] = createSignal([]);
  const [dataEditorSimulator, setDataEditorSimulator] = createSignal([]);
  const [editorSimulatorSend, setEditorSimulatorSend] : any = createSignal([]);
  
  const [dataAssetSelect, setDataAssetSelect] = createSignal([]);

  const addData = () => {
  const dataAssetLocal : any = JSON.parse(localStorage.getItem('dataAsset'));
   let data = {
      "nama": "Ly Thai Toaasadad",
      "image": "lythaito.jpg",
      "dimensi": "102 x 15 x 5.3",
      "kecepatan": "26",
      "jarak": "5.000",
      "unit": "SSM, SAM, AK-176, AK-630, AO-18KD, ESM/ECM, Radar Air, Surface, Sonar"
  }
  console.log("before add -> ", dataAssetLocal);
    dataAssetLocal.push(data)
    console.log("after add",dataAssetLocal)
  localStorage.setItem('dataAsset', JSON.stringify(dataAssetLocal)); 
//  const dataAssetLocal : any = JSON.parse(localStorage.getItem('dataAsset'));
  }
  const fetchDataAsset = async () => {
      try {
        const response = await fetch('/public/json/data-asset-kapal.json');
        if (!response.ok) {
          throw new Error("Gagal");
        }
        const data = await response.json(); 
        if (data) {
          const dataAssetLocal : any = JSON.parse(localStorage.getItem('dataAsset'));
          console.log("dataAssetLocal -> ", dataAssetLocal)
          if(dataAssetLocal == null){
            setDataAsset(data); 
            setRowDataAsset(dataAsset())
            localStorage.setItem('dataAsset', JSON.stringify(dataAsset())); 
          }else{
            setTimeout(() =>{
              setDataAsset(dataAssetLocal); 
              setRowDataAsset(dataAssetLocal) 
            },200)
          }
           
        } else { 
        }
      } catch (error) { 
      }
    };

    const fetchDataGis = async () => {
      try {
        const response = await fetch('/public/json/data-gis.json');
        if (!response.ok) {
          throw new Error("Gagal");
        }
        const data = await response.json(); 
        if (data) {
          const dataGisLocal : any = JSON.parse(localStorage.getItem('dataGis'));
          console.log("dataGisLocal -> ", dataGisLocal)
          if(dataGisLocal == null){
            setDataGis(data); 
            setRowDataGis(dataGis())
            localStorage.setItem('dataGis', JSON.stringify(dataGis())); 
          }else{
            setTimeout(() =>{
              setDataGis(dataGisLocal); 
              setRowDataGis(dataGisLocal) 
            },200)
          }
           
        } else { 
        }
      } catch (error) { 
      }
    };

    const fetchDataEditorSimulator = async () => {
      try {
        const response = await fetch('/public/json/data-editor-simulator.json');
        if (!response.ok) {
          throw new Error("Gagal");
        }
        const data = await response.json(); 
        if (data) {
          // setDataEditorSimulator(data); 
          // setRowDataEditorSimulator(dataEditorSimulator())
          const dataEditorSimulatorLocal : any = JSON.parse(localStorage.getItem('dataEditorSimulator'));
          console.log("dataEditorSimulatorLocal -> ", dataEditorSimulatorLocal)
          if(dataEditorSimulatorLocal == null){
            setDataEditorSimulator(data); 
            setRowDataEditorSimulator(dataEditorSimulator())
            localStorage.setItem('dataEditorSimulator', JSON.stringify(dataEditorSimulator())); 
          }else{
            setTimeout(() =>{
              setDataEditorSimulator(dataEditorSimulatorLocal); 
              setRowDataEditorSimulator(dataEditorSimulatorLocal) 
            },200)
          }
        } else { 
        }
      } catch (error) { 
      }
    };

  

  onMount(() => {
    fetchDataAsset()
    fetchDataGis()
    // fetchDataEditorSimulator()
 
    fetchDataRuteKapal().then((data: any) => {
      console.log("data add -> ", data);
      setDataEditorSimulator(data.filter); 
      setRowDataEditorSimulator(data.data);
      
    })


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

  const dataSelectAsset = createOptions(
    dataAsset,
    { key: "nama" }
)

const dataSelectGis = createOptions(
  dataGis,
  { key: "lokasi" }
)

const dataSelectEditorSimulator = createOptions(
  dataEditorSimulator,
  { key: "position" }
)



const onFilterAsset = (event: any) => { 
  if(event == null){
    gridRefAsset.api.setQuickFilter('')
  }else{
    gridRefAsset.api.setQuickFilter(event.nama)
  }
 
}

const onFilterGis = (event: any) => { 
  if(event == null){
    gridRefGis.api.setQuickFilter('')
  }else{
    gridRefGis.api.setQuickFilter(event.lokasi)
  }
  
}

const onFilterEditor = (event: any) => { 
  if(event == null){
    gridRefEditorSimulator.api.setQuickFilter('')
  }else{
    
  gridRefEditorSimulator.api.setQuickFilter(event.aset)
  }
}

  



const [scrollBehavior, setScrollBehavior] = createSignal("inside");
const [isOpenAsset, setIsOpenAsset] = createSignal(false); 
const [isOpenDataGis, setIsOpenDataGis] = createSignal(false); 


const onOpenAsset = () => setIsOpenAsset(true);
const onCloseAsset = () => {
  const dataAssetLocal : any = JSON.parse(localStorage.getItem('dataAsset')); 
  setDataAsset(dataAssetLocal); 
  setRowDataAsset(dataAsset()) 
  setIsOpenAsset(false)

};

const onOpenDataGis = () => setIsOpenDataGis(true);
const onCloseDataGis = () => {
  const dataGisLocal : any = JSON.parse(localStorage.getItem('dataGis')); 
  setDataGis(dataGisLocal); 
  setRowDataGis(dataGis()) 
  setIsOpenDataGis(false)
};

const onCloseDataEditorSimulator = () => {
  // console.log("close head")
  // const dataEditorSimulatorLocal : any = JSON.parse(localStorage.getItem('dataEditorSimulator')); 
  // setDataEditorSimulator(dataEditorSimulatorLocal); 
  // setRowDataEditorSimulator(dataEditorSimulator())  

  fetchDataRuteKapal().then((data: any) => {
    console.log("data add -> ", data);
    setDataEditorSimulator(data.filter); 
    setRowDataEditorSimulator(data.data);
    
  })
};


const selectionChangedCallback = (params: any) => {
  console.log('selection has changed', params.api.getSelectedRows());
  setEditorSimulatorSend(params.api.getSelectedRows())
};

  return (
    <>

{/* <div class="search-container">
        <input type="text" placeholder="Search" />
    </div> */}

    
{/* <div>
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
<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.5 26.8675C4.11875 26.9875 5.48 25.625 6.66625 25.625C7.8525 25.625 9.78125 26.8812 10.8337 26.8675C12.0962 26.8787 13.575 25.625 15 25.625C16.425 25.625 17.9038 26.8787 19.1663 26.8675C20.785 26.9875 22.1462 25.625 23.3337 25.625C24.5212 25.625 26.4475 26.8812 27.5 26.8675M7.5 25.625C5.7275 23.4175 4.47875 20.5912 3.94625 19.0937C3.7775 18.6187 3.69375 18.3812 3.79125 18.1537C3.89 17.9275 4.12875 17.8212 4.61 17.6087L13.9725 13.4613C14.4775 13.2363 14.7312 13.125 15 13.125C15.2688 13.125 15.5225 13.2375 16.0287 13.4625L25.39 17.6087C25.87 17.8212 26.11 17.9275 26.2087 18.1537C26.3062 18.3812 26.2213 18.6187 26.0538 19.0937C25.5213 20.5912 24.2725 23.4175 22.5 25.625" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.5 16.25L7.77 12.7412C7.93875 10.5512 8.0225 9.45625 8.74125 8.79125C9.46 8.125 10.5588 8.125 12.755 8.125H17.245C19.4412 8.125 20.54 8.125 21.2575 8.79125C21.9775 9.45625 22.0613 10.5512 22.23 12.7412L22.5 16.25" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.625 8.125L10.84 6.41C11.035 4.84625 11.1325 4.06375 11.665 3.59375C12.1962 3.125 12.9837 3.125 14.56 3.125H15.44C17.015 3.125 17.8038 3.125 18.335 3.59375C18.8675 4.06375 18.965 4.84625 19.16 6.41L19.375 8.125" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</span>
<span style="font-family: 'jaldiBold';
    color: white;
    margin-left: 10px;
    margin-top: 5px;">Data Asset</span>
</Flex>
        </div>
        <div style="width:50%">
          <Flex>
        <BiRegularSearchAlt class="icsearchls" />
        <Select placeholder='Search' class="custom-ls" {...dataSelectAsset} onChange={(e : any) => onFilterAsset(e)}  /> 
              <Button  onClick={onOpenAsset} class="btstatyls"   leftIcon={<AiOutlinePlus boxSize={18} style="color:black"  />}>
                                <span class="fntls">Tambah</span>
                            </Button>
                            </Flex>
          </div>
      </Flex>
    </div>
<div class="ag-theme-balham" style="width:100%;height:285px;border: none;    padding: 2vh;">
        <AgGridSolid
          columnDefs={columnDefsDataAsset()}
          rowData={rowDataAsset()}
          rowSelection="single"
          defaultColDef={defaultColdefAsset} 
          gridOptions={gridOptionsAsset}
          // pagination={true}
          ref={gridRefAsset!}
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
<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_705_176)">
<path d="M27.2008 22.3968L29.3533 23.4703L15.0002 30.0946L0.49707 23.4009L2.83145 22.4109L5.13113 23.4721L5.12832 23.474L15.0002 28.0303L25.0221 23.4046L25.0193 23.4037L27.2008 22.3968ZM22.5396 15.3824L29.3533 18.7828L15.0002 25.4071L0.49707 18.7134L7.68582 15.6646C8.0527 16.1203 8.47145 16.6215 8.94207 17.1684L5.12832 18.7865L15.0002 23.3428L25.0221 18.7171L21.3152 16.8674C21.7777 16.3237 22.1858 15.8287 22.5396 15.3824Z" fill="#F8F8F8"/>
<path d="M16.875 8.4375C16.875 7.94022 16.6775 7.46331 16.3258 7.11168C15.9742 6.76004 15.4973 6.5625 15 6.5625C14.5027 6.5625 14.0258 6.76004 13.6742 7.11168C13.3225 7.46331 13.125 7.94022 13.125 8.4375C13.125 8.93478 13.3225 9.41169 13.6742 9.76333C14.0258 10.115 14.5027 10.3125 15 10.3125C15.4973 10.3125 15.9742 10.115 16.3258 9.76333C16.6775 9.41169 16.875 8.93478 16.875 8.4375ZM18.75 8.4375C18.75 9.43206 18.3549 10.3859 17.6517 11.0892C16.9484 11.7924 15.9946 12.1875 15 12.1875C14.0054 12.1875 13.0516 11.7924 12.3484 11.0892C11.6451 10.3859 11.25 9.43206 11.25 8.4375C11.25 7.44294 11.6451 6.48911 12.3484 5.78585C13.0516 5.08259 14.0054 4.6875 15 4.6875C15.9946 4.6875 16.9484 5.08259 17.6517 5.78585C18.3549 6.48911 18.75 7.44294 18.75 8.4375ZM15.6863 20.3259L15 21.0638L14.3138 20.3259C10.9791 16.7409 8.86032 14.2678 7.92938 12.8634C7.03622 11.5168 6.5607 9.93626 6.56251 8.32031C6.56251 3.72187 10.3434 0 15 0C19.6566 0 23.4375 3.72187 23.4375 8.32031C23.439 9.93636 22.9632 11.5169 22.0697 12.8634C21.1397 14.2678 19.0209 16.7409 15.6863 20.3259ZM20.5069 11.8284C21.197 10.7887 21.5642 9.56819 21.5625 8.32031C21.5625 4.76344 18.6281 1.875 15 1.875C11.3719 1.875 8.43751 4.76344 8.43751 8.32031C8.43751 9.585 8.80688 10.7916 9.49313 11.8284C10.2863 13.0256 12.1294 15.1969 15 18.3084C17.8706 15.1959 19.7138 13.0256 20.5069 11.8284Z" fill="#F8F8F8"/>
</g>
<defs>
<clipPath id="clip0_705_176">
<rect width="30" height="30" fill="white"/>
</clipPath>
</defs>
</svg>

</span>
<span style="font-family: 'jaldiBold';
    color: white;
    margin-left: 10px;
    margin-top: 5px;">Data GIS</span>
</Flex>
        </div>
        <div style="width:50%;">
          <Flex>
        <BiRegularSearchAlt class="icsearchls" />
        <Select placeholder='Search' class="custom-ls" {...dataSelectGis}  onChange={(e : any) => onFilterGis(e)}/> 
              <Button  onClick={onOpenDataGis}  class="btstatyls"   leftIcon={<AiOutlinePlus boxSize={18} style="color:black"  />}>
                                <span class="fntls">Tambah</span>
                            </Button>
                            </Flex>
          </div>
      </Flex>
    </div>
<div class="ag-theme-balham" style="width:100%;height:285px;border: none;    padding: 2vh;">
        <AgGridSolid
          columnDefs={columnDefsDataGis()}
          rowData={rowDataGis()}
          rowSelection="single"
          defaultColDef={defaultColdefGis} 
          gridOptions={gridOptionsGis}
          // pagination={true}
          ref={gridRefGis!}
          // paginationPageSize={100}
          // onGridReady={onGridReady}
        /> 
        </div>
      </div>
</div>
  </Flex>
</div> */}


<div style="width:100%;margin: 5px;">
  <div style="border: 1px solid #c295d0c2;
      background: #251c3d;
    border-radius: 20px;">
    <div style="    border-bottom: 1px solid #c295d0c2;
    padding: 2.4vh;">
      <Flex>
        <div style="width:50%">
          <Flex>
<span>
<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_705_253)">
<path d="M15.0001 3.54163C12.3774 3.53863 9.80854 4.28625 7.59703 5.69619C5.38551 7.10614 3.62367 9.11952 2.5196 11.4985C1.41552 13.8776 1.01532 16.5229 1.36626 19.122C1.7172 21.7212 2.80462 24.1656 4.50009 26.1666L4.75009 26.4583H25.2501L25.5001 26.1666C27.1956 24.1656 28.283 21.7212 28.6339 19.122C28.9849 16.5229 28.5847 13.8776 27.4806 11.4985C26.3765 9.11952 24.6147 7.10614 22.4032 5.69619C20.1916 4.28625 17.6228 3.53863 15.0001 3.54163ZM22.1668 11.4416L17.2334 16.2833C17.4856 16.8164 17.5412 17.4214 17.3904 17.9915C17.2396 18.5616 16.8922 19.06 16.4094 19.3988C15.9267 19.7375 15.3398 19.8946 14.7524 19.8425C14.165 19.7903 13.615 19.5322 13.1995 19.1138C12.784 18.6953 12.5298 18.1435 12.4818 17.5557C12.4338 16.968 12.5951 16.3822 12.9372 15.9019C13.2793 15.4216 13.7802 15.0777 14.3514 14.9309C14.9225 14.7842 15.5272 14.8441 16.0584 15.1L20.9834 10.2583L22.1668 11.4416ZM3.00009 16.5833H5.83343V18.25H2.96676C2.96676 17.925 2.92509 17.6083 2.92509 17.275C2.92509 16.9416 2.94176 16.8166 2.95843 16.5833H3.00009ZM7.06676 8.24997L9.11676 10.3L7.89176 11.45L5.83343 9.4083C6.20367 8.98759 6.60179 8.59225 7.02509 8.22497L7.06676 8.24997ZM15.8334 8.1583H14.1668V5.24163H15.0001C15.3084 5.24163 15.5834 5.24163 15.8334 5.2833V8.1583ZM27.0751 17.2833C27.0751 17.6083 27.0751 17.9416 27.0334 18.2583H24.1001V16.5916H27.0418C27.0584 16.8166 27.0751 17.05 27.0751 17.2833Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_705_253">
<rect width="30" height="30" fill="white"/>
</clipPath>
</defs>
</svg>


</span>
<span style="font-family: 'jaldiBold';
    color: white;
    margin-left: 10px;
    margin-top: 5px;">Editor Simulator</span>
</Flex>
        </div>
        <div style="width:50%;    width: 50%;
    justify-content: end;
    display: flex;">
          <Flex>
        <BiRegularSearchAlt class="icsearchls" />
        <Select placeholder='Search' class="custom-ls" {...dataSelectEditorSimulator} onChange={(e : any) => onFilterEditor(e)}/> 
        <BsFilterSquare class="icfills" />
                            </Flex>
          </div>
      </Flex>
    </div>
    <Flex>
    <div style="width:65%">
      <LogSimulasiMapEditorSimulator closeSend={onCloseDataEditorSimulator()} sendData={editorSimulatorSend()} />
    </div>
    <div style="width:35%">
<div class="ag-theme-balham" style="width:100%;height:400px;border: none;    padding: 2vh;">
        <AgGridSolid
          columnDefs={columnDefsDataEditorSimulator()}
          rowData={rowDataEditorSimulator()}
          rowSelection="single"
          defaultColDef={defaultColdefEditorSimulator} 
          gridOptions={gridOptionsEditorSimulator}
          onSelectionChanged={selectionChangedCallback}
          // pagination={true}
          ref={gridRefEditorSimulator!}
          // paginationPageSize={100}
          // onGridReady={onGridReady}
        /> 
        </div>
        </div>
        </Flex>
      </div>
</div>

{/* ----------------------- */}

      <Modal  centered size={'xl'}
        scrollBehavior={scrollBehavior()}
        opened={isOpenAsset()} 
        onCloseAsset={onCloseAsset}
      >
        <ModalOverlay  />
        <ModalContent> 
          <ModalBody>
         <LogSimulasiPopUpAssetAdd  closeSend={onCloseAsset()}/>
          </ModalBody> 
        </ModalContent>
      </Modal>


      
{/* ----------------------- */}

<Modal  centered size={'4xl'}
        scrollBehavior={scrollBehavior()}
        opened={isOpenDataGis()} 
        onCloseAsset={onCloseDataGis}
      >
        <ModalOverlay  />
        <ModalContent> 
          <ModalBody>
         <LogSimulasiPopUpDataGisAdd  closeSend={onCloseDataGis()}/>
          </ModalBody> 
        </ModalContent>
      </Modal>
 
 
    </>
  );
};
export default LogSimulasiContent;