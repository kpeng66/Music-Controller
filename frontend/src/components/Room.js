import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Button, Typography } from '@mui/material';
import CreateRoomPage from './CreateRoomPage';

const Room = () => {
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const { roomCode } = useParams();
    const navigate = useNavigate();

    const updateRoomDetails = (data) => {
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
    }

    const leaveButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json'}
        };
        fetch('/api/leave-room', requestOptions).then((_response) => {
            navigate('/');
        });

    };

    const updateShowSettings = (value) => {
        setShowSettings(value);
    };

    const renderSettings = () => {
        return (<Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <CreateRoomPage 
                update={true} 
                votesToSkip={votesToSkip} 
                guestCanPause={guestCanPause} 
                roomCode={roomCode}
                updateRoomDetails={updateRoomDetails}
                />
            </Grid>
            <Grid item xs={12} align="center">
            <Button variant="contained" color="secondary" onClick={() => updateShowSettings(false)}>
                    Close
                </Button>
            </Grid>
        </Grid> );
    };

    const renderSettingsButton = () => {
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={() => updateShowSettings(true)}>
                    Settings
                </Button>
            </Grid>
        );
    };

    useEffect(() => {
        const getRoomDetails = () => {
            fetch('/api/get-room' + '?code=' + roomCode).then((response) => response.json())
            .then((data) => {
                setVotesToSkip(data.votes_to_skip);
                setGuestCanPause(data.guest_can_pause);
                setIsHost(data.is_host);
            });
        };

        getRoomDetails();

    }, [roomCode]);

    if (showSettings) {
        return renderSettings();
    }
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Code: {roomCode}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
            <Typography variant="h6" component="h4">
                    Votes: {votesToSkip}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
            <Typography variant="h6" component="h4">
                    Guest Can Pause: {guestCanPause.toString()}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
            <Typography variant="h6" component="h4">
                    Host: {isHost.toString()}
                </Typography>
            </Grid>
            {isHost ? renderSettingsButton() : null}
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick={leaveButtonPressed}>
                    Leave Room
                </Button>
            </Grid>
        </Grid>
    );
}

export default Room;


