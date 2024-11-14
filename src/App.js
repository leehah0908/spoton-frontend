import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import SignUp from './components/SignUp';
import { ThemeProvider } from '@mui/material/styles';
import { AuthContextProvider } from './contexts/UserContext';
import theme from './assets/theme';
import { Route, Routes } from 'react-router-dom';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <AuthContextProvider>
                <div className='App'>
                    <Header />
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/signup' element={<SignUp />} />

                        {/* <Route path='/mypage' element={<PrivateRouter element={<Mypage />} />} />
                            <Route
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
