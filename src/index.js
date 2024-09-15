import { lazy } from 'react';
import Layout from './components/layout/Layout';

// Auth Components
export const Auth = lazy(() => import('./components/auth/Auth'));
export const Login = lazy(() => import('./components/auth/Login'));
export const Register = lazy(() => import('./components/auth/Register'));

// Public Components
import Header from './components/common/Header'
import Public from './components/utils/public-comp/Public';
import { GlobalLoader, Spinner } from './components/common/Loader';

// Core Components
// Admin
export const CreateUser = lazy(() => import('./components/core/admin/CreateUser'));
export const ViewUsers = lazy(() => loadCompSlow(import('./components/core/admin/ViewUsers')));

// User
export const AddPost = lazy(() => import('./components/core/user/AddPost/AddPost'));
export const ViewPost = lazy(() => import('./components/core/user/ViewPost/ViewPost'));


export { Header, Public, GlobalLoader, Layout, Spinner }


// Load a component slow
const loadCompSlow = (url) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(url);
        }, 4000)
    })
}


