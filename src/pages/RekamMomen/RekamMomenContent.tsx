import { Component, Show } from "solid-js";
import { createSignal } from "solid-js";
import './RekamMomenContent.css'
import { Flex, Spacer } from "@hope-ui/solid"
import MapView from "../MapView";
import { Button } from "@hope-ui/solid"
import MapSet from "../../component/MapSet";

type Step = {
  label: string;
  completed: boolean;
};

type RekamMomenContentProps = {};

const RekamMomenContent: Component<RekamMomenContentProps> = (props) => {
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
            <div style="width:100%;justify-content: left;
    align-items: center;
    display: flex;
    font-family: 'jaldiBold';">
              <span style="margin-left: 30px;">Live Report Ly Thai To - 06 June 2024 - Kep. Bangka Belitung</span>
            </div> 
          </Flex>
        </div>



        <div>
          <Flex >
           

            <div style="width:100%;    margin: 25px;" > 
              {/* <MapSet /> */}
              <video style="    width: 100%;
    height:720px;"  controls
    autoplay
    muted>
 <source src="/video/rekaman.mp4" type="video/mp4" />
</video>
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
export default RekamMomenContent;