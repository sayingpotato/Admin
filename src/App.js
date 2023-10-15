import React from "react";
import Appstudent from "./pages/Appstudent";
import Appstore from "./pages/Appstore";
import { Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
   return (
      <BrowserRouter>
         <Routes>
            {/*학생 관리 페이지 */}
            <Route path="/appstudent" element={<Appstudent />} />
            {/*점주 관리 페이지 */}
            <Route path="/appstore" element={<Appstore />} />
         </Routes>
      </BrowserRouter>
   );
}

export default App;
