import { Component, onMount, Show } from "solid-js";
import { createSignal } from "solid-js";
import './AssetContent.css'
import { Flex, Spacer } from "@hope-ui/solid"
import MapView from "../MapView";
import { Button } from "@hope-ui/solid";

import { Select, createOptions } from "@thisbeyond/solid-select";
import "@thisbeyond/solid-select/style.css";
import AgGridSolid, { AgGridSolidRef } from "ag-grid-solid";
import { ColDef } from "ag-grid-community";
import "ag-grid-enterprise";
import { BiRegularSearchAlt } from "solid-icons/bi";
import { AiFillCloseSquare, AiOutlinePlus } from 'solid-icons/ai'
import AssetMapEditorSimulator from "./AssetMapEditorSimulator";
import { BsChevronDown } from 'solid-icons/bs'
import { BsChevronUp } from 'solid-icons/bs'
import { IconButton } from "@hope-ui/solid"
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@hope-ui/solid"
import AssetPopUpAssetAdd from "./AssetPopUpAssetAdd";
import AssetPosPopUpAdd from "./AssetPosPopUpAdd";
import { fetchDataAssetKapal, fetchDataAssetPos, fetchDataAssetPosDelete } from "../../service/service";
import { RiSystemDeleteBin2Line } from 'solid-icons/ri'
import { FiEdit } from 'solid-icons/fi'
import AssetPosPopUpEdit from "./AssetPosPopUpEdit";

type AssetContentProps = {
};

const AssetContent: Component<AssetContentProps> = (props) => {
  let gridRefAssetPos: AgGridSolidRef;
  let gridRefAssetKapal: AgGridSolidRef;
  const [rowDataAssetPos, setRowDataAssetPos] = createSignal([]);
  const [rowDataAssetKapal, setRowDataAssetKapal] = createSignal([]);
  const defaultColdefAssetPos = {
    filter: true,
    resizable: true,
    sortable: true,
  };
  const gridOptionsAssetPos = {
    rowHeight: 40,
    headerHeight: 50,
    rowStyle: { textAlign: "center" },
  };
  const defaultColdefAssetKapal = {
    filter: true,
    resizable: true,
    sortable: true,
  };
  const gridOptionsAssetKapal = {
    rowHeight: 70,
    headerHeight: 50,
    rowStyle: { textAlign: "center" },
  };

  const ImageRenderer = ({ data }: { data: any }) => {
    onMount(() => {
    })
    return (
      <>
        <img class="imgs-lssb" style="    width: 70px;  height: 60px; " src={`${data.gambar}`} />
      </>
    );
  };

  const ButtonRenderer = ({ data }: { data: any }) => {
    onMount(() => {
    })
    return (
      <>
     <Flex>
     <span style="    margin-right: 10px;"> <IconButton onClick={() => onOpenAssetPosEdit(data)} style="background: #8321b5;" size="xs" aria-label="Edit" icon={<FiEdit />} /></span>
      <span> <IconButton  onClick={onOpenAssetPosDelete} style="background: #ef0000;" size="xs" aria-label="Delete" icon={<RiSystemDeleteBin2Line />} /></span>
     </Flex>
      </>
    );
  };

  const [columnDefsDataAssetKapal, setColumnDefsDataAssetKapal]: any = createSignal([
    {
      headerName: "Nama Asset",
      field: "nama",
      width: 300,
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
      width: 180,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
    },
    {
      headerName: "Kecepatan",
      field: "kecepatan",
      width: 180,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
    },
    {
      headerName: "Jarak",
      field: "jarak",
      width: 180,
      headerClass: 'ag-header-cell',
      cellStyle: {
        display: "flex",
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
  const [columnDefsDataAssetPos, setColumnDefsDataAssetPos]: any = createSignal([
    {
      headerName: "Asset Grup",
      field: "grup",
      width: 120,
      flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
    },
    {
      field: "lokasi",
      headerName: "Lokasi",
      width: 110,
      flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
    },

    {
      headerName: "Longitude",
      field: "lng",
      width: 120,
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
      width: 100,
      flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }, cellClass: "center-cell",
    },
    {
      field: "",
      headerName: "Aksi",
      width: 130,
      // flex: 1,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: ButtonRenderer,
    },
  ]);

  const [dataAssetPos, setDataAssetPos]: any = createSignal([]);
  const [dataAssetKapal, setDataAssetKapal]: any = createSignal([]);

  onMount(() => {

    fetchDataAssetKapal().then((data: any) => {
      setRowDataAssetKapal(data.data)
      setDataAssetKapal(data.filter);

    })
    fetchDataAssetPos().then((data: any) => {
      setRowDataAssetPos(data.data)
      setDataAssetPos(data.filter);
    })

  })

  const dataSelectAssetPos = createOptions(
    dataAssetPos,
    { key: "lokasi" }
  )

  const dataSelectAssetKapal = createOptions(
    dataAssetKapal,
    { key: "nama" }
  )


  const onFilterAssetPos = (event: any) => {
    if (event == null) {
      gridRefAssetPos.api.setQuickFilter('')
    } else {
      gridRefAssetPos.api.setQuickFilter(event.lokasi)
    }

  }

  const onFilterAssetKapal = (event: any) => {
    if (event == null) {
      gridRefAssetKapal.api.setQuickFilter('')
    } else {
      gridRefAssetKapal.api.setQuickFilter(event.nama)
    }

  }

  const [scrollBehavior, setScrollBehavior] = createSignal("inside");
  const [isOpenAssetKapal, setIsOpenAssetKapal] = createSignal(false);
  const [AssetPosSelection, setAssetPosSelection] : any = createSignal(null);
  const [isOpenAssetPos, setIsOpenAssetPos] = createSignal(false);
  const [isOpenAssetPosDelete, setIsOpenAssetPosDelete] = createSignal(false);
  const [isOpenAssetPosEdit, setIsOpenAssetPosEdit] = createSignal(false);

  const [posDetect, setPosDetect] = createSignal(false);
  const handlePosDetect = (res: any) => {
    console.log("RES -> ", res)
    if (res) {
      fetchDataAssetPos().then((data: any) => {
        setRowDataAssetPos(data.data)
        setDataAssetPos(data.filter);
      })
    } else { }
  };

  const handleKapalDetect = (res: any) => {
    console.log("RES -> ", res)
    if (res) {
      fetchDataAssetKapal().then((data: any) => {
        setRowDataAssetKapal(data.data)
        setDataAssetKapal(data.filter);
      })
    } else { }
  };

  const onOpenAssetPos = () => setIsOpenAssetPos(true);
  const onCloseAssetPos = () => {
    console.log("posDetect => ", posDetect());
    setIsOpenAssetPos(false);
  };

  const onOpenAssetPosDelete = () => setIsOpenAssetPosDelete(true);
  const onCloseAssetPosDelete = () => {
    setIsOpenAssetPosDelete(false);
  };
  const onOpenAssetPosEdit = (data : any) => {
console.log("data masuk -> ",data);
setAssetPosSelection(data);
    setIsOpenAssetPosEdit(true)
  };
  const onCloseAssetPosEdit = () => {
    setIsOpenAssetPosEdit(false);
  };

  const onOpenAssetKapal = () => setIsOpenAssetKapal(true);
  const onCloseAssetKapal = () => {
    const dataAssetLocal: any = JSON.parse(localStorage.getItem('dataAssetKapal'));
    setIsOpenAssetKapal(false)

  };



  const onSelectionChange = (event: any) => {
    const selectedData = event.api.getSelectedNodes()[0]?.data;
    if (selectedData) {
    }

  }


  const DeleteAssetPos = () => {
   console.log("event -> delete " , AssetPosSelection());
   fetchDataAssetPosDelete(AssetPosSelection().id.id.String).then((data: any) => {
if(data.status === 'ok'){
    fetchDataAssetPos().then((data: any) => {
      setRowDataAssetPos(data.data)
      setDataAssetPos(data.filter);
      setIsOpenAssetPosDelete(false);
    })
  }

  })
  }

  const [isDataKapal, setIsDataKapal] = createSignal(true); // State untuk menentukan tabel yang ditampilkan
  const [selectedData, setSelectedData] = createSignal('kapal'); // Default selection
  const [isDropdownOpen, setIsDropdownOpen] = createSignal(false);

  const onChangeDataSelection = (value: string) => {
    setIsDataKapal(value === 'kapal');
    setSelectedData(value); // Update selected data
    setIsDropdownOpen(false);
  };


  return (
    <>


      {/* Dropdown untuk memilih tabel */}



      {/* Tampilkan tabel berdasarkan pilihan */}
      {isDataKapal() ? (
        <div>
          <Flex>
            <div style="width:100%;margin: 5px;">
              <div style="border: 1px solid #c295d0c2; background: #251c3d; border-radius: 20px;">
                <div style="border-bottom: 1px solid #c295d0c2; padding: 2.4vh;">
                  <Flex>
                    <div style="width:100%">
                      <Flex>
                        <span>
                          <img src='/kapal.png' style="width:30px;height:30px" />
                        </span>
                        <span style="font-family: 'jaldiBold'; color: white; margin-left: 10px; margin-top: 5px;">Data Kapal</span>
                      </Flex>
                    </div>
                    <div style="justify-content: end; align-items: end; display: flex;">
                      <Flex>
                      <div style="position: relative; margin: 0px 0; display: flex; justify-content: flex-end;">
  <div
    onClick={() => setIsDropdownOpen(!isDropdownOpen())}
    style="padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background-color: #666077;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: white;
    font-family: 'jaldiBold';
    width: 133px;
    font-size: 0.9em;
    height: 35px;"
  >
    {selectedData() === 'kapal' ? (
      <>
        <img src='/kapal.png' style="width:17px;height:17px; margin-right: 5px;" />
        <span style="margin-right:10px">Data Kapal</span>
        <BsChevronDown />
      </>
    ) : (
      <>
        <img src='/asset_pos.png' style="width:15px;height:15px; margin-right: 5px;" />
        <span style="    margin-right: 10px;">Data POS</span>
        <BsChevronDown />
      </>
    )}
  </div>
  {isDropdownOpen() && (
    <ul style="position: absolute;
    background: #666077;
    border: 1px solid #ccc;
    border-radius: 4px;
    list-style: none;
    padding: 0;
    margin: 0;
    z-index: 100;
    color: white;
    font-family: 'jaldiBold';
    width: 133px;
    font-size: 0.9em;
">
      <li onClick={() => onChangeDataSelection('kapal')} style="padding: 8px; cursor: pointer; display: flex; align-items: center;    border-bottom: 1px solid #f3f3f3;">
        <img src='/kapal.png' style="width:17px;height:17px; margin-right: 5px;" />
        <span style="    margin-right: 10px;">Data Kapal</span>
        <BsChevronDown />
      </li>
      <li onClick={() => onChangeDataSelection('pos')} style="padding: 8px; cursor: pointer; display: flex; align-items: center;">
        <img src='/asset_pos.png' style="width:15px;height:15px; margin-right: 5px;" />
        <span style="    margin-right: 20px;">Data POS</span>
        <BsChevronDown />
      </li>
    </ul>
  )}
</div>
                        <BiRegularSearchAlt class="icsearchls" />
                        <Select placeholder='Search' class="custom-ls" {...dataSelectAssetKapal} onChange={(e: any) => onFilterAssetKapal(e)} />
                        <Button onClick={onOpenAssetKapal} class="btstatyls" leftIcon={<AiOutlinePlus boxSize={18} style="color:black" />}>
                          <span class="fntls">Tambah</span>
                        </Button>
                      </Flex>
                    </div>
                  </Flex>
                </div>
                <div class="ag-theme-balham" style="width:100%;height:600px;border: none; padding: 2vh;">
                  <AgGridSolid
                    columnDefs={columnDefsDataAssetKapal()}
                    rowData={rowDataAssetKapal()}
                    rowSelection="single"
                    defaultColDef={defaultColdefAssetKapal}
                    gridOptions={gridOptionsAssetKapal}
                    ref={gridRefAssetKapal!}
                  />
                </div>
              </div>
            </div>
          </Flex>
        </div>
      ) : (
        <div>
          <Flex>
            <div style="width:100%;margin: 5px;">
              <div style="border: 1px solid #c295d0c2; background: #251c3d; border-radius: 20px;">
                <div style="border-bottom: 1px solid #c295d0c2; padding: 2.4vh;">
                  <Flex>
                    <div style="width:100%">
                      <Flex>
                        <span>
                          <img src='/asset_pos.png' style="width:30px;height:30px" />
                        </span>
                        <span style="font-family: 'jaldiBold'; color: white; margin-left: 10px; margin-top: 5px;">Data POS</span>
                      </Flex>
                    </div>
                    <div style="justify-content: end; align-items: end; display: flex;">
                      <Flex>
                      <div style="position: relative; margin: 0px 0; display: flex; justify-content: flex-end;">
  <div
    onClick={() => setIsDropdownOpen(!isDropdownOpen())}
    style="padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background-color: #666077;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: white;
    font-family: 'jaldiBold';
    width: 133px;
    font-size: 0.9em;
    height: 35px;"
  >
    {selectedData() === 'kapal' ? (
      <>
        <img src='/kapal.png' style="width:17px;height:17px; margin-right: 5px;" />
        <span style="    margin-right: 10px;">Data Kapal</span>
        <BsChevronDown />
      </>
    ) : (
      <>
        <img src='/asset_pos.png' style="width:15px;height:15px; margin-right: 5px;" />
        <span style="    margin-right: 20px;">Data POS</span>
        <BsChevronDown />
      </>
    )}
  </div>
  {isDropdownOpen() && (
    <ul style="position: absolute;
    background: #666077;
    border: 1px solid #ccc;
    border-radius: 4px;
    list-style: none;
    padding: 0;
    margin: 0;
    z-index: 100;
    color: white;
    font-family: 'jaldiBold';
    width: 133px;
    font-size: 0.9em;
">
      <li onClick={() => onChangeDataSelection('kapal')} style="padding: 8px; cursor: pointer; display: flex; align-items: center;    border-bottom: 1px solid #f3f3f3;">
        <img src='/kapal.png' style="width:17px;height:17px; margin-right: 5px;" />
        <span style="    margin-right: 10px;">Data Kapal</span>
        <BsChevronDown />
      </li>
      <li onClick={() => onChangeDataSelection('pos')} style="padding: 8px; cursor: pointer; display: flex; align-items: center;">
        <img src='/asset_pos.png' style="width:15px;height:15px; margin-right: 5px;" />
        <span style="    margin-right: 20px;">Data POS</span>
        <BsChevronDown />
      </li>
    </ul>
  )}
</div>
                        <BiRegularSearchAlt class="icsearchls" />
                        <Select placeholder='Cari Lokasi' class="custom-ls" {...dataSelectAssetPos} onChange={(e: any) => onFilterAssetPos(e)} />
                        <Button onClick={onOpenAssetPos} class="btstatyls" leftIcon={<AiOutlinePlus boxSize={18} style="color:black" />}>
                          <span class="fntls">Tambah</span>
                        </Button>
                      </Flex>
                    </div>
                  </Flex>
                </div>
                <div class="ag-theme-balham" style="width:100%;height:600px;border: none; padding: 2vh;">
                  <AgGridSolid
                    columnDefs={columnDefsDataAssetPos()}
                    rowData={rowDataAssetPos()}
                    rowSelection="single"
                    defaultColDef={defaultColdefAssetPos}
                    gridOptions={gridOptionsAssetPos}
                    onSelectionChanged={onSelectionChange}
                    ref={gridRefAssetPos!}
                  />
                </div>
              </div>
            </div>
          </Flex>
        </div>
      )}

      {/* ----------------------- */}

      <Modal centered size={'xl'}
        scrollBehavior={scrollBehavior()}
        opened={isOpenAssetKapal()}
        onCloseAsset={onCloseAssetKapal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <AssetPopUpAssetAdd closeSend={onCloseAssetKapal()} detect={handleKapalDetect} />
          </ModalBody>
        </ModalContent>
      </Modal>



      {/* -----------ASSET POS ADD------------ */}

      <Modal centered size={'6xl'}
        scrollBehavior={scrollBehavior()}
        opened={isOpenAssetPos()}
        onCloseAsset={onCloseAssetPos}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <AssetPosPopUpAdd closeSend={onCloseAssetPos()} detect={handlePosDetect} />
          </ModalBody>
        </ModalContent>
      </Modal>

        {/* -----------ASSET POS DELETE------------ */}

        <Modal centered size={'sm'}
        scrollBehavior={scrollBehavior()}
        opened={isOpenAssetPosDelete()}
        onCloseAsset={onCloseAssetPosDelete}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
          <div style="border: 1px solid #c295d0c2;
      background: #817f86;
    border-radius: 20px;">
        <div style="
    padding: 2.4vh;">  <div style="width:100%" class="dvp">
            <Flex>
              <div style="width:80%">
                <Flex>
                <span>
                        <img src='/asset_pos.png' style="width:30px;height:30px"></img>
                      </span>
                  <span style="font-family: 'jaldiBold';
    color: white;
    margin-left: 10px;
    margin-top: 5px;">Hapus Data POS</span>
                </Flex>
              </div>

              <div class="w20">
                <AiFillCloseSquare onClick={() => onCloseAssetPosDelete()} class="cp" style="cursor:pointer" />

              </div>
            </Flex>
          </div>
          </div>

          <div style="font-family: 'jaldiBold';
    color: #ffffff;
    text-align: center;
    margin-bottom: 20px;">Apakah Anda Ingin Menghapus Data POS ?</div>
          <div style="    text-align: center;
    margin-bottom: 15px;"> <Button onClick={DeleteAssetPos} style="background: #ff1e1e;" size="sm"  leftIcon={<RiSystemDeleteBin2Line boxSize={20} />}>Hapus</Button></div>
          </div>

          </ModalBody>
        </ModalContent>
      </Modal>

      {/* -----------ASSET POS EDIT------------ */}

      <Modal centered size={'6xl'}
        scrollBehavior={scrollBehavior()}
        opened={isOpenAssetPosEdit()}
        onCloseAsset={onCloseAssetPosEdit}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <AssetPosPopUpEdit closeSend={onCloseAssetPosEdit()} detect={handlePosDetect} dataPos={AssetPosSelection()} />
          </ModalBody>
        </ModalContent>
      </Modal>


    </>
  );
};
export default AssetContent;