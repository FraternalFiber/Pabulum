import './App.css'
import {useEffect, useState} from 'react';

function App() {
  const [serverStatus, setServerStatus] = useState<string>('Server is not working');

  useEffect(() => {
    fetch('http://localhost:9000/')
        .then(res => res.json())
        .then((res) => {
          setServerStatus(res.status);
          console.log(res.status);
        })
  }, []);

  return (
    <>
      <p>{serverStatus}</p>
    </>
  )
}

export default App
