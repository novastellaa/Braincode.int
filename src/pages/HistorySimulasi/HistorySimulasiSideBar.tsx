import { Component, createSignal, For, onMount, Show } from "solid-js";
import { Select, createOptions } from "@thisbeyond/solid-select";
import "@thisbeyond/solid-select/style.css";
import './HistorySimulasiSideBar.css'
import { FaSolidSailboat } from 'solid-icons/fa'
import { Flex, Spacer } from "@hope-ui/solid"
import { VsSearch } from 'solid-icons/vs'
import { BsFilterSquare } from 'solid-icons/bs'
import { TbSailboat } from 'solid-icons/tb'
import { BiRegularSearchAlt } from 'solid-icons/bi'
import { Button } from "@hope-ui/solid"




type HistorySimulasiSideBarProps = {};

const HistorySimulasiSideBar: Component<HistorySimulasiSideBarProps> = (props) => {

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
          const response = await fetch('/public/json/data-track.json');
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
                    <svg width="25" height="25" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.9998 11.3344V13.1251H26.8817C27.0266 13.1253 27.1695 13.1592 27.2991 13.2239C27.4287 13.2887 27.5416 13.3826 27.6288 13.4984C27.716 13.6141 27.7752 13.7485 27.8017 13.8909C27.8282 14.0334 27.8214 14.1801 27.7817 14.3194L25.5411 22.1701C25.2053 23.3456 24.4956 24.3797 23.5196 25.1159C22.5435 25.8521 21.3542 26.2502 20.1317 26.2501H9.86793C8.64538 26.2502 7.45607 25.8521 6.48002 25.1159C5.50398 24.3797 4.79435 23.3456 4.45855 22.1701L2.21605 14.3194C2.17635 14.1801 2.16949 14.0334 2.19602 13.8909C2.22255 13.7485 2.28174 13.6141 2.36895 13.4984C2.45616 13.3826 2.569 13.2887 2.69863 13.2239C2.82826 13.1592 2.97114 13.1253 3.11605 13.1251H13.1248V3.45381C13.1247 3.29101 13.167 3.13099 13.2475 2.98949C13.328 2.84799 13.444 2.7299 13.584 2.64683C13.724 2.56377 13.8832 2.5186 14.046 2.51577C14.2088 2.51294 14.3695 2.55254 14.5123 2.63069L14.9192 2.85381L14.9998 2.81256V2.89694L21.7873 6.60006C21.9402 6.68342 22.0669 6.80772 22.1531 6.95904C22.2393 7.11035 22.2817 7.28269 22.2755 7.45673C22.2693 7.63078 22.2147 7.79965 22.1178 7.94441C22.021 8.08917 21.8858 8.2041 21.7273 8.27631L14.9998 11.3344ZM14.9998 9.27569L19.2411 7.34819L14.9998 5.03444V9.27569ZM14.9998 15.0001H4.36105L4.89543 16.8751H25.1061L25.6404 15.0001H14.9998ZM5.43168 18.7501L6.2623 21.6563C6.48636 22.4397 6.95946 23.1287 7.61 23.6193C8.26055 24.1098 9.05317 24.3751 9.86793 24.3751H20.1317C20.9464 24.3751 21.7391 24.1098 22.3896 23.6193C23.0402 23.1287 23.5132 22.4397 23.7373 21.6563L24.5679 18.7501H5.43168Z" fill="white"/>
</svg>

                    </span>
                    <span class="hdtit-lssb">Tracking Kapal</span>
                </Flex>
            </div>
            <div class="pdtop-lssb">
                <Flex>
                    <BiRegularSearchAlt class="icsearch-lssb" />
                    <Select placeholder='Search' class="custom" {...dataSelect} />
                    <BsFilterSquare class="icfil-lssb" />
                </Flex>
            </div>
            <div class="sc-lssbs">
            <For each={dataTracking()}>{(track, i) =>

                <div class="dv1-lssb">
                    <div class="dv2-lssb">
                        <Flex>
                            <div class="dvnama-lssb">{track.nama}</div>
                            <div class="dv3-lssb">
                                <Show
                                    when={track.status == 'Late'}
                                    fallback={
                                        <Button class="btstaty-lssb">
                                            <span>{track.status}</span>
                                        </Button>
                                    }
                                >
                                    <Button class="btstatn-lssb">
                                        <span>{track.status}</span>
                                    </Button>
                                </Show>

                            </div>
                        </Flex>
                    </div>
                    <div class="dv4-lssb">
                        <Flex>
                            <div class="w40-lssb">
                                <img class="imgs-lssb" src={`/public/${track.img}`} />
                            </div>
                            <div class="w60-lssb">
                                <Flex>
                                    <div class="w43-lssb">
                                        <Flex>
                                            <span>
                                                <svg width="14" height="14" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.00003 6.55621V7.74996H16.9213C17.0179 7.75013 17.1131 7.77269 17.1996 7.81587C17.286 7.85905 17.3612 7.92168 17.4194 7.99883C17.4775 8.07599 17.517 8.16557 17.5346 8.26054C17.5523 8.35552 17.5478 8.4533 17.5213 8.54621L16.0275 13.78C15.8037 14.5636 15.3306 15.2531 14.6799 15.7438C14.0292 16.2346 13.2363 16.5001 12.4213 16.5H5.57878C4.76375 16.5001 3.97087 16.2346 3.32018 15.7438C2.66948 15.2531 2.19639 14.5636 1.97253 13.78L0.477533 8.54621C0.451062 8.4533 0.44649 8.35552 0.464175 8.26054C0.481861 8.16557 0.521322 8.07599 0.579461 7.99883C0.637599 7.92168 0.712833 7.85905 0.799252 7.81587C0.885672 7.77269 0.980925 7.75013 1.07753 7.74996H7.75003V1.30246C7.74995 1.19393 7.77814 1.08724 7.83181 0.99291C7.88549 0.898578 7.9628 0.819849 8.05615 0.764473C8.14949 0.709098 8.25565 0.678984 8.36416 0.677096C8.47268 0.675209 8.57982 0.701613 8.67503 0.753709L8.94628 0.902459L9.00003 0.874959V0.931209L13.525 3.39996C13.627 3.45553 13.7114 3.5384 13.7689 3.63928C13.8264 3.74015 13.8546 3.85504 13.8505 3.97107C13.8463 4.0871 13.8099 4.19968 13.7454 4.29619C13.6808 4.3927 13.5907 4.46932 13.485 4.51746L9.00003 6.55621ZM9.00003 5.18371L11.8275 3.89871L9.00003 2.35621V5.18371ZM9.00003 8.99996H1.90753L2.26378 10.25H15.7375L16.0938 8.99996H9.00003ZM2.62128 11.5L3.17503 13.4375C3.32441 13.9597 3.6398 14.4191 4.0735 14.7461C4.5072 15.0731 5.03561 15.25 5.57878 15.25H12.4213C12.9645 15.25 13.4929 15.0731 13.9266 14.7461C14.3603 14.4191 14.6757 13.9597 14.825 13.4375L15.3788 11.5H2.62128Z" fill="#699BF7" />
                                                </svg>
                                            </span>
                                            <span style="margin-left: 5px;    text-align: left;">{track.from}</span>
                                        </Flex>
                                    </div>
                                    <div class="w14-lssb">
                                        <span >
                                            <svg width="25" height="10" viewBox="0 0 20 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M0 4H19M19 4L15.5 1M19 4L15.5 6.5" stroke="#FFC746" />
                                            </svg>

                                        </span>
                                    </div>
                                    <div class="w43s-lssb">
                                        <Flex> 
                                            <span style="padding-top: 3px;">
                                                <svg width="14" height="14" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g clip-path="url(#clip0_604_206)">
                                                        <path d="M4.00021 0C3.92595 0 3.85474 0.0294999 3.80223 0.0820101C3.74971 0.13452 3.72021 0.205739 3.72021 0.28V6.68C3.72021 6.75426 3.74971 6.82548 3.80223 6.87799C3.85474 6.9305 3.92595 6.96 4.00021 6.96C4.07448 6.96 4.14569 6.9305 4.1982 6.87799C4.25071 6.82548 4.28021 6.75426 4.28021 6.68V3.76H7.72021C7.79448 3.76 7.86569 3.7305 7.9182 3.67799C7.97072 3.62548 8.00021 3.55426 8.00021 3.48V0.28C8.00021 0.205739 7.97072 0.13452 7.9182 0.0820101C7.86569 0.0294999 7.79448 0 7.72021 0H4.04021C4.03343 2.05319e-05 4.02666 0.000287375 4.01989 0.0008C4.01335 0.000302617 4.00678 3.57852e-05 4.00021 0ZM5.10421 0.56H5.88821V1.1544H6.67221V0.56H7.44021V1.1544H6.67221V1.93832H7.44021V2.72232H6.67221V3.2H5.88821V2.7224H5.10421V3.2H4.32021V2.7224H5.10421V1.93832H4.32021V1.15432H5.10421V0.56ZM5.10421 1.1544V1.93832H5.88821V1.15432L5.10421 1.1544ZM5.88821 1.93832V2.7224L6.67221 2.72232V1.93832H5.88821Z" fill="#699BF7" />
                                                        <path d="M3.04042 6.14331C2.1929 6.26315 1.6001 6.54971 1.6001 6.97139C1.6001 7.53939 2.59058 7.99995 4.0001 7.99995C5.40962 7.99995 6.4001 7.53947 6.4001 6.97139C6.4001 6.54963 5.8073 6.26315 4.95986 6.14339L4.84242 6.34331C5.48122 6.43187 5.9201 6.61819 5.9201 6.83427C5.9201 7.13723 5.0605 7.38283 4.0001 7.38283C2.9397 7.38283 2.0801 7.13723 2.0801 6.83427C2.08002 6.61891 2.5161 6.43283 3.15682 6.34387C3.1181 6.27699 3.07922 6.21027 3.04042 6.14331Z" fill="#699BF7" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_604_206">
                                                            <rect width="8" height="8" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            </span>
                                            <span style="margin-left: 5px;">{track.to}</span>
                                        </Flex>
                                    </div>
                                </Flex>
                                <div class="ta-lssb">{track.tgl}</div>
                                <div class="ta-lssb">{track.jarak}</div>
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

export default HistorySimulasiSideBar;