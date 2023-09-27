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

function Staff() {
  const [data, setData] = useState([]);

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
      <h2 className="staffTitle">Staff</h2>
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
                // onClick={() => handleItemClick(item.name)}
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
