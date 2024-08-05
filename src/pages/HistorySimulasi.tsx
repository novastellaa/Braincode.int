import { Component } from "solid-js";
import { Grid, GridItem } from "@hope-ui/solid";
import './HistorySimulasi.css';
import HistorySimulasiSideBar from "./HistorySimulasi/HistorySimulasiSideBar";
import { Button } from "@hope-ui/solid"
import HistorySimulasiNavBar from "./HistorySimulasi/HistorySimulasiNavBar";
import HistorySimulasiContent from "./HistorySimulasi/HistorySimulasiContent";


type HistorySimulasiProps = {};

const HistorySimulasi: Component<HistorySimulasiProps> = (props) =>  {
  return (
    <>
    <div class="ls1">
    <Grid 
  h="136vh" 
  templateRows="repeat(2, 1fr)" 
  templateColumns="repeat(8, 1fr)" 
  gap="$4"
>
  <GridItem rowSpan={2} colSpan={2} bg="white" style="background:none" >
    <HistorySimulasiSideBar />
     </GridItem>
  <GridItem colSpan={6} h="100px" bg="white" style="background:none">
    <HistorySimulasiNavBar />
     </GridItem>
  <GridItem colSpan={6} h="124vh" bg="white" style="background:none">
    <HistorySimulasiContent />
     </GridItem>
</Grid>
    </div>
    </>
  );
}

export default HistorySimulasi;