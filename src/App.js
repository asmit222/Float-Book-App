import React, { useState, useEffect } from "react";
import "./App.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/all.css";
import axios from "axios";
import initialData1 from "./data";
import Form from "react-bootstrap/Form";
import {
  updateDoc,
  doc,
  onSnapshot,
  getFirestore,
  collection,
  getDocs,
} from "@firebase/firestore";
import { db } from "./firebaseConfig/firebase.js";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";

function App() {
  const [initialData, setInitialData] = useState([]);
  const [data, setData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [show, setShow] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [showSentTextModal, setShowSentTextModal] = useState(false);
  const [showFailedSentTextModal, setShowFailedSentTextModal] = useState(false);
  const [whereToFloatModal, setShowWhereToFLoatModal] = useState(false);
  const [floatWhereInputBox, setFloatWhereInputBox] = useState("");
  const [dayShift, setDayShift] = useState(true);
  const [moonSelected, setMoonSelected] = useState("");
  const [sunSelected, setSunSelected] = useState("selected-icon");
  const [showPWModal, setShowPWModal] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [password, setPassword] = useState("4tfloatbook");
  const [auth, setAuth] = useState(false);
  const [showNotifyingNurseModal, setShowNotifyingNurseModal] = useState(false);

  async function fetchStaffData() {
    const collectionName = "staff";
    const staffCollection = collection(db, collectionName);

    try {
      const querySnapshot = await getDocs(staffCollection);
      const staffData = [];

      querySnapshot.forEach((doc) => {
        const staffMember = doc.data();
        staffData.push(staffMember);
      });

      return staffData;
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
      throw error;
    }
  }

  useEffect(() => {
    setFilteredData(initialData);
    setData(initialData);
    let initialSelectedItems = [...initialData]
      .filter((staff) => staff.selected === formatDate(new Date()))
      .map((item) => item.name);
    console.log(JSON.stringify(initialSelectedItems));
    setSelectedItems(initialSelectedItems);
    if (localStorage.getItem("moonSelected") === "true") {
      handleShowNightShift();
    } else if (localStorage.getItem("sunSelected") === "true") {
      handleShowDayShift();
    }
  }, [initialData]);

  const handleClose = () => {
    setShow(false);
  };

  const handlePWChange = (e) => {
    setPwInput(e.target.value);
  };

  const checkPW = () => {
    if (pwInput === password) {
      setShowPWModal(false);
      setAuth(true);
      localStorage.setItem("password", password);
    } else {
      alert("password is incorrect");
    }
  };

  const handleFloatWhereChange = (e) => {
    setFloatWhereInputBox(e.target.value);
  };

  const handleCloseWhereToFloatModal = () => {
    setShowWhereToFLoatModal(false);
  };

  const handleShowDayShift = () => {
    // Save data to localStorage
    localStorage.setItem("moonSelected", false);
    localStorage.setItem("sunSelected", true);

    setMoonSelected("");
    setSunSelected("selected-icon");
    let dayShiftOnly = initialData.filter((nurse) => nurse.dayShift);
    setFilteredData(dayShiftOnly);
    setDayShift(true);
  };

  const handleShowNightShift = () => {
    localStorage.setItem("moonSelected", true);
    localStorage.setItem("sunSelected", false);
    setMoonSelected("selected-icon");
    setSunSelected("");
    let nightShiftOnly = initialData.filter((nurse) => !nurse.dayShift);
    setFilteredData(nightShiftOnly);
    setDayShift(false);
  };

  const sendPostRequest = () => {
    selectedNurse.floatingTo = floatWhereInputBox;
    setShowNotifyingNurseModal(true);
    axios
      .post(
        "https://float-book-server-8.fly.dev/api/sendFloatText",
        selectedNurse
      ) // Replace with the actual URL of your Express server
      .then((response) => {
        if (response.status === 200) {
          setShowSentTextModal(true);
          setShowNotifyingNurseModal(false);
          setTimeout(() => {
            setShowSentTextModal(false);
          }, 1000);
        } else {
          setShowFailedSentTextModal(true);
          setShowNotifyingNurseModal(false);
          setTimeout(() => {
            setShowFailedSentTextModal(false);
          }, 1500);
        }
        // Handle success, you can access the response data here
      })
      .catch((error) => {
        setShowFailedSentTextModal(true);
        setShowNotifyingNurseModal(false);
        setTimeout(() => {
          setShowFailedSentTextModal(false);
        }, 1500);
        // Handle error
        console.error("Error:", error);
      });
  };

  const handleRemovePerson = (name) => {
    const updatedData = [...data];
    let nurse = findObjectByName(data, name);
    nurse.floating = false;
    setInitialData(updatedData);

    const updatedSelectedItems = selectedItems.filter(
      (itemName) => itemName !== name
    );

    if (
      nurse.prevFloatDay !== "no floats logged" ||
      nurse.lastFloated === formatDate(new Date())
    ) {
      nurse.lastFloated = nurse.prevFloatDay;
    }
    // nurse.prevFloatDay = "no floats logged";
    nurse.selected = false;
    setInitialData(updatedData);

    const docRef = doc(db, "staff", "staff");
    updateDoc(docRef, { 0: updatedData });

    // Update the selectedItems state with the filtered array
    setSelectedItems(updatedSelectedItems);
    setShow(false);
  };

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so add 1
    const day = String(date.getDate()).padStart(2, "0");

    return `${month}-${day}-${year}`;
  }

  const handleFloat = (name) => {
    const updatedData = [...data];
    let nurse = findObjectByName(data, name);
    nurse.floating = true;
    nurse.floatingTo = floatWhereInputBox;
    if (nurse.lastFloated !== formatDate(new Date())) {
      nurse.prevFloatDay = nurse.lastFloated;
    }
    nurse.lastFloated = formatDate(new Date());
    setInitialData(updatedData);

    const docRef = doc(db, "staff", "staff");
    updateDoc(docRef, { 0: updatedData });

    setShow(false);
    setShowWhereToFLoatModal(false);
    sendPostRequest();
  };

  const handleShowModal = (name) => {
    if (!auth) {
      setShowPWModal(true);
      return;
    }
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
    if (!auth) {
      setShowPWModal(true);
      return;
    }
    // Check if the item is already in the selectedItems array
    if (!selectedItems.includes(item)) {
      setSelectedItems([...selectedItems, item]);
    }
    setSearchQuery("");

    const updatedData = [...data];
    let nurse = findObjectByName(data, item);
    nurse.selected = formatDate(new Date());
    setInitialData(updatedData);

    const docRef = doc(db, "staff", "staff");
    updateDoc(docRef, { 0: updatedData });
  };

  function filterByDayOrNight(namesArray) {
    let filteredArr = [];
    for (let name of namesArray) {
      if (dayShift && findObjectByName(data, name).dayShift) {
        filteredArr.push(name);
      } else if (!dayShift && !findObjectByName(data, name).dayShift) {
        filteredArr.push(name);
      }
    }
    return filteredArr;
  }

  function sortByLastFloated(namesArray) {
    return namesArray.sort((a, b) => {
      // Parse date strings into Date objects
      let nurseA = findObjectByName(data, a);
      let nurseB = findObjectByName(data, b);

      if (nurseA.lastFloated === "no floats logged") {
        return -1;
      }

      const dateA = new Date(nurseA.lastFloated);
      const dateB = new Date(nurseB.lastFloated);

      // Compare the two Date objects
      if (dateA < dateB) {
        return -1; // 'a' should come before 'b'
      } else if (dateA > dateB) {
        return 1; // 'a' should come after 'b'
      } else {
        return 0; // Dates are equal
      }
    });
  }

  useEffect(() => {
    fetchStaffData()
      .then((data) => {
        setInitialData(data[0][0]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    console.log(localStorage.getItem("moonSelected"));
    console.log(localStorage.getItem("sunSelected"));
    setMoonSelected(
      localStorage.getItem("moonSelected") === "true" ? "selected-icon" : ""
    );
    setSunSelected(
      localStorage.getItem("sunSelected") === "true" ? "selected-icon" : ""
    );
    if (localStorage.getItem("moonSelected") === "true") {
      let nightShiftOnly = initialData.filter((nurse) => !nurse.dayShift);
      setFilteredData(nightShiftOnly);
      setDayShift(false);
    } else if (localStorage.getItem("sunSelected") === "true") {
      let dayShiftOnly = initialData.filter((nurse) => nurse.dayShift);
      setFilteredData(dayShiftOnly);
      setDayShift(true);
    }
    if (localStorage.getItem("password") === password) {
      setAuth(true);
    }

    // const docRef = doc(db, "staff", "staff");
    // updateDoc(docRef, { 0: initialData1 });
  }, []);

  // Handle changes in the search input field
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter the data based on the search query
    const filteredData2 = initialData.filter((item) =>
      dayShift
        ? item.name.toLowerCase().includes(query) && item.dayShift
        : item.name.toLowerCase().includes(query) && !item.dayShift
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
    <div className={`App ${dayShift ? "appDay" : "appNight"}`}>
      <div id={`${dayShift ? "headerContainer" : "headerContainerNight"}`}>
        <i
          onClick={handleShowNightShift}
          className={`fas fa-moon ${moonSelected} ${
            !dayShift ? "nightMoon" : ""
          }`}
        ></i>
        <i
          onClick={handleShowDayShift}
          className={`fas fa-sun ${sunSelected}`}
        ></i>

        <h1 className={`headerFloatBook`}>Float Book</h1>
      </div>
      <div className="mainContainer">
        <Modal
          className="nurseModal"
          centered
          show={showPWModal}
          onHide={() => {
            setShowPWModal(false);
          }}
        >
          <Modal.Header>
            <Modal.Title>Password?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {" "}
            <Form>
              <Form.Group
                className="mb-1"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Control
                  onChange={(e) => {
                    handlePWChange(e);
                  }}
                  as="textarea"
                  rows={1}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => checkPW(pwInput)}>
              Enter
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          className="nurseModal"
          centered
          show={whereToFloatModal}
          onHide={handleCloseWhereToFloatModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Float to where?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {" "}
            <Form>
              <Form.Group
                className="mb-1"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Control
                  onChange={(e) => {
                    handleFloatWhereChange(e);
                  }}
                  as="textarea"
                  rows={1}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="floatPersonButton"
              onClick={() => handleFloat(selectedNurse.name)}
            >
              Float
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal className="textSentModal" centered show={showSentTextModal}>
          <Modal.Header>
            <Modal.Title>
              <i className="fa-solid fa-check"></i>
              {`Text sent to ${selectedNurse.name}`}
            </Modal.Title>
          </Modal.Header>
        </Modal>

        <Modal
          className="textFailedSentModal"
          centered
          show={showFailedSentTextModal}
        >
          <Modal.Header>
            <Modal.Title>
              <i className="fa-solid fa-x"></i>
              {`Failed to text ${selectedNurse.name}`}
            </Modal.Title>
          </Modal.Header>
        </Modal>

        <Modal
          className="textSentModal"
          centered
          show={showNotifyingNurseModal}
        >
          <Modal.Header>
            <Modal.Title>
              <i className="fa-solid fa-spinner fa-spin"></i>
              {`Notifying ${selectedNurse.name}`}
            </Modal.Title>
          </Modal.Header>
        </Modal>

        <Modal className="nurseModal" centered show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedNurse.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedNurse.lastFloated !== "no floats logged"
              ? `Last floated on ${selectedNurse.lastFloated} to ${
                  selectedNurse.floatingTo !== ""
                    ? selectedNurse.floatingTo
                    : "n/a"
                }`
              : `no floats logged`}
          </Modal.Body>
          <Modal.Footer className="floatModalFooter">
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
            {selectedNurse.lastFloated !== formatDate(new Date()) && (
              <Button
                className="floatPersonButton"
                size="sm"
                onClick={() => {
                  setShowWhereToFLoatModal(true);
                  setFloatWhereInputBox("");
                }}
              >
                Float this person
              </Button>
            )}
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
                {filteredData
                  .filter((item) => item.selected !== formatDate(new Date()))
                  .sort()
                  .map((item, index) => (
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
          <div className="todayTitleContainer">
            <span>Today's Staff</span>
          </div>
          <div className="table-container">
            <table className="custom-table right-table">
              <thead className="thead">
                <td>Name</td>
                <td>Phone Number</td>
                <td>Last Floated</td>
              </thead>
              <tbody>
                {sortByLastFloated(filterByDayOrNight(selectedItems)).map(
                  (itemName, index) => {
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
                          {index === 0 &&
                            selectedItem?.lastFloated !==
                              formatDate(new Date()) && (
                              <span>
                                <br></br>
                                <span className="nextUpText">next up</span>
                              </span>
                            )}
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
                          <span>
                            {selectedItem?.lastFloated ===
                            formatDate(new Date())
                              ? "TODAY"
                              : selectedItem?.lastFloated}
                          </span>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
