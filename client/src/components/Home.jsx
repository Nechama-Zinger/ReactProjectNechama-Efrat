import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

function Home() {
  // const [user, setUser] = useState(null);

  // // useEffect(() => {
  // //     const storedUser = localStorage.getItem("user");
  // //     if (storedUser) {
  // //         setUser(JSON.parse(storedUser));
  // //     }
  // // }, []);

  return (
    <>
      <Navbar />
      <div>
        <div style={{ padding: "2rem" }}>
          <h1>Welcome to Home Page</h1>
          <p>This is the main content of the home page.</p>
        </div>
      </div>
    </>
  );
}

export default Home;
