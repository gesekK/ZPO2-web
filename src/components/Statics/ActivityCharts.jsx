import React, {useState, useEffect, useRef} from 'react';
import { Card, CardContent, Typography, MenuItem, Select, FormControl, InputLabel } from '@material-ui/core';
import {auth, db, firestoreDb} from '../../firebase';
import { get, ref } from 'firebase/database';
import { getDocs, collection } from "firebase/firestore";
import {Line} from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import './ActivityCharts.css'

const ActivityCharts = () => {
    const [selectedUser, setSelectedUser] = useState('');
    const [users, setUsers] = useState([]);
    const [glucoseChartData, setGlucoseChartData] = useState({});
    const [insulinChartData, setInsulinChartData] = useState({});
    const [glucoseChartDataM, setGlucoseChartDataM] = useState({});
    const [insulinChartDataM, setInsulinChartDataM] = useState({});
    const glucoseChartRef = useRef(null);


    const handleUserChange = (event) => {
        setSelectedUser(event.target.value);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersRef = ref(db, 'Users');
                const snapshot = await get(usersRef);

                if (snapshot.exists()) {
                    const usersList = [];
                    snapshot.forEach((childSnapshot) => {
                        const userId = childSnapshot.key;
                        const userName = childSnapshot.val().userName;
                        const userEmail = childSnapshot.val().email; // Pobierz adres email użytkownika
                        usersList.push({id: userId, name: userName, email: userEmail});
                    });
                    setUsers(usersList);
                    setSelectedUser(usersList[0]?.email); // Ustaw pierwszy adres email użytkownika jako domyślny
                } else {
                    console.log('Snapshot does not exist');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (!selectedUser) return;
        calculateWeeklyAverage();
        calculateMonthlyAverage();
    }, [selectedUser]);


    const calculateWeeklyAverage = async () => {
        const averages_gl = [];
        const new_averages_gl = [];
        const averages_in = [];
        const new_averages_in = [];


        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const formattedDate = date.toLocaleDateString('pl-PL', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).replace(/\./g, '_');

            try {
                const glucoseRef = collection(firestoreDb, 'results', selectedUser, formattedDate);
                const docSnap = await getDocs(glucoseRef);

                let glucoseSum = 0;
                let insulinSum = 0
                let count = 0;

                docSnap.forEach((hourDoc) => {
                    const glucoseData = hourDoc.data()?.glucose || 0;
                    const insulinData = hourDoc.data()?.insulin || 0;

                    if (!isNaN(glucoseData) && !isNaN(insulinData)) {
                        glucoseSum += glucoseData;
                        insulinSum += insulinData;
                        count++;
                    }
                });

                const average_gl = count > 0 ? glucoseSum / count : 0;
                averages_gl.push(average_gl);

                const average_in = count > 0 ? insulinSum / count : 0;
                averages_in.push(average_in);

            } catch (error) {
                console.error(`Error calculating average for ${formattedDate}:`, error);
            }

        }

        // Remove averages that are zero
        const validAverages = averages_gl.filter((avg) => avg !== 0);



        // Calculate the final average

        while (averages_gl.length < 7 - validAverages.length) {
            averages_gl.unshift(0); // Add zeros for days without data
            averages_in.unshift(0);
        }

// Add valid averages at the end in reverse order
        for (let i = averages_gl.length - 1; i >= 0; i--) {
            new_averages_gl.push(averages_gl[i]);
        }

        for (let i = averages_in.length - 1; i >= 0; i--) {
            new_averages_in.push(averages_in[i]);
        }

        // Create labels for chart (days)
        const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];

        // Create dataset for the chart
        const dataset = {
            label: 'Weekly Average Glucose',
            data: new_averages_gl,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
        };
        const datasetIn = {
            label: 'Weekly Average Insulin',
            data: new_averages_in,
            fill: false,
            borderColor: 'rgba(91,141,194,0.77)',
            tension: 0.1,
        };


        setGlucoseChartData({ labels, datasets: [dataset] });
        setInsulinChartData({ labels, datasets: [datasetIn] });
    };

    useEffect(() => {
        // Destroy the chart when selectedUser changes
        if (glucoseChartRef.current && glucoseChartRef.current.chartInstance) {
            glucoseChartRef.current.chartInstance.destroy();
        }
    }, [selectedUser]);

    const calculateMonthlyAverage = async () => {
        const averages_gl = [];
        const new_averages_gl = [];
        const averages_in = [];
        const new_averages_in = [];



        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const formattedDate = date.toLocaleDateString('pl-PL', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).replace(/\./g, '_');

            try {
                const glucoseRef = collection(firestoreDb, 'results', selectedUser, formattedDate);
                const docSnap = await getDocs(glucoseRef);

                let glucoseSum = 0;
                let insulinSum = 0;
                let count = 0;

                docSnap.forEach((hourDoc) => {
                    const glucoseData = hourDoc.data()?.glucose || 0;
                    const insulinData = hourDoc.data()?.insulin || 0;

                    if (!isNaN(glucoseData) && !isNaN(insulinData)) {
                        glucoseSum += glucoseData;
                        insulinSum += insulinData;
                        count++;
                    }
                });

                const average_gl = count > 0 ? glucoseSum / count : 0;
                averages_gl.push(average_gl);

                const average_in = count > 0 ? insulinSum / count : 0;
                averages_in.push(average_in);
            } catch (error) {
                console.error(`Error calculating average for ${formattedDate}:`, error);
            }
        }

        // Remove averages that are zero
        const validAverages = averages_gl.filter((avg) => avg !== 0);

        // Calculate the final average

        while (averages_gl.length < 7 - validAverages.length) {
            averages_gl.unshift(0); // Add zeros for days without data
        }
        while (averages_in.length < 7 - validAverages.length) {
            averages_in.unshift(0); // Add zeros for days without data
        }

// Add valid averages at the end in reverse order
        for (let i = averages_gl.length - 1; i >= 0; i--) {
            new_averages_gl.push(averages_gl[i]);
        }
        for (let i = averages_in.length - 1; i >= 0; i--) {
            new_averages_in.push(averages_in[i]);
        }


        // Create labels for chart (days)
        const labels = ['Day 1', '', '', '', '', '', '', '','','','','','','', 'Day 15', '', '', '', '', '', '', '','','','','','','', '', 'Day 30'];

        // Create dataset for the chart
        const dataset = {
            label: 'Monthly Average Glucose',
            data: new_averages_gl,
            fill: false,
            borderColor: 'rgb(38,101,166)',
            tension: 0.1,
        };
        const datasetIn = {
            label: 'Monthly Average Insulin',
            data: new_averages_in,
            fill: false,
            borderColor: 'rgba(177,210,255,0.97)',
            tension: 0.1,
        };


        setGlucoseChartDataM({ labels, datasets: [dataset] });
        setInsulinChartDataM({ labels, datasets: [datasetIn] });
    };

    useEffect(() => {
        // Destroy the chart when selectedUser changes
        if (glucoseChartRef.current && glucoseChartRef.current.chartInstance) {
            glucoseChartRef.current.chartInstance.destroy();
        }
    }, [selectedUser]);



    return (
        <div>
            <FormControl>
                <InputLabel id="user-select-label">Charts</InputLabel>
                <Select className='selec_user'
                        labelId="user-select-label"
                        id="user-select"
                        value={selectedUser}
                        onChange={handleUserChange}
                >
                    {users.map((user) => (
                        <MenuItem key={user.email} value={user.email}>
                            {user.email}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <div className='charts'>
            <div className='glucose-chart-container' >
                <CardContent>
                    <Typography >Weekly Glucose Level</Typography>
                    <div style={{ height: '200px', width: '400px' }}>
                        {glucoseChartData?.labels && glucoseChartData?.datasets ? (
                            <Line ref={glucoseChartRef} data={glucoseChartData} />
                        ) : (
                            <p>Brak danych do wyświetlenia</p>
                        )}
                    </div>
                </CardContent>
                <CardContent>
                    <Typography >Monthly Glucose Level</Typography>
                    <div style={{ height: '230px', width: '450px' }}>
                        {glucoseChartDataM?.labels && glucoseChartDataM?.datasets ? (
                            <Line ref={glucoseChartRef} data={glucoseChartDataM} />
                        ) : (
                            <p>Brak danych do wyświetlenia</p>
                        )}
                    </div>
                </CardContent>
            </div>

            <div className='glucose-chart-container' >
                <CardContent>
                    <Typography>Weekly Insulin Level</Typography>
                    <div style={{ height: '200px', width: '400px' }}>
                        {insulinChartData?.labels && insulinChartData?.datasets ? (
                            <Line ref={glucoseChartRef} data={insulinChartData} />
                        ) : (
                            <p>Brak danych do wyświetlenia</p>
                        )}
                    </div>
                </CardContent>
                <CardContent>
                    <Typography>Monthly Insulin Level</Typography>
                    <div style={{ height: '230px', width: '450px' }}>
                        {insulinChartDataM?.labels && insulinChartDataM?.datasets ? (
                            <Line ref={glucoseChartRef} data={insulinChartDataM} />
                        ) : (
                            <p>Brak danych do wyświetlenia</p>
                        )}
                    </div>
                </CardContent>
            </div>
            </div>
        </div>
    );
};

export default ActivityCharts;