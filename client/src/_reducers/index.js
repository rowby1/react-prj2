import {combineReducers} from 'redux';
import user from './user_reducer';
// import comment from './comment_reducer';

const rootReducer = combineReducers({
    user
    // commnet
})

export default rootReducer;