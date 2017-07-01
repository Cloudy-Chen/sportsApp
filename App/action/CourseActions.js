
import Config from '../../config'
import Proxy from '../utils/Proxy'
import PreferenceStore from '../utils/PreferenceStore';


import {
    DISTRIBUTE_COURSE,
    ON_COURSE_UPDATE,
    ON_COURSES_UPDATE
} from '../constants/CourseConstants'

//拉取课程
export let fetchCourses=()=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state=getState();
            var accessToken = state.user.accessToken;

            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'fetchCourses'
                }
            }).then((json)=>{
                resolve(json)

            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}


export let onCoursesUpdate=(courses)=>{
    return (dispatch,getState)=>{
        dispatch({
            type:ON_COURSES_UPDATE,
            payload:{
                courses
            }
        })
    }
}

//发布课程
export let distributeCourse=(course,timeList,venue)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {

            var state=getState();
            var accessToken = state.user.accessToken;

            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'distributeCourse',
                    info:{
                        course,
                        timeList,
                        venue
                    }
                }
            }).then((json)=>{
                resolve(json)

            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}

export let fetchClassSchedule=(classId)=>{
    return (dispatch,getState)=>{
        return new Promise((resolve, reject) => {
            var state=getState();
            var accessToken = state.user.accessToken;

            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'fetchClassSchedule',
                    info:{
                        classId
                    }
                }
            }).then((json)=>{
                resolve(json)

            }).catch((e)=>{
                alert(e);
                reject(e);
            })

        })
    }
}

export let fetchPersonRelative =()=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {
            var state=getState();
            var accessToken = state.user.accessToken;

            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'fetchPersonRelative',
                }
            }).then((json)=>{
                resolve(json)

            }).catch((e)=>{
                alert(e);
                reject(e);
            })
        })
    }
}

//课程报名
export let addBadmintonClassMermberInfo=(payload)=>{
    return (dispatch,getState)=> {
        return new Promise((resolve, reject) => {
            var state=getState();
            var accessToken = state.user.accessToken;

            Proxy.postes({
                url: Config.server + '/svr/request',
                headers: {
                    'Authorization': "Bearer " + accessToken,
                    'Content-Type': 'application/json'
                },
                body: {
                    request: 'addBadmintonClassMermberInfo',
                    info:payload
                }
            }).then((json)=>{
                resolve(json)

            }).catch((e)=>{
                alert(e);
                reject(e);
            })
        })
    }
}
