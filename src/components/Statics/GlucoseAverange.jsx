import React, {useState, useEffect, useRef} from 'react';
import { Card, CardContent, Typography, MenuItem, Select, FormControl, InputLabel } from '@material-ui/core';
import {auth, db, firestoreDb} from '../../firebase';
import { get, ref } from 'firebase/database';
import { getDocs, collection } from "firebase/firestore";
import {Line} from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import './GlucoseAverage.css'

const GlucoseAverages = () => {
    const [selectedUser, setSelectedUser] = useState('');
    const [users, setUsers] = useState([]);
    const [todaysAverage, setTodaysAverage] = useState(0);
    const [weeklyAverage, setWeeklyAverage] = useState(0);
    const [monthlyAverage, setMonthlyAverage] = useState(0);
    const [glucoseChartData, setGlucoseChartData] = useState({});
    const [glucoseChartDataM, setGlucoseChartDataM] = useState({});
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
        calculateTodaysAverage();
        calculateWeeklyAverage();
        calculateMonthlyAverage();
    }, [selectedUser]);

    const calculateTodaysAverage = async () => {
        const today = new Date().toLocaleDateString('pl-PL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\./g, '_');

        try {
            const glucoseRef = collection(firestoreDb, 'results', selectedUser, today);
            const docSnap = await getDocs(glucoseRef);

            let glucoseSum = 0;
            let count = 0;

            docSnap.forEach((hourDoc) => {
                const glucoseData = hourDoc.data()?.glucose || 0;

                if (!isNaN(glucoseData)) {
                    glucoseSum += glucoseData;
                    count++;
                }
            });

            const average = count > 0 ? glucoseSum / count : 0;
            setTodaysAverage(average);
        } catch (error) {
            console.error('Error calculating today\'s average:', error);
        }
    };

    const calculateWeeklyAverage = async () => {
        const averages = [];
        const new_averages = [];


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
                let count = 0;

                docSnap.forEach((hourDoc) => {
                    const glucoseData = hourDoc.data()?.glucose || 0;

                    if (!isNaN(glucoseData)) {
                        glucoseSum += glucoseData;
                        count++;
                    }
                });

                const average = count > 0 ? glucoseSum / count : 0;
                averages.push(average);

            } catch (error) {
                console.error(`Error calculating average for ${formattedDate}:`, error);
            }

        }

        // Remove averages that are zero
        const validAverages = averages.filter((avg) => avg !== 0);

        // Calculate the final average
        const finalAverage = validAverages.length > 0 ? validAverages.reduce((acc, val) => acc + val, 0) / validAverages.length : 0;

        while (averages.length < 7 - validAverages.length) {
            averages.unshift(0); // Add zeros for days without data
        }

// Add valid averages at the end in reverse order
        for (let i = averages.length - 1; i >= 0; i--) {
            new_averages.push(averages[i]);
        }

        // Create labels for chart (days)
        const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];

        // Create dataset for the chart
        const dataset = {
            label: 'Weekly Average',
            data: new_averages,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
        };

        console.log('Data: ', averages)
        console.log('Averages:', validAverages);
        console.log('Final Average:', finalAverage);

        setGlucoseChartData({ labels, datasets: [dataset] });
        setWeeklyAverage(finalAverage);
    };

    useEffect(() => {
        // Destroy the chart when selectedUser changes
        if (glucoseChartRef.current && glucoseChartRef.current.chartInstance) {
            glucoseChartRef.current.chartInstance.destroy();
        }
    }, [selectedUser]);

    const calculateMonthlyAverage = async () => {
        const averages = [];
        const new_averages = []


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
                let count = 0;

                docSnap.forEach((hourDoc) => {
                    const glucoseData = hourDoc.data()?.glucose || 0;

                    if (!isNaN(glucoseData)) {
                        glucoseSum += glucoseData;
                        count++;
                    }
                });

                const average = count > 0 ? glucoseSum / count : 0;
                averages.push(average);
            } catch (error) {
                console.error(`Error calculating average for ${formattedDate}:`, error);
            }
        }

        // Remove averages that are zero
        const validAverages = averages.filter((avg) => avg !== 0);

        // Calculate the final average
        const finalAverage = validAverages.length > 0 ? validAverages.reduce((acc, val) => acc + val, 0) / validAverages.length : 0;

        while (averages.length < 7 - validAverages.length) {
            averages.unshift(0); // Add zeros for days without data
        }

// Add valid averages at the end in reverse order
        for (let i = averages.length - 1; i >= 0; i--) {
            new_averages.push(averages[i]);
        }

        // Create labels for chart (days)
        const labels = ['Day 1', '', '', '', '', '', '', '','','','','','','', 'Day 15', '', '', '', '', '', '', '','','','','','','', '', 'Day 30'];

        // Create dataset for the chart
        const dataset = {
            label: 'Monthly Average',
            data: new_averages,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
        };

        console.log('Averages:', validAverages);
        console.log('Final Average:', finalAverage);

        setGlucoseChartDataM({ labels, datasets: [dataset] });
        setMonthlyAverage(finalAverage);
    };

    useEffect(() => {
        // Destroy the chart when selectedUser changes
        if (glucoseChartRef.current && glucoseChartRef.current.chartInstance) {
            glucoseChartRef.current.chartInstance.destroy();
        }
    }, [selectedUser]);


    const calculateAverages = async () => {
        await calculateTodaysAverage();
        await calculateWeeklyAverage();
        await calculateMonthlyAverage();
    };


    return (
        <div>
            <FormControl>
                <InputLabel id="user-select-label">Dashboard</InputLabel>
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
            <div className='averages-cv'>
            <Card>
                <CardContent className='average-today'>
                    <Typography className='custom-text-style'>Glucose Today</Typography>
                    <Typography className='values'>{todaysAverage}</Typography>
                </CardContent>
            </Card>

            <Card>
                <CardContent className='average-week'>
                    <Typography className='custom-text-style'>Glucose Last 7 Days</Typography>
                    <Typography className='values'>{weeklyAverage}</Typography>
                </CardContent>
            </Card>


            <Card>
                <CardContent className='average-month'>
                    <Typography className='custom-text-style'>Glucose Monthly</Typography>
                    <Typography className='values'>{monthlyAverage}</Typography>
                </CardContent>
            </Card>
        </div>

            <div className='glucose-chart-container' >
            <CardContent>
                <Typography className='custom-text-style_ch'>Weekly Glucose Level</Typography>
                <div style={{ height: '300px', width: '520px' }}>
                    {glucoseChartData?.labels && glucoseChartData?.datasets ? (
                        <Line ref={glucoseChartRef} data={glucoseChartData} />
                    ) : (
                        <p>Brak danych do wyświetlenia</p>
                    )}
                </div>
            </CardContent>
            <CardContent>
                <Typography className='custom-text-style_ch'>Monthly Glucose Level</Typography>
                <div style={{ height: '300px', width: '550px' }}>
                    {glucoseChartDataM?.labels && glucoseChartDataM?.datasets ? (
                        <Line ref={glucoseChartRef} data={glucoseChartDataM} />
                    ) : (
                        <p>Brak danych do wyświetlenia</p>
                    )}
                </div>
            </CardContent>
            </div>
        </div>
    );
};

export default GlucoseAverages;