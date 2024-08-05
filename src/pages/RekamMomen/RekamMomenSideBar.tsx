import { Component, createSignal, For, onMount, Show } from "solid-js";
import { Select, createOptions } from "@thisbeyond/solid-select";
import "@thisbeyond/solid-select/style.css";
import './RekamMomenSideBar.css'
import { FaSolidSailboat } from 'solid-icons/fa'
import { Flex, Spacer } from "@hope-ui/solid"
import { VsSearch } from 'solid-icons/vs'
import { BsFilterSquare } from 'solid-icons/bs'
import { TbSailboat } from 'solid-icons/tb'
import { BiRegularSearchAlt } from 'solid-icons/bi'
import { Button } from "@hope-ui/solid"
import { OcDotfill2 } from 'solid-icons/oc'




type RekamMomenSideBarProps = {};

const RekamMomenSideBar: Component<RekamMomenSideBarProps> = (props) => {

    const dataSelect = createOptions(
        [
            { name: "La Fayette" },
            { name: "Ly Thai To" },
            { name: "Fregat" },
            { name: "Arrow Head" },
        ],
        { key: "name" }
    );

    const [dataTracking, setDataTracking] = createSignal(

    );

    const fetchDataTracking = async () => {
        try {
            const response = await fetch('/public/json/data-rekaman.json');
            if (!response.ok) {
                throw new Error("Gagal");
            }
            const data = await response.json();
            if (data) {
                setDataTracking(data);
            } else {
            }
        } catch (error) {
        }
    };

    onMount(() => {
        fetchDataTracking()
    })

    return (
        <div class="sb-lssb">
            <div class="hddv-lssb">
                <Flex>
                    <span class="hdic-lssb">
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.2638 13.8825L12.1713 9.83497C11.9425 9.72049 11.6882 9.66642 11.4327 9.6779C11.1771 9.68939 10.9287 9.76604 10.7112 9.90057C10.4936 10.0351 10.314 10.2231 10.1895 10.4465C10.0651 10.67 9.99982 10.9217 10 11.1775V18.8225C9.99982 19.0783 10.0651 19.3299 10.1895 19.5534C10.314 19.7769 10.4936 19.9648 10.7112 20.0994C10.9287 20.2339 11.1771 20.3105 11.4327 20.322C11.6882 20.3335 11.9425 20.2794 12.1713 20.165L20.2638 16.1175C20.4711 16.0135 20.6455 15.854 20.7673 15.6566C20.8891 15.4593 20.9537 15.2319 20.9537 15C20.9537 14.768 20.8891 14.5407 20.7673 14.3433C20.6455 14.146 20.4711 13.9864 20.2638 13.8825Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M15 26.25C21.2132 26.25 26.25 21.2132 26.25 15C26.25 8.7868 21.2132 3.75 15 3.75C8.7868 3.75 3.75 8.7868 3.75 15C3.75 21.2132 8.7868 26.25 15 26.25Z" stroke="white" />
                        </svg>


                    </span>
                    <span class="hdtit-lssb">Draft Rekaman</span>
                </Flex>
            </div>
            <div class="pdtop-lssb">
                <Flex>
                    <BiRegularSearchAlt class="icsearch-lssb" />
                    <Select placeholder='Search' class="custom" {...dataSelect} />
                    <BsFilterSquare class="icfil-lssb" />
                </Flex>
            </div>
            <div class="sc-lssb">
                <For each={dataTracking()}>{(track, i) =>

                    <div class="dv1-lssb">
                        <div class="dv2-lssb">
                            <Flex>
                                <div class="dvnama-lssb">{track.nama}</div>
                            </Flex>
                        </div>
                        <div class="dv4-lssb">
                            <Flex>
                                <div class="w40-lssb">
                                    <img class="imgs-lssb" src={`/public/${track.img}`} />
                                </div>
                                <div class="w60-lssb">
                                    <div class="ta-lssb">{track.title}</div>
                                    <Flex style="color: #eb0000; padding-top: 3px; padding-bottom: 3px;">
                                        <div style="justify-content: center;align-items: center; display: flex;"><OcDotfill2 /></div>
                                        <div class="ta-lssb">{track.status}</div>
                                    </Flex>
                                    <div class="ta-lssb">{track.waktu}</div>
                                </div>
                            </Flex>
                        </div>
                    </div>
                }</For>
            </div>

        </div>
    );
}

export default RekamMomenSideBar;