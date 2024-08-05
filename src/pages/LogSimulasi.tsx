import { Component, onMount } from "solid-js";
import { Grid, GridItem } from "@hope-ui/solid";
import './LogSimulasi.css';
import LogSimulasiSideBar from "./LogSimulasi/LogSimulasiSideBar";
import { Button } from "@hope-ui/solid"
import LogSimulasiNavBar from "./LogSimulasi/LogSimulasiNavBar";
import LogSimulasiContent from "./LogSimulasi/LogSimulasiContent";
import { useNavigate } from "@solidjs/router";
import MapGeo from "../component/MapGeo";


type LogSimulasiProps = {};

const LogSimulasi: Component<LogSimulasiProps> = (props) =>  {

  const navigate = useNavigate();
  onMount(() => {
    //  navigate(`/ops-al/log-simulasi`);
  })
  return (
    <>
    <div class="ls1"> 
    <LogSimulasiContent />
    </div>

    <div style="padding: 15px;margin: 1vw;
    border: 1px solid #c295d0c2;
    background: #251c3d;
    border-radius: 20px;"><MapGeo /></div>
    </>
  );
}

export default LogSimulasi;