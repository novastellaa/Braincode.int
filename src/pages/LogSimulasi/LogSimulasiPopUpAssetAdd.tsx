import { Component, onMount, Show } from "solid-js";
import { createSignal } from "solid-js";
import './LogSimulasiPopUpAssetAdd.css'
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

import {
    Input,
    InputGroup,
    InputLeftAddon,
    InputLeftElement,
    InputRightAddon,
    InputRightElement,
} from "@hope-ui/solid"
import { AiTwotoneCloseCircle } from 'solid-icons/ai'

type LogSimulasiPopUpAssetAddProps = {
    closeSend?: any
};

const LogSimulasiPopUpAssetAdd: Component<LogSimulasiPopUpAssetAddProps> = (props) => {


    // const fetchData = async () => {
    //   try {
    //     const response = await fetch('/public/json/data-editor-simulator.json');
    //     if (!response.ok) {
    //       throw new Error("Gagal");
    //     }
    //     const data = await response.json(); 
    //     if (data) { 
    //     } else { 
    //     }
    //   } catch (error) { 
    //   }
    // };



    onMount(() => {
        // fetchData()
    })

    const [isOpen, setIsOpen] = createSignal(false);

    const onOpen = () => setIsOpen(true);
    const onClose = () => {
        setIsOpen(false)
    };

    const [nama, setNama] = createSignal("");
    const [gambar, setGambar] = createSignal("");
    const [base64, setBase64] = createSignal<string>("");
    const [dimensi, setDimensi] = createSignal("");
    const [kecepatan, setKecepatan] = createSignal("");
    const [jarak, setJarak] = createSignal("");
    const [unit, setUnit] = createSignal(""); 
     const handleChangeNama = (event: Event) => {
        const input = event.target as HTMLInputElement; 
        setNama(input.value);
      };
      const handleChangeGambar  = async (event: Event) => {
        console.log('gambar',event)
        const input = event.target as HTMLInputElement; 
        setGambar(input.value);
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            const base64String = await convertToBase64(file);
            setBase64(base64String);
          }
      };
      const handleChangeDimensi  = (event: Event) => {
        const input = event.target as HTMLInputElement; 
        setDimensi(input.value);
      };
      const handleChangeKecepatan  = (event: Event) => {
        const input = event.target as HTMLInputElement; 
        setKecepatan(input.value);
      };
      const handleChangeJarak  = (event: Event) => {
        const input = event.target as HTMLInputElement; 
        setJarak(input.value);
      };
      const handleChangeUnit  = (event: Event) => {
        const input = event.target as HTMLInputElement; 
        setUnit(input.value);
      };

     
    
      // Function to convert file to base64 string
      const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      };

      const handleClick = () => {

        let data = {
            "nama": nama(),
            "image": base64(),
            "dimensi": dimensi(),
            "kecepatan":  kecepatan(),
            "jarak": jarak(),
            "unit": unit()
        } 
        console.log("event DATA ALL -> ", data);
        const dataAssetLocal : any = JSON.parse(localStorage.getItem('dataAsset')); 
  console.log("before add -> ", dataAssetLocal);
    dataAssetLocal.push(data)
        localStorage.setItem('dataAsset', JSON.stringify(dataAssetLocal));  
    props.closeSend
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
                                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.5 26.8675C4.11875 26.9875 5.48 25.625 6.66625 25.625C7.8525 25.625 9.78125 26.8812 10.8337 26.8675C12.0962 26.8787 13.575 25.625 15 25.625C16.425 25.625 17.9038 26.8787 19.1663 26.8675C20.785 26.9875 22.1462 25.625 23.3337 25.625C24.5212 25.625 26.4475 26.8812 27.5 26.8675M7.5 25.625C5.7275 23.4175 4.47875 20.5912 3.94625 19.0937C3.7775 18.6187 3.69375 18.3812 3.79125 18.1537C3.89 17.9275 4.12875 17.8212 4.61 17.6087L13.9725 13.4613C14.4775 13.2363 14.7312 13.125 15 13.125C15.2688 13.125 15.5225 13.2375 16.0287 13.4625L25.39 17.6087C25.87 17.8212 26.11 17.9275 26.2087 18.1537C26.3062 18.3812 26.2213 18.6187 26.0538 19.0937C25.5213 20.5912 24.2725 23.4175 22.5 25.625" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M7.5 16.25L7.77 12.7412C7.93875 10.5512 8.0225 9.45625 8.74125 8.79125C9.46 8.125 10.5588 8.125 12.755 8.125H17.245C19.4412 8.125 20.54 8.125 21.2575 8.79125C21.9775 9.45625 22.0613 10.5512 22.23 12.7412L22.5 16.25" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M10.625 8.125L10.84 6.41C11.035 4.84625 11.1325 4.06375 11.665 3.59375C12.1962 3.125 12.9837 3.125 14.56 3.125H15.44C17.015 3.125 17.8038 3.125 18.335 3.59375C18.8675 4.06375 18.965 4.84625 19.16 6.41L19.375 8.125" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                                <span style="font-family: 'jaldiBold';
    color: white;
    margin-left: 10px;
    margin-top: 5px;">Tambah Data Asset</span>
    </Flex>
                            </div>

                            <div class="w20">
                                <AiTwotoneCloseCircle onClick={() => props.closeSend} class="cp" />
                            </div>
                        </Flex>
                    </div>
                    <div class="dv">
                        <InputGroup>
                            <InputLeftAddon class="inp">Nama Asset :</InputLeftAddon>
                            <Input  onChange={handleChangeNama} class="inp" type="text" placeholder="" variant="filled" />
                        </InputGroup>
                    </div>
                    <div class="dv">
                        <InputGroup>
                            <InputLeftAddon class="inp">Gambar Asset :</InputLeftAddon>
                            <Input class="inp" value={gambar()} type="text" placeholder="" variant="filled" />
                        </InputGroup>
                    </div>
                    <div class="dv fp">
                        <input type="file" name="file" id="file" class="inputfile" onChange={handleChangeGambar}  />
                        <label for="file">
                            <Flex> <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.9375 25.3125V19.6875H19.6875L15 14.0625L10.3125 19.6875H14.0625V25.3125H9.375V25.2656C9.2175 25.275 9.0675 25.3125 8.90625 25.3125C7.04145 25.3125 5.25302 24.5717 3.93441 23.2531C2.61579 21.9345 1.875 20.1461 1.875 18.2812C1.875 14.6737 4.60312 11.7338 8.10375 11.3306C8.41068 9.72618 9.2671 8.27883 10.5257 7.23751C11.7843 6.1962 13.3665 5.626 15 5.625C16.6338 5.6259 18.2162 6.19602 19.4751 7.23732C20.734 8.27861 21.5908 9.72602 21.8981 11.3306C25.3987 11.7338 28.1231 14.6737 28.1231 18.2812C28.1231 20.1461 27.3823 21.9345 26.0637 23.2531C24.7451 24.5717 22.9567 25.3125 21.0919 25.3125C20.9344 25.3125 20.7825 25.275 20.6231 25.2656V25.3125H15.9375Z" fill="#20EA40" />
                            </svg>
                                <span class="sp">Upload Gambar (Max. 3MB)</span>
                            </Flex>
                        </label>
                    </div>
                    <div class="dv">
                        <InputGroup>
                            <InputLeftAddon class="inp">Dimensi Asset :</InputLeftAddon>
                            <Input class="inp" type="text" placeholder="" variant="filled" onChange={handleChangeDimensi}  />
                        </InputGroup>
                    </div>
                    <div class="dv">
                        <InputGroup>
                            <InputLeftAddon class="inp">Kecepatan Asset :</InputLeftAddon>
                            <Input class="inp" type="text" placeholder="" variant="filled"onChange={handleChangeKecepatan}  />
                        </InputGroup>
                    </div>
                    <div class="dv">
                        <InputGroup>
                            <InputLeftAddon class="inp">Jarak Asset :</InputLeftAddon>
                            <Input class="inp" type="text" placeholder="" variant="filled" onChange={handleChangeJarak} />
                        </InputGroup>
                    </div>
                    <div class="dv">
                        <InputGroup>
                            <InputLeftAddon class="inp">Unit Asset :</InputLeftAddon>
                            <Input class="inp" type="text" placeholder="" variant="filled" onChange={handleChangeUnit} />
                        </InputGroup>
                    </div>
                     
                    <div style="    text-align: center;">
                    <Button class="bt" onClick={handleClick} >Simpan</Button>
                        {/* <Button class="bt" onClick={() => props.closeSend}>Simpan</Button> */}
                    </div>



                </div>
            </div>

            {/* <img src={base64()} alt="Selected" style={{ width: "300px", height: "auto" }} /> */}

        </>
    );
};
export default LogSimulasiPopUpAssetAdd;