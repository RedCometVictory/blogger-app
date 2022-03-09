import combineReducers from '../context/Reducers/index';
import { StoreProvider } from '../context/Store';
import { ThemeProvider } from "use-theme-switcher";
import { alertInitialState, AlertReducer } from '../context/Reducers/AlertReducer';
import { authInitialState, AuthReducer } from '../context/Reducers/AuthReducer';
import { postInitialState, PostReducer } from '../context/Reducers/PostReducer';
import { profileInitialState, ProfileReducer } from '../context/Reducers/ProfileReducer';
import MainLayout from 'components/MainLayout';
// import AsideNav from 'components/UI/Aside';
// import NavBar from 'components/NavBar';
// import SearchBar from "components/UI/SearchBar";
// import { CookiesProvider } from "react-cookie"; // may not use
// import '../styles/globals.css';
// import '../styles/main.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/main.scss';

const combinedInitialState = {
  alert: alertInitialState,
  auth: authInitialState,
  post: postInitialState,
  profile: profileInitialState
};
// console.log("combinedInitialState")
// console.log(combinedInitialState)

const rootReducer = combineReducers({
  alert: AlertReducer,
  auth: AuthReducer,
  post: PostReducer,
  profile: ProfileReducer
});
// console.log("rootReducer")
// console.log(rootReducer)

// console.log("++++++ reducer ++++++")
// console.log(AlertReducer)
// console.log("++++++ reducer ++++++")
// console.log(AuthReducer)
// console.log("++++++ reducer ++++++")
// console.log(PostReducer)
// console.log("++++++ reducer ++++++")
// console.log(ProfileReducer)
// console.log("++++++ reducer ++++++")
//   <StoreProvider initialState={combinedInitialState} reducer={rootReducer}>

// return (
//   <StoreProvider reducer={rootReducer} initialState={combinedInitialState}>
//     <CookiesProvider>
//       <Component {...pageProps} />
//     </CookiesProvider>
//   </StoreProvider>
// )
const MyApp = ({ Component, pageProps }) => {
  return (
    <StoreProvider reducer={rootReducer} initialState={combinedInitialState}>
      <ThemeProvider themeStorageKey='blog__theme'>
        <MainLayout>
          <Component {...pageProps} />
          <ToastContainer
            position='top-center'
            newestOnTop={true}
            autoClose={5000}
            closeOnClick
            pauseOnHover
          />
        </MainLayout>
      </ThemeProvider>
    </StoreProvider>
  )
}
export default MyApp;