import { Routes } from '@angular/router';
import { HomeComponent } from "./pages/home/home.component";
import { TaskComponent } from "@pages/task/task.component";

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: 'task',
        loadComponent: () => import('@pages/task/task.component').then(m => m.TaskComponent),
    },
];
