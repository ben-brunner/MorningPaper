import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';
import '../App.css';
import {Input,Button, message} from 'antd';
import { connect } from 'react-redux';

function ScreenHome(props) {

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpUserName, setSignUpUserName] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  const [isLogin, setIsLogin] = useState(false);

  /* Error Pop-up */
  let error = '';
  const warning = () => {
    message.warning(error);
  };

  // Sign Up
  const handleSignUp = async () => {
    if (signUpEmail !== '' && signUpUserName !== '' && signUpPassword !== '') {
      const raw = await fetch('/users/sign-up', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `email=${signUpEmail}&userName=${signUpUserName}&password=${signUpPassword}`
      });
      const body = await raw.json();

      if (body.user !== undefined) {
        setIsLogin(true);
        props.userLoggedIn(body.user.token);
      } else {
        error = 'There is already a user registered with that email address';
        warning()
      };

    } else {
      error = 'Please fill out all 3 fields';
      warning()
    }
  };
  
  // Sign In
  const handleSignIn = async () => {

    if (signInEmail !== '' && signInPassword !== '') {
      const raw = await fetch('/users/sign-in', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `email=${signInEmail}&password=${signInPassword}`
      });
      const response = await raw.json();
      const checkUser = response.userFound;
      if (checkUser) {
        setIsLogin(true);
        props.userLoggedIn(response.user.token);

      } else {
        error = 'Email or password incorrect';
        warning();
      };

    } else {
      error = 'Please fill out both fields';
      warning();
    }
  };

  if (isLogin) {
    return <Redirect to='/ScreenSource' />
  }

  return (
    <div className="Login-page" >

          {/* SIGN-IN */}

          <div className="Sign">
                  
            <Input className="Login-input" placeholder="hankmoody@gmail.com" onChange={(e) => setSignInEmail(e.target.value)} value={signInEmail} />

            <Input.Password className="Login-input" placeholder="Password" onChange={(e) => setSignInPassword(e.target.value)} value={signInPassword} />

            <Button href="#" style={{width:'80px'}} type="primary" onClick={handleSignIn}>Sign in</Button>

          </div>

          {/* SIGN-UP */}

          <div className="Sign">
                  
            <Input className="Login-input" placeholder="hankmoody@gmail.com" onChange={(e) => setSignUpEmail(e.target.value) } value={signUpEmail} />
                  
            <Input className="Login-input" placeholder="HankMoody" onChange={(e) => setSignUpUserName(e.target.value)} value={signUpUserName}/>

            <Input.Password className="Login-input" placeholder="Password" onChange={(e) => setSignUpPassword(e.target.value)} value={signUpPassword} />
            
            <Button href="#" style={{width:'80px'}} onClick={handleSignUp} type="primary" >Sign up</Button>

          </div>

      </div>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    userLoggedIn: function (token) {
      dispatch({ type: 'login', token: token })
    }
  }
};

export default connect(
  null,
  mapDispatchToProps
  )(ScreenHome);
