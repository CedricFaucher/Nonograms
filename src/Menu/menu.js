import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import UpsertModal from "./components/upsertModal";
import axios from "axios";
import { getDefaultEmptyBoardSolution, getDefaultHorizontalBoardSolution, getDefaultVerticalBoardSolution } from "../utils/defaultUtils";
import { CircularProgress, Grid } from "@mui/material";
import DeleteModal from "./components/deleteModal";

// CREATE
const putDataToDB = (objToCreate) => {
  axios.post('http://localhost:3001/api/putData', {
    name: objToCreate.name,
    solution: objToCreate.solution,
    boardState: objToCreate.boardState,
    horizontalState: objToCreate.horizontalState,
    verticalState: objToCreate.verticalState,
    isDone: objToCreate.isDone
  });
};

// DELETE
const deleteFromDB = (idTodelete) => {
  axios.delete('http://localhost:3001/api/deleteData', {
    data: {
      id: idTodelete,
    },
  });
};

//UPDATE
export const updateDB = (idToUpdate, objectToUpdate) => {
  axios.post('http://localhost:3001/api/updateData', {
    id: idToUpdate,
    update: {
      name: objectToUpdate.name,
      solution: objectToUpdate.solution,
      boardState: objectToUpdate.boardState,
      horizontalState: objectToUpdate.horizontalState,
      verticalState: objectToUpdate.verticalState,
      isDone: objectToUpdate.isDone
    },
  });
};

export default function Menu() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDataFromDb();
  }, []);

  // GET ALL
  const getDataFromDb = () => {
    setIsLoading(true);
    setTimeout(() => {
      fetch('http://localhost:3001/api/getData')
        .then((data) => data.json())
        .then((res) => {
          setData(res.data);
          setIsLoading(false);
        });
    }, 1000);
  };

  return (
    <div style={{ margin: "20px" }}>
      <h1>Nonograms</h1>
      <UpsertModal
        confirmFnc={(name, solution) => {
          putDataToDB({
            name: name,
            solution: solution,
            boardState: getDefaultEmptyBoardSolution(solution),
            horizontalState: getDefaultHorizontalBoardSolution(solution),
            verticalState: getDefaultVerticalBoardSolution(solution),
            isDone: false
          });
          getDataFromDb();
        }}
      />
      <h2>Select a level:</h2>
      {isLoading ? 
        <CircularProgress /> :
        <Grid container spacing={2}>
          {data.map(d => {
            return (
              <Grid item xs={4}>
                <Grid container spacing={1}>
                  <Grid item xs={10}>
                    <Link
                        to={`mainGame/${d._id}`}
                        style={{ textDecoration: "inherit", color: "inherit", overflowWrap: "break-word" }}
                    >
                        <div style={{ border: "1px solid white", padding: "20px", marginBottom: "10px" }}>
                            <p>{d._id}</p>
                            <p>{d.name}</p>
                            <p>{d.isDone ? "Is Done" : "Is Not Done"}</p>
                        </div>
                    </Link>
                  </Grid>
                  <Grid item xs={2}>
                    <div style={{ marginBottom: "0.5rem" }}>
                      <UpsertModal
                        confirmFnc={(name, solution) => {
                          const isResetState = d.solution !== solution;
                          updateDB(
                            d._id,
                            {
                              name: name,
                              solution: solution,
                              boardState: isResetState ? getDefaultEmptyBoardSolution(solution) : d.boardState,
                              horizontalState: isResetState ? getDefaultHorizontalBoardSolution(solution) : d.horizontalState,
                              verticalState: isResetState ? getDefaultVerticalBoardSolution(solution) : d.verticalState,
                              isDone: isResetState ? false : d.isDone
                            }
                          );
                          getDataFromDb();
                        }}
                        isUpdate
                        name={d.name}
                        solution={d.solution}
                      />
                    </div>
                    <DeleteModal
                      confirmFnc={() => {
                        deleteFromDB(d._id);
                        getDataFromDb();
                      }}
                      name={d.name}
                    />
                  </Grid>
                </Grid>
              </Grid>
            )
          })}
        </Grid>
      }
    </div>
  );
}