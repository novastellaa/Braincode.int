import { Component, onMount } from "solid-js";
import { Grid, GridItem } from "@hope-ui/solid";
import './Gis.css';
import GisSideBar from "./Gis/GisSideBar";
import { Button } from "@hope-ui/solid"
import GisNavBar from "./Gis/GisNavBar"; 
import { useNavigate } from "@solidjs/router";
import MapGeo from "../component/MapGeo"; 
import GisContent from "./Gis/GisContent";
import MapSet from "../component/MapSet";


type GisProps = {};

const Gis: Component<GisProps> = (props) =>  {

  const navigate = useNavigate();
  onMount(() => {
    //  navigate(`/ops-al/log-simulasi`);
  })
  return (
    <>
    <div class="ls1"> 
    <GisContent />
    </div> 
    {/* <div><MapSet /></div> */}
    </>
  );
}

export default Gis;