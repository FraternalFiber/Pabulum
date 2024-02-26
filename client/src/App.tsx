import {useEffect, useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {routes} from "@/helpers/routes.tsx";

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
          console.log(serverStatus);
        })
        .catch((error) => {
            console.error('Backend API connection error: ', error);
        })
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
        ))}
      </Routes>
    </BrowserRouter>
  )
}

export default App
