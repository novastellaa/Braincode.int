import { Component } from "solid-js";
import { Grid, GridItem } from "@hope-ui/solid";
import './RekamMomen.css';
import RekamMomenSideBar from "./RekamMomen/RekamMomenSideBar";
import { Button } from "@hope-ui/solid"
import RekamMomenNavBar from "./RekamMomen/RekamMomenNavBar";
import RekamMomenContent from "./RekamMomen/RekamMomenContent";


type RekamMomenProps = {};

const RekamMomen: Component<RekamMomenProps> = (props) =>  {
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
    <RekamMomenSideBar />
     </GridItem>
  <GridItem colSpan={6} h="100px" bg="white" style="background:none">
    <RekamMomenNavBar />
     </GridItem>
  <GridItem colSpan={6} h="124vh" bg="white" style="background:none">
    <RekamMomenContent />
     </GridItem>
</Grid>
    </div>
    </>
  );
}

export default RekamMomen;