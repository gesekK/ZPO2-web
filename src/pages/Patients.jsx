import React, { Component } from 'react';
import { ref, get, getDatabase } from 'firebase/database';
import '../styles/Patients.css'
import {Sidebar} from "react-pro-sidebar";

class Patients extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patientsData: [],
        };
    }

    componentDidMount() {
        this.fetchPatients();
    }

    fetchPatients = async () => {
        const db = getDatabase();
        const usersRef = ref(db, 'Users');

        try {
            const snapshot = await get(usersRef);
            if (snapshot.exists()) {
                const patientsList = [];
                snapshot.forEach((childSnapshot) => {
                    const userUID = childSnapshot.key;
                    const userData = childSnapshot.val();
                    const { userName, surname, dateOfBirth, email } = userData; // Adjust fields according to your database structure

                    const patient = {
                        userUID,
                        username: userName || '',
                        surname: surname || '',
                        dateOfBirth: dateOfBirth || '',
                        email: email || '',
                        // Add more fields as needed
                    };

                    patientsList.push(patient);
                });
                this.setState({ patientsData: patientsList });
            }
        } catch (error) {
            console.error('Error fetching patients: ', error);
        }
    };

    render() {
        const { patientsData } = this.state;

        return (

            <div>
                <h1>Patients List</h1>
                <table>
                    <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Date of Birth</th>
                        <th>Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {patientsData.map((patient, index) => (
                        <tr key={index}>
                            <td>{patient.username}</td>
                            <td>{patient.surname}</td>
                            <td>{patient.dateOfBirth}</td>
                            <td>{patient.email}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Patients;
