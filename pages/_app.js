import combineReducers from '../context/Reducers/index';
import { StoreProvider } from '../context/Store';
import { ThemeProvider } from "use-theme-switcher";
import { authInitialState, AuthReducer } from '../context/Reducers/AuthReducer';
import { postInitialState, PostReducer } from '../context/Reducers/PostReducer';
import { profileInitialState, ProfileReducer } from '../context/Reducers/ProfileReducer';
import { followInitialState, FollowReducer } from "../context/Reducers/FollowReducer";
import MainLayout from 'components/MainLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/main.scss';

const combinedInitialState = {
  auth: authInitialState,
  follow: followInitialState,
  post: postInitialState,
  profile: profileInitialState
};

const rootReducer = combineReducers({
  auth: AuthReducer,
  follow: FollowReducer,
  post: PostReducer,
  profile: ProfileReducer
});

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