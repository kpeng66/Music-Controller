import React, { useEffect, useState } from 'react';
import RoomJoinPage from './RoomJoinPage';
import CreateRoomPage from './CreateRoomPage';
import { Grid, Button, ButtonGroup, Typography } from '@mui/material';
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Room from './Room';

const HomePage = (props) => {
    const [roomCode, setRoomCode] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/user-in-room')
        .then((response) => response.json())
        .then((data) => {
            setRoomCode(data.code);
            if (data.code) {
                navigate(`/room/${data.code}`);
            }
        });
    }, [navigate]);

    const renderHomePage = () => {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h3" component="h3">
                        House Party
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" to='/join' component={ Link }>
                            Join a Room
                        </Button>
                        <Button color="secondary" to='/create' component={ Link }>
                            Create a Room
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    }

    return (
            <Routes>
                <Route exact path='/' element={renderHomePage()}/>
                <Route exact path='/join' element={<RoomJoinPage />}/>
                <Route exact path='/create' element={<CreateRoomPage />}/>
                <Route exact path='/room/:roomCode' element={<Room />}/>
            </Routes>
    );
}

export default HomePage;
