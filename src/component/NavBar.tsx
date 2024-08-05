import { Component, createEffect, createSignal } from "solid-js";
import './NavBar.css'
import { Grid, GridItem } from "@hope-ui/solid"
import { Button } from "@hope-ui/solid"
import { AiFillDashboard, AiOutlineSetting, } from 'solid-icons/ai'
import { BsPersonFill } from 'solid-icons/bs'
import { Flex, Spacer } from "@hope-ui/solid"
import { FaSolidShip } from 'solid-icons/fa'
import { RiSystemHistoryLine } from 'solid-icons/ri'
import { AiOutlinePlayCircle } from 'solid-icons/ai'
import { useLocation, useNavigate } from "@solidjs/router";
import { TiLocationArrowOutline } from 'solid-icons/ti'

type NavBarProps = {};

 
const NavBar: Component<NavBarProps> = (props) => {

    const navigate = useNavigate();
    const location = useLocation();
    const [buttonChange, setButtonChange] = createSignal('asset');
    const setMenu = (param : string) => {
        console.log('param -> ', param);
        setButtonChange(param)
        navigate(`/${param}`);
    } 
    createEffect(() => {
        console.log("location -> ", location.pathname.split('/')[1])
        setButtonChange(location.pathname.split('/')[1])
    })

    return (
        <> 
            <div class="nb1">

                <Grid templateColumns="repeat(8, 1fr)" gap="$4" >
                    <GridItem colSpan={2} h="$12" bg="white" class="bc">
                         <Flex color="white" class="mt8">
                            <span><AiFillDashboard class="ictop" /></span>
                            <span class="ttop">Simulator Operasi Laut</span>
                        </Flex>
                    </GridItem>
                    <GridItem colStart={3} colEnd={7} h="$12" bg="white" class="pt" >
                        <Flex color="white" class="tcent" > 
                           
                            <Button  onClick={() => setMenu('asset')}  class={buttonChange() === 'asset' ? 'btcen' : 'btcennone'}  leftIcon={<FaSolidShip boxSize={18} class="iccen" />}>
                                <span class="fnt" >Asset</span>
                            </Button>
                            <Button  onClick={() => setMenu('gis')}  class={buttonChange() === 'gis' ? 'btcen' : 'btcennone'}  leftIcon={ <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_949_267)">
<path d="M18.1336 14.9311L19.5686 15.6468L9.9998 20.063L0.331055 15.6005L1.8873 14.9405L3.42043 15.648L3.41855 15.6493L9.9998 18.6868L16.6811 15.603L16.6792 15.6024L18.1336 14.9311ZM15.0261 10.2549L19.5686 12.5218L9.9998 16.938L0.331055 12.4755L5.12355 10.443C5.36814 10.7468 5.64731 11.0809 5.96105 11.4455L3.41855 12.5243L9.9998 15.5618L16.6811 12.478L14.2098 11.2449C14.5181 10.8824 14.7902 10.5524 15.0261 10.2549Z" fill="#F8F8F8"/>
<path d="M11.25 5.625C11.25 5.29348 11.1183 4.97554 10.8839 4.74112C10.6495 4.5067 10.3315 4.375 10 4.375C9.66848 4.375 9.35054 4.5067 9.11612 4.74112C8.8817 4.97554 8.75 5.29348 8.75 5.625C8.75 5.95652 8.8817 6.27446 9.11612 6.50888C9.35054 6.7433 9.66848 6.875 10 6.875C10.3315 6.875 10.6495 6.7433 10.8839 6.50888C11.1183 6.27446 11.25 5.95652 11.25 5.625ZM12.5 5.625C12.5 6.28804 12.2366 6.92393 11.7678 7.39277C11.2989 7.86161 10.663 8.125 10 8.125C9.33696 8.125 8.70108 7.86161 8.23224 7.39277C7.76339 6.92393 7.5 6.28804 7.5 5.625C7.5 4.96196 7.76339 4.32607 8.23224 3.85723C8.70108 3.38839 9.33696 3.125 10 3.125C10.663 3.125 11.2989 3.38839 11.7678 3.85723C12.2366 4.32607 12.5 4.96196 12.5 5.625ZM10.4575 13.5506L10 14.0425L9.5425 13.5506C7.31938 11.1606 5.90688 9.51188 5.28625 8.57562C4.69081 7.67783 4.3738 6.62418 4.375 5.54688C4.375 2.48125 6.89563 0 10 0C13.1044 0 15.625 2.48125 15.625 5.54688C15.626 6.62424 15.3088 7.6779 14.7131 8.57562C14.0931 9.51188 12.6806 11.1606 10.4575 13.5506ZM13.6713 7.88562C14.1313 7.19248 14.3761 6.37879 14.375 5.54688C14.375 3.17563 12.4188 1.25 10 1.25C7.58125 1.25 5.625 3.17563 5.625 5.54688C5.625 6.39 5.87125 7.19438 6.32875 7.88562C6.8575 8.68375 8.08625 10.1312 10 12.2056C11.9138 10.1306 13.1425 8.68375 13.6713 7.88562Z" fill="#F8F8F8"/>
</g>
<defs>
<clipPath id="clip0_949_267">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs>
</svg>
}>
                                <span class="fnt" >GIS</span>
                            </Button>
                             <Button  onClick={() => setMenu('log-simulasi')}  class={buttonChange() === 'log-simulasi' ? 'btcen' : 'btcennone'}  leftIcon={<TiLocationArrowOutline boxSize={18} class="iccen" />}>
                                <span class="fnt" >Log Simulasi</span>
                            </Button>
                            <Button  onClick={() => setMenu('history-simulasi')} class={buttonChange()  === 'history-simulasi' ? "btcen" : "btcennone"}  leftIcon={<RiSystemHistoryLine boxSize={18} class="iccen" />}>
                                <span class="fnt">History Simulasi</span>
                            </Button>
                            <Button onClick={() => setMenu('rekam-momen')} class={buttonChange() === 'rekam-momen'  ? "btcen" : "btcennone"}  leftIcon={<AiOutlinePlayCircle boxSize={18} class="iccen" />}>
                                <span class="fnt">Rekam Momen</span>
                            </Button>
                        </Flex>
                    </GridItem>
                    <GridItem colSpan={2} h="$12" bg="white" class="bc">
                        <Flex color="white" class="mend">
                            <span class="send"><AiOutlineSetting class="icend" /></span>
                            <span class="send"><BsPersonFill class="icend" /></span>
                        </Flex>
                    </GridItem>
                </Grid>

                

            </div>
        </>
    );
}

export default NavBar;