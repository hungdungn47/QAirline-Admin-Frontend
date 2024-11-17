import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Layout from "./pages/Layout/Layout";
import Flights from "./pages/Flights/Flights";
import Tickets from "./pages/Tickets/Tickets";
import Aircrafts from "./pages/Aircrafts/Aircrafts";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<Home/>}/>
            <Route path="flights" element={<Flights/>} />
            <Route path="tickets" element={<Tickets/>}/>
            <Route path="aircrafts" element={<Aircrafts/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App