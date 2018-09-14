
import Dashboard from './views/Dashboard';
import ResourceList from './views/ResourceList';
import ResourceItem from './views/ResourceItem';
//TODO:change requiresAuth to true
export default  [{
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta:
    { 
        requiresAuth:false
    }
  },
  {
    path: '/list/:resource',
    name: 'list',
    component: ResourceList,
    meta:
    { 
        requiresAuth:false
    }
  },
  {
    path: '/item/:resource/:id',
    name: 'item',
    component: ResourceItem,
    meta:
    { 
        requiresAuth:false
    }
  }
];