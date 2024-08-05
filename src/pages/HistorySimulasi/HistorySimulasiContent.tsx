import { Component, Show } from "solid-js";
import { createSignal } from "solid-js";
import './HistorySimulasiContent.css'
import { Flex, Spacer } from "@hope-ui/solid"
import MapView from "../MapView";
import { Button } from "@hope-ui/solid"
import MapSet from "../../component/MapSet";

type Step = {
  label: string;
  completed: boolean;
};

type HistorySimulasiContentProps = {};

const HistorySimulasiContent: Component<HistorySimulasiContentProps> = (props) => {
  const [steps, setSteps] = createSignal<Step[]>([
    { label: "Step 1", completed: true },
    { label: "Step 2", completed: false },
    { label: "Step 3", completed: false },
  ]);
  const [stepper, setStepper] = createSignal([
    {
      "tanggal": "06 Juni 2023",
      "waktu": "08.00",
      "tempat": "Kepulauan Bangka Belitung - 0 KM",
      "status": "finish"
    },
    {
      "tanggal": "06 Juni 2023",
      "waktu": "22.00",
      "tempat": "Laut Jawa - 1991 KM",
      "status": "finish"
    },
    {
      "tanggal": "08 Juni 2023",
      "waktu": "08.40",
      "tempat": "Kalimantan Selatan - 2091 KM",
      "status": "no"
    }
  ])


  const completeStep = (index: number) => {
    setSteps((steps) =>
      steps.map((step, i) =>
        i === index ? { ...step, completed: true } : step
      )
    );
  };

  return (
    <>


      <div class="fl">
        <div style="height: 100px;
    align-items: center;
    display: grid;
    border-bottom: 1px solid #9b76ab;">
          <Flex>
            <div style="width:32%;justify-content: left;
    align-items: center;
    display: flex;
    font-family: 'jaldiBold';">
              <span style="margin-left: 30px;">Ly Thai To</span>
            </div>
            <div style="width:46%;font-family: 'jaldiReg'; font-size: 0.8em;color: lightgrey;">

              <div>
                <Flex>
                  <div style="width:33%" class="dctl">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.50015 5.66722V6.56253H13.4411C13.5135 6.56266 13.585 6.57958 13.6498 6.61196C13.7146 6.64435 13.771 6.69132 13.8146 6.74918C13.8582 6.80705 13.8878 6.87424 13.9011 6.94547C13.9144 7.0167 13.9109 7.09004 13.8911 7.15972L12.7708 11.085C12.6029 11.6728 12.2481 12.1899 11.76 12.5579C11.272 12.926 10.6774 13.1251 10.0661 13.125H4.93421C4.32294 13.1251 3.72828 12.926 3.24026 12.5579C2.75223 12.1899 2.39742 11.6728 2.22952 11.085L1.10827 7.15972C1.08842 7.09004 1.08499 7.0167 1.09825 6.94547C1.11152 6.87424 1.14111 6.80705 1.18472 6.74918C1.22832 6.69132 1.28475 6.64435 1.34956 6.61196C1.41438 6.57958 1.48582 6.56266 1.55827 6.56253H6.56265V1.72691C6.56259 1.64551 6.58372 1.56549 6.62398 1.49474C6.66424 1.42399 6.72222 1.36495 6.79223 1.32342C6.86224 1.28188 6.94186 1.2593 7.02324 1.25788C7.10463 1.25647 7.18499 1.27627 7.2564 1.31534L7.45983 1.42691L7.50015 1.40628V1.44847L10.8939 3.30003C10.9704 3.34171 11.0337 3.40386 11.0768 3.47952C11.1199 3.55517 11.1411 3.64134 11.138 3.72837C11.1349 3.81539 11.1076 3.89982 11.0592 3.9722C11.0108 4.04458 10.9431 4.10205 10.8639 4.13816L7.50015 5.66722ZM7.50015 4.63784L9.62077 3.67409L7.50015 2.51722V4.63784ZM7.50015 7.50003H2.18077L2.44796 8.43753H12.5533L12.8205 7.50003H7.50015ZM2.71608 9.37503L3.1314 10.8282C3.24343 11.2198 3.47997 11.5644 3.80525 11.8096C4.13052 12.0549 4.52683 12.1876 4.93421 12.1875H10.0661C10.4735 12.1876 10.8698 12.0549 11.195 11.8096C11.5203 11.5644 11.7569 11.2198 11.8689 10.8282L12.2842 9.37503H2.71608Z" fill="white" />
                    </svg>

                  </div>
                  <div style="width:34%" class="dct">
                    <span>Durasi : </span> <span>48H 40M 00S</span>
                  </div>
                  <div style="width:33%" class="dctr">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0_606_53)">
                        <path d="M7.5001 0C7.36086 0 7.22732 0.0553123 7.12887 0.153769C7.03041 0.252226 6.9751 0.385761 6.9751 0.525V12.525C6.9751 12.6642 7.03041 12.7978 7.12887 12.8962C7.22732 12.9947 7.36086 13.05 7.5001 13.05C7.63934 13.05 7.77287 12.9947 7.87133 12.8962C7.96979 12.7978 8.0251 12.6642 8.0251 12.525V7.05H14.4751C14.6143 7.05 14.7479 6.99469 14.8463 6.89623C14.9448 6.79777 15.0001 6.66424 15.0001 6.525V0.525C15.0001 0.385761 14.9448 0.252226 14.8463 0.153769C14.7479 0.0553123 14.6143 0 14.4751 0H7.5751C7.56238 3.84973e-05 7.54968 0.000538827 7.537 0.0015C7.52472 0.000567407 7.51241 6.70973e-05 7.5001 0ZM9.5701 1.05H11.0401V2.1645H12.5101V1.05H13.9501V2.1645H12.5101V3.63435H13.9501V5.10435H12.5101V6H11.0401V5.1045H9.5701V6H8.1001V5.1045H9.5701V3.63435H8.1001V2.16435H9.5701V1.05ZM9.5701 2.1645V3.63435H11.0401V2.16435L9.5701 2.1645ZM11.0401 3.63435V5.1045L12.5101 5.10435V3.63435H11.0401Z" fill="white" />
                        <path d="M5.7006 11.5188C4.1115 11.7435 3 12.2808 3 13.0714C3 14.1364 4.85715 15 7.5 15C10.1429 15 12 14.1366 12 13.0714C12 12.2806 10.8885 11.7435 9.29955 11.5189L9.07935 11.8938C10.2771 12.0598 11.1 12.4092 11.1 12.8143C11.1 13.3824 9.48825 13.8429 7.5 13.8429C5.51175 13.8429 3.9 13.3824 3.9 12.8143C3.89985 12.4105 4.7175 12.0616 5.91885 11.8948C5.84625 11.7694 5.77335 11.6443 5.7006 11.5188Z" fill="white" />
                      </g>
                      <defs>
                        <clipPath id="clip0_606_53">
                          <rect width="15" height="15" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>

                  </div>
                </Flex>
              </div>

              <div style="    background: #d1d1d1;
    height: 10px;
    border-radius: 10px;">
                <div style="    background: #85319c;
    height: 10px;
    border-radius: 10px;
    width: 65%;">

                </div>
              </div>

              <div>
                <Flex>
                  <div style="width:33%" class="dct">
                    <span>Kepulauan Bangka Belitung</span>
                  </div>
                  <div style="width:34%" class="dct">
                  <span>Jarak : </span> <span>2091 KM</span>
                  </div>
                  <div style="width:33%" class="dct">
                  <span>Kalimantan Selatan</span>
                  </div>
                </Flex>
              </div>


            </div>
            <div style="width:32%;justify-content: end;
    align-items: end;
    display: flex;
    font-family: 'jaldiBold';">
              <Button class="btstaty-lsct" style="    margin-right: 20px;">
                <span>On Track</span>
              </Button>
            </div>
          </Flex>
        </div>



        <div>
          <Flex >
            <div style="width:35%" >


              <div style="box-shadow: 0px 4px 4px 0px #00000040;
    text-align: center; 
    display: grid;padding-bottom: 20px;
    align-items: center;
    margin: 10px;" class="flc">

                <div style="margin: 2vh;
    font-size: 1em;
    font-family: 'jaldiBold';
    text-align: left;
    margin-bottom: 5vh;
">Tracking Kapal Ly Thai To</div>

                <div style="    font-family: 'jaldiReg';
    color: #bbbbbb;
    font-size: 0.9em;
">
                  {stepper().map((step, index) => (
                    <>
                      <div>
                        <Show
                          when={step.status !== 'no'}
                          fallback={
                            <>

                              <Flex >
                                <div style="    font-size: 1em; width:40%;
    font-family: 'jaldiReg'; 
">{step.tanggal}</div>
                                <div style="width:10%;">
                                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="15" cy="15" r="15" fill="#928F8F" fill-opacity="0.3" />
                                    <circle cx="14.5" cy="14.5" r="7.5" fill="#928F8F" />
                                  </svg>
                                </div>
                                <div style="font-size: 1em; width:50%;
    font-family: 'jaldiReg';
    margin-left: 10px;    text-align: left;">
                                  <div style="      margin-top: -7px;
    margin-bottom: -5px;">{step.waktu}</div>
                                  <div>{step.tempat}</div>

                                </div>
                              </Flex>
                            </>
                          }
                        >

                          <Flex >
                            <div style="    font-size: 1em; width:40%;
    font-family: 'jaldiReg'; 
">{step.tanggal}</div>
                            <div style=" width:10%;">
                              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="15" cy="15" r="15" fill="#699BF7" fill-opacity="0.4" />
                                <circle cx="14.5" cy="14.5" r="7.5" fill="#699BF7" />
                              </svg>
                            </div>
                            <div style="font-size: 1em; width:50%;
    font-family: 'jaldiReg';
    margin-left: 10px;     text-align: left;
">
                              <div style="      margin-top: -7px;
    margin-bottom: -5px;">{step.waktu}</div>
                              <div>{step.tempat}</div>

                            </div>
                          </Flex>

                          <Flex>
                            <div style="width:40%"></div>
                          <div style="      height: 150px;
    border-left: 1px dashed #a5a5a5; 
    padding-top: 95px;width:10%;
        justify-content: center;
    display: inline-grid;
    margin-top: -30px;    margin-left: 1vw;

">
                            <svg style="    margin-left: -17px;" width="50" height="50" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14.9998 11.3344V13.1251H26.8817C27.0266 13.1253 27.1695 13.1592 27.2991 13.2239C27.4287 13.2887 27.5416 13.3826 27.6288 13.4984C27.716 13.6141 27.7752 13.7485 27.8017 13.8909C27.8282 14.0334 27.8214 14.1801 27.7817 14.3194L25.5411 22.1701C25.2053 23.3456 24.4956 24.3797 23.5196 25.1159C22.5435 25.8521 21.3542 26.2502 20.1317 26.2501H9.86793C8.64538 26.2502 7.45607 25.8521 6.48002 25.1159C5.50398 24.3797 4.79435 23.3456 4.45855 22.1701L2.21605 14.3194C2.17635 14.1801 2.16949 14.0334 2.19602 13.8909C2.22255 13.7485 2.28174 13.6141 2.36895 13.4984C2.45616 13.3826 2.569 13.2887 2.69863 13.2239C2.82826 13.1592 2.97114 13.1253 3.11605 13.1251H13.1248V3.45381C13.1247 3.29101 13.167 3.13099 13.2475 2.98949C13.328 2.84799 13.444 2.7299 13.584 2.64683C13.724 2.56377 13.8832 2.5186 14.046 2.51577C14.2088 2.51294 14.3695 2.55254 14.5123 2.63069L14.9192 2.85381L14.9998 2.81256V2.89694L21.7873 6.60006C21.9402 6.68342 22.0669 6.80772 22.1531 6.95904C22.2393 7.11035 22.2817 7.28269 22.2755 7.45673C22.2693 7.63078 22.2147 7.79965 22.1178 7.94441C22.021 8.08917 21.8858 8.2041 21.7273 8.27631L14.9998 11.3344ZM14.9998 9.27569L19.2411 7.34819L14.9998 5.03444V9.27569ZM14.9998 15.0001H4.36105L4.89543 16.8751H25.1061L25.6404 15.0001H14.9998ZM5.43168 18.7501L6.2623 21.6563C6.48636 22.4397 6.95946 23.1287 7.61 23.6193C8.26055 24.1098 9.05317 24.3751 9.86793 24.3751H20.1317C20.9464 24.3751 21.7391 24.1098 22.3896 23.6193C23.0402 23.1287 23.5132 22.4397 23.7373 21.6563L24.5679 18.7501H5.43168Z" fill="#699BF7" />
                            </svg>
                          </div>
                          <div style="width:50%"></div>
                          </Flex>
                        </Show>
                      </div>
                    </>
                  ))}
                </div>

              </div>

              <div style="box-shadow: 0px 4px 4px 0px #00000040;
    text-align: center; 
    display: grid;padding-bottom: 20px;
    align-items: center;
    margin: 10px;" class="flc">

      <div style="text-align: left;
    font-size: 1.1em;
    font-family: 'jaldiBold';
    margin: 2vh;">Informasi Umum Kapal</div>
      <div>
        <Flex>
          <div style="width:30%;    text-align: center;
    margin-left: 1.1vw;">
          <img src={`/public/pp.png`} />
          </div>
          <div style="width:70%;text-align: left;
    font-family: 'jaldiReg';
    margin-top: 1vh;">
            <div><span>Kapten: Alex Turner</span></div>
            <div><span>628122278895647</span></div>
          </div>
        </Flex>
      </div>
      <div style="    margin: 2vh;
    margin-top: 0vh;
    margin-bottom: -1vh;">
        <Flex style="margin: 1vh;
    font-family: jaldiReg;
    margin-top: 10px;
    text-align: left;
    font-size: 0.8em;">
          <div style="width:50%">
          <span style=" font-family: jaldiBold;">Model : </span>
          <span>Ly Thai To</span>
          </div>
          <div style="width:50%">
          <span style=" font-family: jaldiBold;">Dimensi : </span>
          <span>102 x 13 x 5.3 m</span>
          </div>
        </Flex>
        <Flex style="margin: 1vh;
    font-family: jaldiReg;
    margin-top: 10px;
    text-align: left;
    font-size: 0.8em;">
          <div style="width:50%">
          <span style=" font-family: jaldiBold;">Kecepatan : </span>
          <span>26 Knot</span>
          </div>
          <div style="width:50%">
          <span  style=" font-family: jaldiBold;">Jarak : </span>
          <span>5000 n miles</span>
          </div>
        </Flex>
        <div style="margin: 1vh;
    font-family: jaldiReg;
    margin-top: 10px;
    text-align: left;
    font-size: 0.8em;">
        <span style=" font-family: jaldiBold;">Unit : </span>
        <span>SSM, SAM, AK-176, AK-630, AO-18KD, ESM/ECM, Radar Air Surface, Sonars</span>
        </div>
      </div>


      </div>

            </div>

            <div style="width:65%;margin-top: 1.7vh;
    margin-right: 1.7vh;" >
              {/* <MapView /> */}
              <MapSet />
            </div>
          </Flex>
        </div>


      </div>




      {/* <div class="stepper-container">
        {steps().map((step, index) => (
          <div class="step-container" >
            <div class="step-icon" onClick={() => completeStep(index)}>
              {step.completed ? "✓" : index + 1}
            </div>
            <div class={`step-line ${step.completed ? "completed" : ""}`} />
          </div>
        ))}
      </div> */}
    </>
  );
};
export default HistorySimulasiContent;