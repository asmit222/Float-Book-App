import React, { useState, useEffect } from "react";
import "./App.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/all.css";

function App() {
  const initialData = [
    {
      name: "Albite, Sophia Joy",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-20",
      floating: false,
    },
    {
      name: "Almara, Lobna",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-22",
      floating: false,
    },
    {
      name: "Ansari, Zubair A",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-21",
      floating: false,
    },
    {
      name: "Natalie Rivero4",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-20",
      floating: false,
    },
    {
      name: "Natalie Rivero5",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-06-30",
      floating: false,
    },
    {
      name: "Natalie Rivero6",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-20",
      floating: false,
    },
    {
      name: "Natalie Rivero7",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-20",
      floating: false,
    },
    {
      name: "Natalie Rivero8",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-20",
      floating: false,
    },
    {
      name: "Natalie Rivero9",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-20",
      floating: false,
    },
    {
      name: "Natalie Rivero10",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-20",
      floating: false,
    },
    {
      name: "Natalie Rivero11",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-20",
      floating: false,
    },
    {
      name: "Natalie Rivero12",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-20",
      floating: false,
    },
    {
      name: "Natalie Rivero13",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-20",
      floating: false,
    },
    {
      name: "Natalie Rivero14",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-20",
      floating: false,
    },
    {
      name: "Natalie Rivero15",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-20",
      floating: false,
    },
    {
      name: "Natalie Rivero16",
      phoneNumber: "123-456-7890",
      lastFloated: "2023-09-20",
      floating: false,
    },
    // Add more objects as needed
  ];

  const [data, setData] = useState(initialData);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [show, setShow] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState({});
  const [filteredData, setFilteredData] = useState(initialData);

  const handleClose = () => {
    setShow(false);
  };

  const handleRemovePerson = (name) => {
    const updatedData = [...data];
    let nurse = findObjectByName(data, name);
    nurse.floating = false;
    setData(updatedData);

    const updatedSelectedItems = selectedItems.filter(
      (itemName) => itemName !== name
    );

    // Update the selectedItems state with the filtered array
    setSelectedItems(updatedSelectedItems);
    setShow(false);
  };

  const handleFloat = (name) => {
    const updatedData = [...data];
    let nurse = findObjectByName(data, name);
    nurse.floating = true;
    nurse.lastFloated = "NOW";
    setData(updatedData);

    setShow(false);
  };

  const handleShowModal = (name) => {
    setShow(true);
    let nurse = findObjectByName(initialData, name);
    setSelectedNurse(nurse);
  };

  function findObjectByName(array, nameToFind) {
    console.log(array, nameToFind);
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
    console.log(e.target.value);
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter the data based on the search query
    const filteredData2 = initialData.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
    setFilteredData(filteredData2);
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
        <i className="fas fa-moon"></i>
        <i className="fas fa-sun"></i>

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
            <Button
              variant="success"
              size="sm"
              onClick={() => handleFloat(selectedNurse.name)}
            >
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
                {filteredData.map((item, index) => (
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
                  const selectedItem = data.find(
                    (item) => item.name === itemName
                  );
                  return (
                    <tr
                      key={index}
                      className={
                        selectedItem?.floating
                          ? "floating"
                          : index % 2 === 0
                          ? "even-row"
                          : "odd-row"
                      }
                    >
                      <td
                        onClick={() => {
                          handleShowModal(selectedItem.name);
                        }}
                        className={`tableData
                        `}
                      >
                        {selectedItem?.name}
                      </td>
                      <td
                        onClick={() => {
                          handleShowModal(selectedItem.name);
                        }}
                        className="tableData"
                      >
                        {selectedItem?.phoneNumber}
                      </td>
                      <td
                        onClick={() => {
                          handleShowModal(selectedItem.name);
                        }}
                        className="tableData"
                      >
                        {selectedItem?.lastFloated}
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
