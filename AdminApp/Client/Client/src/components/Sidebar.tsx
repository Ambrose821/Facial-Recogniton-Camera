import { useEffect, useState, type ReactNode } from 'react';
import { Menu } from 'lucide-react';

import '../styles/components/sidebar.css';
import { Link } from 'react-router-dom';

export default function SideBar({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    console.log(isOpen);
  }, [isOpen]);

  return (
    <>
      <div className={isOpen ? 'sidebar-container sidebar-open' : 'sidebar-container'}>
        <div className="sidebar-menu">
          <div className="menu-header">
            <div className="brand-name">Concordia Smart-Cam</div>
          </div>
          <div className="menu-options">
            <Link to="/register">
              <div className="menu-option">Registere Face</div>
            </Link>
            <Link to="/logs">
              <div className="menu-option">View Logs</div>
            </Link>
            <Link to="/faceid">
              <div className="menu-option">Test Face Id</div>
            </Link>
          </div>
        </div>

        <div className="content">
          <button
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            className="side-bar-button">
            <Menu />
          </button>
          {children}
        </div>
      </div>
    </>
  );
}
