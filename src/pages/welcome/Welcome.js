import React from 'react'
import './Welcome.scss'
import Login from '../../components/login/Login'
import { useHistory } from 'react-router-dom'

const Welcome = () => {
  let history = useHistory();

  const onJoin = (room) => {
    history.push('/meeting');
  }

  return (
    <div className="welcome">
      <Login onJoin={onJoin}/>
    </div>
  )
}

export default Welcome;
