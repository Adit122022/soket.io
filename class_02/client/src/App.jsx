import React, { useEffect, useState } from 'react'
import { io } from "socket.io-client";

const socket = io("http://localhost:8080")
const App = () => {
  const [data, setData] = useState([])
  const [input, setInput] = useState('')
  useEffect(() => {
    socket.on("message", (chat) => {  //get karna yah receive karna
      setData((prev) => [...prev, chat])
    })

  }, [])

  const send = (e) => {
    e.preventDefault()
    socket.emit("message", input)  // emit the message to the server (send karna post karna)
    setInput('')
  }
  return (
    <div>
      <div>
        {data.map((item, index) => {
          return (
            <p key={index}>{item}</p>
          )
        })}
      </div>
      <input value={input} onChange={(e) => { setInput(e.target.value) }} type="text" />
      <button onClick={send}>send</button>
    </div>
  )
}

export default App
