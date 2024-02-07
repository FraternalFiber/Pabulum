import {useEffect, useState} from 'react';
import { Button } from "@/components/ui/button";

function App() {
    console.log('App component is rendering');
  const [serverStatus, setServerStatus] = useState<string>('Server is not working');

  useEffect(() => {
    // Set tab title
    document.title = "Pabulum - home";
    // Connect to backend API at return server status
    fetch('http://127.0.0.1:42069/')
        .then(res => res.json())
        .then((res) => {
          setServerStatus(res.status);
          console.log(res.status);
        })
        .catch((error) => {
            console.error('Backend API connection error: ', error);
        })
  }, []);

  return (
    <>
      <p className={"font-bold"}>{serverStatus}</p>
      <Button type={'button'}>Ok</Button>
    </>
  )
}

export default App
