import React, { useState } from 'react'
import './Login.scss';

const Login = ({onJoin}) => {
  const [room, setRoom] = useState('')

  return (
    <div className="login">
      <h1>Login</h1>
      <input type="text" placeholder="Room name..." value={room} onChange={e => setRoom(e.target.value)}/>
      <button onClick={() => onJoin(room)}>Join</button>
    </div>
  )
}

export default Login;
