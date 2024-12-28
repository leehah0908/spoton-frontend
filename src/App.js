import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/pages/Home';
import SignUp from './components/pages/SignUp';
import MyPage from './components/pages/MyPage';
import Game from './components/pages/Game';
import GameDetail from './components/pages/GameDetail';
import Community from './components/pages/Community';
import Nanum from './components/pages/Nanum';
import { ThemeProvider } from '@mui/material/styles';
import { AuthContextProvider } from './contexts/UserContext';
import theme from './assets/theme';
import { Route, Routes } from 'react-router-dom';
import PrivateRouter from './routers/PrivateRouter';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <AuthContextProvider>
                <div className='App'>
                    <Header />
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/signup' element={<SignUp />} />
                        <Route path='/mypage' element={<PrivateRouter element={<MyPage />} />} />
                        <Route path='/game' element={<Game />} />
                        <Route path='/gameDetail/:league/:id' element={<GameDetail />} />
                        <Route path='/community' element={<Community />} />
                        <Route path='/nanum' element={<Nanum />} />

                        {/* <Route
                                path='/product/manage'
                                element={<PrivateRouter element={<ProductCreate />} requiredRole='ADMIN' />}
                            /> */}
                    </Routes>
                    <Footer />
                </div>
            </AuthContextProvider>
        </ThemeProvider>
    );
}

export default App;
