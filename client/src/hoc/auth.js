import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { auth } from '../_action/user_action';
import { useNavigate } from 'react-router-dom';

export default function (SpecificComponent, option, adminRoute = null) {

    //null => 아무너 출입 가능
    //true => 로그인한 유저만 출입 가능
    //flase => 로그인한 유저는 출입 불가능

    function AuthenticationCheck(props) {

        const navigator = useNavigate();
        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth())
            .then(response => {
                console.log(response);

                // 로그인 하지 않은 상태
                if(!response.payload.isAuth){
                    if(option){
                        navigator('/login');
                    }
                } else {
                    //로그인 한 상태
                    if(adminRoute && !response.payload.isAdmin){
                        navigator('/');
                    } else {
                        if (option === false){
                            navigator('/');
                        }
                    }
                }
            })

        }, [])

        return (
            <SpecificComponent />
        )

    }

    return <AuthenticationCheck />
}