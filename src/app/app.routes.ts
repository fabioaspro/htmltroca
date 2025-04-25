import { Routes } from '@angular/router';


export const routes: Routes = [

    {path: '', redirectTo: '/list', pathMatch: 'full'},
    {path:'list', loadComponent:()=> import('../app/list/list.component').then(c=>c.ListComponent)},
    {path:'monitor', loadComponent:()=> import('../app/monitor-processos/monitor-processos.component').then(c=>c.MonitorProcessosComponent)},
    {path:'relmovto', loadComponent:()=> import('../app/relmovto/relmovto.component').then(c=>c.RelmovtoComponent)},
    {path:'dashboard', loadComponent:()=>import('../app/dashboard/dashboard.component').then(c=>c.DashboardComponent)}

];

