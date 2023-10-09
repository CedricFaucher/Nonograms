import { useState, useEffect } from 'react';
import axios from 'axios';

export default function BaseDBManipulations({ isHidden }) {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState(null);
  const [currentInterval, setCurrentInterval] = useState(null);
  const [idToDelete, setIdToDelete] = useState(null);
  const [idToUpdate, setIdToUpdate] = useState(null);
  const [objectToUpdate, setObjectToUpdate] = useState(null);

  useEffect(() => {
    getDataFromDb();
    if (null === currentInterval) {
      setCurrentInterval(setInterval(getDataFromDb, 1000));
    }
    return () => {
      if (null !== currentInterval) {
        clearInterval(currentInterval);
        setCurrentInterval(null);
      }
    }
  }, [currentInterval]);

  const getDataFromDb = () => {
    fetch('http://localhost:3001/api/getData')
      .then((data) => data.json())
      .then((res) => setData(res.data));
  };

  const putDataToDB = (message) => {
    let currentIds = data.map((data) => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post('http://localhost:3001/api/putData', {
      id: idToBeAdded,
      message: message,
    });
  };

  const deleteFromDB = (idTodelete) => {
    let objIdToDelete = null;
    data.forEach((dat) => {
      if (dat.id === parseInt(idTodelete)) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete('http://localhost:3001/api/deleteData', {
      data: {
        id: objIdToDelete,
      },
    });
  };

  const updateDB = (idToUpdate, objectToUpdate) => {
    let objIdToUpdate = null;
    data.forEach((dat) => {
      if (dat.id === parseInt(idToUpdate)) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post('http://localhost:3001/api/updateData', {
      id: objIdToUpdate,
      update: { message: objectToUpdate },
    });
  };

  return (
    <div style={{ visibility: isHidden ? "hidden" : "", height: isHidden && 0 }}>
      <ul>
        {data.length <= 0
          ? 'NO DB ENTRIES YET'
          : data.map((dat, index) => (
              <li style={{ padding: '10px' }} key={`dat.message-${index}`}>
                <span style={{ color: 'gray' }}> id: </span> {dat.id} <br />
                <span style={{ color: 'gray' }}> data: </span>
                {dat.message}
              </li>
            ))}
      </ul>
      <div style={{ padding: '10px' }}>
        <input
          type="text"
          onChange={e => setMessage(e.target.value)}
          placeholder="add something in the database"
          style={{ width: '200px' }}
        />
        <button onClick={() => putDataToDB(message)}>
          ADD
        </button>
      </div>
      <div style={{ padding: '10px' }}>
        <input
          type="text"
          style={{ width: '200px' }}
          onChange={(e) => setIdToDelete(e.target.value)}
          placeholder="put id of item to delete here"
        />
        <button onClick={() => deleteFromDB(idToDelete)}>
          DELETE
        </button>
      </div>
      <div style={{ padding: '10px' }}>
        <input
          type="text"
          style={{ width: '200px' }}
          onChange={(e) => setIdToUpdate(e.target.value)}
          placeholder="id of item to update here"
        />
        <input
          type="text"
          style={{ width: '200px' }}
          onChange={(e) => setObjectToUpdate(e.target.value)}
          placeholder="put new value of the item here"
        />
        <button onClick={() => updateDB(idToUpdate, objectToUpdate)}>
          UPDATE
        </button>
      </div>
    </div>
  );
}
