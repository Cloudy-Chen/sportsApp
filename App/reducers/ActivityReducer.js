

import {
    ENABLE_MY_GROUP_ONFRESH,
    DISABLE_MY_GROUP_ONFRESH,
    ENABLE_ALL_GROUP_ONFRESH,
    DISABLE_ALL_GROUP_ONFRESH,
    SET_MY_GROUP_LIST,
    SET_ALL_GROUP_LIST,
    SET_ACTIVITY_LIST,
    ENABLE_ACTIVITY_ONFRESH,
    DISABLE_ACTIVITY_ONFRESH,
} from '../constants/ActivityConstants';

const initialState = {
    myGroupList: null,
    allGroupList:null,
    activityList:null,
    myGroupOnFresh:true,
    allGroupOnFresh:true,
    activityOnFresh:false,
};

let activity = (state = initialState, action) => {

    switch (action.type) {

        case ENABLE_MY_GROUP_ONFRESH:
            return Object.assign({}, state, {
                myGroupOnFresh:true
            })
        case DISABLE_MY_GROUP_ONFRESH:
            return Object.assign({}, state, {
                myGroupOnFresh:false
            })
        case ENABLE_ALL_GROUP_ONFRESH:
            return Object.assign({}, state, {
                allGroupOnFresh:true
            })
        case DISABLE_ALL_GROUP_ONFRESH:
            return Object.assign({}, state, {
                allGroupOnFresh:false
            })
        case SET_MY_GROUP_LIST:
            return Object.assign({}, state, {
                myGroupList:action.myGroupList
            })
        case SET_ALL_GROUP_LIST:
            return Object.assign({}, state, {
                allGroupList:action.allGroupList
            })
        case SET_ACTIVITY_LIST:
            return Object.assign({}, state, {
                activityList:action.activityList
            })
        case ENABLE_ACTIVITY_ONFRESH:
            return Object.assign({}, state, {
                activityOnFresh:true
            })
        case DISABLE_ACTIVITY_ONFRESH:
            return Object.assign({}, state, {
                activityOnFresh:false
            })

        default:
            return state;
    }
}

export default activity;

