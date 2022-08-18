import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser, registerUser } from '../../../_action/user_action';
import { useNavigate } from 'react-router-dom';
import button from '@mui/material';

function RegisterPage() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  }

  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  }

  const onConfirmPasswordlHandler = (event) => {
    setConfirmPassword(event.currentTarget.value);
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  }

  const onSubmitHanler = (event) => {
    event.preventDefault();

    if (Password !== ConfirmPassword){
      return alert('비밀번호와 비밀번호 확인은 같아야 합니다.');
    }

    // console.log('Email', Email);
    // console.log('Password', Password);

    let body = {
      email: Email,
      password: Password,
      name: Name
    }

    dispatch(registerUser(body))
      .then(response => {
        if (response.payload.success) {
          navigate('/login');
        } else {
          alert('Failed to sign up');
        }
      })
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center'
      , width: '100%', height: '100vh'
    }}>
      <form style={{ display: 'flex', flexDirection: 'column' }}
        onSubmit={onSubmitHanler}
      >
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>Name</label>
        <input type="text" value={Name} onChange={onNameHandler} />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <label>ConfirmPassword</label>
        <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordlHandler} />
        <br />
        <button>
          Login
        </button>
      </form>
    </div>
  )
}

export default RegisterPage