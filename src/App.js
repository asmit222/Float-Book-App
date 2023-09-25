import React, { useState, useEffect } from "react";
import "./App.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.css";

function App() {
  const initialData = [
    {
      name: "Natalie Rivero",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-20",
    },
    {
      name: "Natalie Rivero2",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-22",
    },
    {
      name: "Natalie Rivero3",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-21",
    },
    {
      name: "Natalie Rivero4",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-20",
    },
    {
      name: "Natalie Rivero5",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-06-30",
    },
    {
      name: "Natalie Rivero6",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-20",
    },
    {
      name: "Natalie Rivero7",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-20",
    },
    {
      name: "Natalie Rivero8",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-20",
    },
    {
      name: "Natalie Rivero9",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-20",
    },
    {
      name: "Natalie Rivero10",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-20",
    },
    {
      name: "Natalie Rivero11",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-20",
    },
    {
      name: "Natalie Rivero12",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-20",
    },
    {
      name: "Natalie Rivero13",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-20",
    },
    {
      name: "Natalie Rivero14",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-20",
    },
    {
      name: "Natalie Rivero15",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-20",
    },
    {
      name: "Natalie Rivero16",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-20",
    },
    // Add more objects as needed
  ];

  const [data, setData] = useState(initialData);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [show, setShow] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState({});

  const handleClose = () => {
    setShow(false);
  };

  const handleRemovePerson = (name) => {
    const updatedSelectedItems = selectedItems.filter(
      (itemName) => itemName !== name
    );

    // Update the selectedItems state with the filtered array
    setSelectedItems(updatedSelectedItems);
    setShow(false);
  };

  const handleShowModal = (name) => {
    setShow(true);
    let nurse = findObjectByName(initialData, name);
    setSelectedNurse(nurse);
  };

  function findObjectByName(array, nameToFind) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].name === nameToFind) {
        return array[i];
      }
    }
    return null; // Return null if no match is found
  }

  const handleItemClick = (item) => {
    // Check if the item is already in the selectedItems array
    if (!selectedItems.includes(item)) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Handle changes in the search input field
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter the data based on the search query
    const filteredData = initialData.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
    setData(filteredData);
  };

  // Function to sort data by last floated date
  const sortDataByLastFloated = (dataArray) => {
    return dataArray.slice().sort((a, b) => {
      // Convert date strings to Date objects for comparison
      const dateA = new Date(a.lastFloated);
      const dateB = new Date(b.lastFloated);

      // Compare the dates
      return dateA - dateB;
    });
  };

  return (
    <div className="App">
      <div id="headerContainer">
        <h1 className="headerFloatBook">Float Book</h1>
      </div>
      <div className="mainContainer">
        <Modal className="nurseModal" centered show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedNurse.name}</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button
              className="RemovePersonButton"
              variant="danger"
              size="sm"
              onClick={() => {
                handleRemovePerson(selectedNurse.name);
              }}
            >
              Remove from today
            </Button>
            <Button variant="success" size="sm" onClick={handleClose}>
              Float this person
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="leftContainer">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="table-container left-table-container">
            <table className="custom-table left-table">
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "even-row" : "odd-row"}
                    onClick={() => handleItemClick(item.name)}
                  >
                    <td className="tableData">{item.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rightContainer">
          <div className="table-container">
            <table className="custom-table right-table">
              <thead className="thead">
                <td>Name</td>
                <td>Phone Number</td>
                <td>Last Floated</td>
              </thead>
              <tbody>
                {selectedItems.map((itemName, index) => {
                  // Find the corresponding object in initialData based on the name
                  const selectedItem = initialData.find(
                    (item) => item.name === itemName
                  );
                  return (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "even-row" : "odd-row"}
                    >
                      <td
                        onClick={() => {
                          handleShowModal(selectedItem.name);
                        }}
                        className="tableData"
                      >
                        {selectedItem.name}
                      </td>
                      <td
                        onClick={() => {
                          handleShowModal(selectedItem.name);
                        }}
                        className="tableData"
                      >
                        {selectedItem.phoneNumber}
                      </td>
                      <td
                        onClick={() => {
                          handleShowModal(selectedItem.name);
                        }}
                        className="tableData"
                      >
                        {selectedItem.lastFloated}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
