import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";


export default function Menu() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/getData')
      .then((data) => data.json())
      .then((res) => setData(res.data));
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <h1>Nonograms</h1>
      <h2>Select a level:</h2>
      {data.map(d => {
         return (
            <Link
                to={`mainGame/${d.id}`}
                style={{ textDecoration: "inherit", color: "inherit", overflowWrap: "break-word" }}
            >
                <div style={{ border: "1px solid white", padding: "20px", marginBottom: "10px" }}>
                    <p>{d.id}</p>
                    <p>{d.message}</p>
                </div>
            </Link>
         )
       })}
    </div>
  );
}