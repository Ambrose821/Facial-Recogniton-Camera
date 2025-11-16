

import { Outlet } from "react-router-dom"
import SideBar from "../components/Sidebar"
function DefaultLayout(){
    return( 
    
        <SideBar>
            <Outlet/>
        </SideBar>
       
    )
}
export default DefaultLayout