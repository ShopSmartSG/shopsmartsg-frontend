
'use client';
import React from 'react';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { MenuItem } from 'primereact/menuitem';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar'; 
import './navbar.css'; 
import Link from 'next/link';

export default function Navbar() {
    const itemRenderer = (item) => (
        <Link className="flex align-items-center p-menuitem-link" href={item.url}>
            <span className={item.icon} />
            <span className="mx-2">{item.label}</span>
            {item.badge && <Badge className="ml-auto" value={item.badge} />}
            {item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>}
        </Link>
    );
    const items: MenuItem[] = [
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            url: '/customer/dashboard',
            template:itemRenderer
        },
        {
            label: 'Merchant',
            icon: 'pi pi-users',
            url: '/merchant',
            template:itemRenderer
        },
        
    ];

    const start = (
      <Link href="/" className="navbar-title">
        ShopSmart
      </Link>
    );
    const end = (
        <div className="flex align-items-center gap-2">
            <InputText placeholder="Search" type="text" className="w-8rem sm:w-auto" />
            <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" />
        </div>
    );

    return (
        <div className="card">
            <Menubar model={items} start={start} end={end} />
        </div>
    )
}
        