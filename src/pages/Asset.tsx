import { Component, onMount } from "solid-js";
import { Grid, GridItem } from "@hope-ui/solid";
import './Asset.css';
import AssetSideBar from "./Asset/AssetSideBar";
import { Button } from "@hope-ui/solid"
import AssetNavBar from "./Asset/AssetNavBar"; 
import { useNavigate } from "@solidjs/router";
import MapGeo from "../component/MapGeo";
import AssetContent from "./Asset/AssetContent";


type AssetProps = {};

const Asset: Component<AssetProps> = (props) =>  {

  const navigate = useNavigate();
  onMount(() => {
    //  navigate(`/ops-al/log-simulasi`);
  })
  return (
    <>
    <div class="ls1"> 
    <AssetContent />
    </div> 
    </>
  );
}

export default Asset;