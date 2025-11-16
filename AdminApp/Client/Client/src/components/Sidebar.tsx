import { useEffect, useState, type ReactNode } from "react";
import { Menu } from 'lucide-react';

import '../styles/components/sidebar.css'

export default function SideBar({children}: {children: ReactNode}){

    const [isOpen,setIsOpen] = useState<boolean>(false);

    useEffect(()=>{
        console.log(isOpen)
    },[isOpen])

    return(
        <>
            <div className={ isOpen ? "sidebar-container sidebar-open" :"sidebar-container"}>
                <div className="sidebar-menu">  
                    Hello world 
                </div>
                <div className="content">
                <button onClick={()=>{setIsOpen(!isOpen)}} className="side-bar-button">
                    <Menu/>
                </button>
                    {children}
                </div>
            </div>
        </>)
}


