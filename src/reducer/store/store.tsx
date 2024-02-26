import { createStore } from 'redux';
// import { initialInfo } from '../reducer';
import reducer from "../reducer";
const store = createStore(reducer);
export default store;
