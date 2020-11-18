import React from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import './App.css';
import firebaseConfig from './firebase.confq';
import { useState } from 'react';
firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser]=useState(false);
  const [user, setUser]=useState({
    isSignedIn:false,
    name:'', 
    email:'',
    password:'',
    photo:'',
    error:''
  })
  const  provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn=()=>{
    firebase.auth().signInWithPopup(provider)
    .then (res=>{
      console.log(res)
     const {displayName,email,photoURL}=res.user;
     const signedInUser={
       isSignedIn:true,
      name:displayName,
      email:email,
      photo:photoURL

     }
     setUser(signedInUser)
     console.log(displayName,email,photoURL)
    })
    .catch(function(error) {
   
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage,errorCode)
    
    });
  }

 
 
  const handleSignOut=()=>{
  firebase.auth().signOut()
  .then(res=>{
    const signOutUser={
     isSignedIn:false,
     name:'',
     email:'',
     photo:'',
     success:''

    }
setUser(signOutUser)

  })
  .catch(err =>{

  })
  }
  


const handleBlurChange =(e)=>{
 let isFormValid = true;
  if(e.target.name ==='email'){
   isFormValid= /\S+@\S+\.\S+/.test(e.target.value);

  console.log(isFormValid);
  }
  if(e.target.name==='password'){
    const isPasswordValid=e.target.value.length>6;
    const hasNumber=/\d{1}/.test(e.target.value);
     isFormValid=isPasswordValid & hasNumber
 
   }
   if (isFormValid){
   const newUserInfo={...user};
   newUserInfo[e.target.name]=e.target.value;
   setUser(newUserInfo);

   }

}

const handleSubmit=(e)=>{
  e.preventDefault();
  console.log(user.email,user.password)
  
if(newUser && user.email && user.password){
  console.log('submit')
 firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
 .then(res=>{
   const newUserInfo={...user};
   newUserInfo.error='';
   newUserInfo.success=true;
   setUser(newUserInfo);
   updateUserName(user.name);
 })
  .catch(error=>{
    console.log(error)
  const newUserInfo={...user};
  newUserInfo.error=error.message;
  newUserInfo.success=false;
  setUser(newUserInfo)

  });

}

if(!newUser && user.email && user.password){

  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then((res) => {
    const newUserInfo={...user};
    newUserInfo.error='';
    newUserInfo.success=true;
    setUser(newUserInfo)
   console.log('sign in user info', res.user)

  })
  .catch((error) => {
    const newUserInfo={...user};
    newUserInfo.error=error.message;
    newUserInfo.success=false;
    setUser(newUserInfo)
  });



}

}

const updateUserName =(name)=>{

  var user = firebase.auth().currentUser;

  user.updateProfile({
    displayName: name,
    
  }).then(function() {
  console.log('user name updated successfully ')
  }).catch(function(error) {
    console.log(error)
  });
}

  return (
    <div className="App">
     {
       
       user.isSignedIn ? <button onBlur={handleSignOut}>sign out</button> :
       <button onBlur={handleSignIn}>sign in</button>
       
       }
    {
     user.isSignedIn &&<div> wellcome, {user.name} 
                  <p>email:{user.email}</p>
                  <img src={user.photo} alt=""/>
           </div>
    }
    <h1>Authentification </h1>
    <input  type="checkbox" onChange={()=>setNewUser(!newUser)} name="newUser" id=""/>
    <label htmlFor="newUser">Sign Up</label>
    <form onSubmit={handleSubmit}>
      {newUser && <input type="text"onBlur={handleBlurChange}  name="name" placeholder="your name"/>}<br/>
    <input type="text" onBlur={handleBlurChange} name="email" placeholder='email' required/><br/>
     <input type="password" onBlur={handleBlurChange} name="password" placeholder="password" required/><br/>
     <input type="submit" value={newUser ? 'sign up' :'sign in'}/>





    </form>
   
   
  <p style={{color:'red'}}>{user.error}</p>
   {
     user.success &&  <p style={{color:'green'}}>{newUser ? 'creat newUSER' :'Logged in'} {user.error}</p>
   }

    </div>
  );
}

export default App;
