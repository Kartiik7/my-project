import { useContext } from 'react';
import AuthContext from '../context/AuthContext'; // Fix: Added .jsx extension to resolve path

const useAuth = () => useContext(AuthContext);

export default useAuth;

