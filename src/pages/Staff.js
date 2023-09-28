import React, { useState, useEffect } from "react";
import {
  updateDoc,
  doc,
  onSnapshot,
  getFirestore,
  collection,
  getDocs,
} from "@firebase/firestore";
import { db } from "../firebaseConfig/firebase.js";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function Staff() {
  const [data, setData] = useState([]);
  const [showStaffMemberModal, setShowStaffMemberModal] = useState(false);
  const [currNurse, setCurrNurse] = useState({});

  const [nameInputBox, setNameInputBox] = useState("");
  const [phoneNumberInputBox, setPhoneNumberInputBox] = useState("");
  const [dayShiftInputBox, setDayShiftInputBox] = useState("");
  const [jobInputBox, setJobInputBox] = useState("");
  const [lastFloatedInputBox, setLastFloatedInputBox] = useState("");
  const [showAreYouSureDelete, setShowAreYouSureDelete] = useState(false);
  const [showAddStaffMemberModal, setShowAddStaffMemberModal] = useState(false);

  const handleUpdateJob = (e) => {
    setJobInputBox(e.target.value);
  };

  const handleCreateStaffMember = async () => {
    if (!nameInputBox || !phoneNumberInputBox) {
      alert("Please enter a name and a phone number");
      return;
    }

    setShowAddStaffMemberModal(false);

    const newData = [...data];
    let newStaff = {};

    newStaff.dayShift = false;
    if (dayShiftInputBox === "day") {
      newStaff.dayShift = true;
    }
    newStaff.selected = "09-21-2021";
    newStaff.floating = false;
    newStaff.jobType = "RN";
    if (jobInputBox !== "") {
      newStaff.jobType = jobInputBox;
    }
    newStaff.name = nameInputBox;
    newStaff.floatingTo = "";
    newStaff.phoneNumber = phoneNumberInputBox;
    newStaff.prevFloatDay = "no floats logged";
    newStaff.lastFloated = "no floats logged";
    newData.push(newStaff);

    const docRef = doc(
      db,
      "staff",
      process.env.NODE_ENV !== "development" ? "staff" : "staff-test"
    );
    await updateDoc(docRef, { 0: newData });
    fetchStaffData()
      .then((data) => {
        setData(data[process.env.NODE_ENV !== "development" ? 0 : 1][0]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  function sortObjectsByName(objects) {
    // Use the sort method to compare objects based on their "name" property
    objects.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    return objects;
  }

  const handleDeleteStaffMemberForReal = async () => {
    console.log("deleting " + currNurse.name);
    setShowAreYouSureDelete(false);
    const newArray = data.filter(
      (item) => JSON.stringify(item) !== JSON.stringify(currNurse)
    );

    const docRef = doc(
      db,
      "staff",
      process.env.NODE_ENV !== "development" ? "staff" : "staff-test"
    );
    await updateDoc(docRef, { 0: newArray });
    fetchStaffData()
      .then((data) => {
        setData(data[process.env.NODE_ENV !== "development" ? 0 : 1][0]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleUpdateName = (e) => {
    setNameInputBox(e.target.value);
  };
  const handleUpdatePhoneNumber = (e) => {
    setPhoneNumberInputBox(e.target.value);
  };
  const handleUpdateDayShift = (e) => {
    setDayShiftInputBox(e.target.value);
  };
  const handleUpdateLastFloated = (e) => {
    setLastFloatedInputBox(e.target.value);
  };

  const handleDeleteStaffMember = () => {
    console.log("hi");
    setShowStaffMemberModal(false);
    setShowAreYouSureDelete(true);
  };

  function isValidDate(dateString) {
    // Regular expression to match the date format mm-dd-yyyy or m-dd-yyyy
    const datePattern = /^(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])-(\d{4})$/;

    if (!datePattern.test(dateString)) {
      return false; // Date format does not match
    }

    // Parse the date components (month, day, and year)
    const [_, month, day, year] = dateString.match(datePattern);

    // Check if the parsed month, day, and year are valid
    const parsedMonth = parseInt(month, 10);
    const parsedDay = parseInt(day, 10);
    const parsedYear = parseInt(year, 10);

    // Check if the year is within a reasonable range (adjust this range as needed)
    const currentYear = new Date().getFullYear();
    const minYear = 1900;
    const maxYear = currentYear + 10; // Allowing dates up to 10 years in the future

    if (parsedYear < minYear || parsedYear > maxYear) {
      return false; // Year is out of range
    }

    // Check if the day is valid for the given month
    const daysInMonth = new Date(parsedYear, parsedMonth, 0).getDate();

    if (parsedDay < 1 || parsedDay > daysInMonth) {
      return false; // Day is out of range for the month
    }

    // If all checks pass, the date is valid
    return true;
  }

  function findObjectByName(array, nameToFind) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].name === nameToFind) {
        return array[i];
      }
    }
    return null; // Return null if no match is found
  }

  const handleUpdateClick = () => {
    if (lastFloatedInputBox && !isValidDate(lastFloatedInputBox)) {
      alert(
        "last floated date is not valid. Please enter date in format mm-dd-yyyy"
      );
      return;
    }

    console.log(
      nameInputBox,
      phoneNumberInputBox,
      dayShiftInputBox,
      lastFloatedInputBox
    );
    setShowStaffMemberModal(false);

    const newData = [...data];
    let nurse = findObjectByName(data, currNurse.name);
    if (nameInputBox) {
      nurse.name = nameInputBox;
    }
    if (phoneNumberInputBox) {
      nurse.phoneNumber = phoneNumberInputBox;
    }
    if (dayShiftInputBox === "day") {
      nurse.dayShift = true;
    } else if (dayShiftInputBox === "night") {
      nurse.dayShift = false;
    }
    if (lastFloatedInputBox && true) {
      nurse.lastFloated = lastFloatedInputBox;
    }

    const docRef = doc(
      db,
      "staff",
      process.env.NODE_ENV !== "development" ? "staff" : "staff-test"
    );
    updateDoc(docRef, { 0: newData });
  };

  const handleRowClick = (staffMember) => {
    setNameInputBox("");
    setPhoneNumberInputBox("");
    setDayShiftInputBox("");
    setLastFloatedInputBox("");
    setJobInputBox("");
    console.log(staffMember.name);
    setShowStaffMemberModal(true);
    setCurrNurse(staffMember);
  };

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
    fetchStaffData()
      .then((data) => {
        setData(data[process.env.NODE_ENV !== "development" ? 0 : 1][0]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <div className="staffContainer">
      <Button
        onClick={() => {
          setShowAddStaffMemberModal(true);
          setNameInputBox("");
          setPhoneNumberInputBox("");
          setDayShiftInputBox("");
          setLastFloatedInputBox("");
          setJobInputBox("");
        }}
        className="addStaffMemberButton"
        size="sm"
        variant="primary"
      >
        Add staff member
      </Button>
      <Modal
        onHide={() => {
          setShowAreYouSureDelete(false);
        }}
        centered
        show={showAreYouSureDelete}
      >
        <Modal.Header>
          <Modal.Title>{`Delete ${currNurse.name}?`}</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button
            className="deleteStaffMemberButton"
            onClick={handleDeleteStaffMemberForReal}
            size="sm"
            variant="dark"
          >
            Delete staff member
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        className="nurseModal"
        centered
        show={showStaffMemberModal}
        onHide={() => {
          setShowStaffMemberModal(false);
        }}
      >
        <Modal.Header>
          <Modal.Title>{currNurse.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <Form>
            <Form.Group
              className="mb-1"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label className="formLabelStaffPage">name</Form.Label>
              <Form.Control
                placeholder={currNurse.name}
                onChange={(e) => {
                  handleUpdateName(e);
                }}
                as="textarea"
                rows={1}
              />
              <Form.Label className="formLabelStaffPage">
                phone number
              </Form.Label>
              <Form.Control
                placeholder={currNurse.phoneNumber}
                onChange={(e) => {
                  handleUpdatePhoneNumber(e);
                }}
                as="textarea"
                rows={1}
              />
              <Form.Label className="formLabelStaffPage">
                day or night
              </Form.Label>
              <Form.Control
                placeholder={currNurse.dayShift ? "day" : "night"}
                onChange={(e) => {
                  handleUpdateDayShift(e);
                }}
                as="textarea"
                rows={1}
              />
              <Form.Label className="formLabelStaffPage">
                last floated
              </Form.Label>
              <Form.Control
                placeholder={currNurse.lastFloated + " (mm-dd-yyyy)"}
                onChange={(e) => {
                  handleUpdateLastFloated(e);
                }}
                as="textarea"
                rows={1}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="cancelButtonStaffModal"
            onClick={() => {
              setShowStaffMemberModal(false);
            }}
            variant="danger"
          >
            Cancel
          </Button>
          <Button onClick={handleUpdateClick} variant="primary">
            Update
          </Button>
        </Modal.Footer>
        <Modal.Footer>
          <Button
            className="deleteStaffMemberButton"
            onClick={handleDeleteStaffMember}
            size="sm"
            variant="dark"
          >
            Delete staff member
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        className="nurseModal"
        centered
        show={showAddStaffMemberModal}
        onHide={() => {
          setShowAddStaffMemberModal(false);
        }}
      >
        <Modal.Header>
          <Modal.Title>Add staff member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <Form>
            <Form.Group
              className="mb-1"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label className="formLabelStaffPage">name</Form.Label>
              <Form.Control
                placeholder="name"
                onChange={(e) => {
                  handleUpdateName(e);
                }}
                as="textarea"
                rows={1}
              />
              <Form.Label className="formLabelStaffPage">
                phone number
              </Form.Label>
              <Form.Control
                placeholder="phone number"
                onChange={(e) => {
                  handleUpdatePhoneNumber(e);
                }}
                as="textarea"
                rows={1}
              />
              <Form.Label className="formLabelStaffPage">
                day or night
              </Form.Label>
              <Form.Control
                placeholder="night"
                onChange={(e) => {
                  handleUpdateDayShift(e);
                }}
                as="textarea"
                rows={1}
              />
              <Form.Label className="formLabelStaffPage">Job</Form.Label>
              <Form.Control
                placeholder="RN"
                onChange={(e) => {
                  handleUpdateJob(e);
                }}
                as="textarea"
                rows={1}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="cancelButtonStaffModal"
            onClick={() => {
              setShowAddStaffMemberModal(false);
            }}
            variant="danger"
          >
            Cancel
          </Button>
          <Button onClick={handleCreateStaffMember} variant="primary">
            Create staff member
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="table-container2">
        <Table striped bordered hover>
          <thead id="theadStaffTable">
            <tr>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Job</th>
              <th>Last Floated</th>
            </tr>
          </thead>
          <tbody>
            {sortObjectsByName(data).map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "even-row2" : "odd-row2"}
                onClick={() => handleRowClick(item)}
              >
                <td>
                  {item.dayShift ? (
                    <i className="fa-solid fa-sun fa-sun2"></i>
                  ) : (
                    <i className="fa-solid fa-moon fa-moon2"></i>
                  )}
                  {item.name}
                </td>
                <td>{item.phoneNumber}</td>
                <td>{item.jobType}</td>
                <td>{item.lastFloated}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default Staff;
