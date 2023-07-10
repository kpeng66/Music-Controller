import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Button, Typography } from '@mui/material';
import CreateRoomPage from './CreateRoomPage';
import MusicPlayer from './MusicPlayer';

const Room = () => {
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
    const [song, setSong] = useState({});

    const interval = useRef(null);

    const { roomCode } = useParams();
    const navigate = useNavigate();

    const updateRoomDetails = (data) => {
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
    }

    const getCurrentSong = () => {
        fetch('/spotify/current-song').then((response) => {
            if (!response.ok) {
                return {};
            } else {
                return response.json();
            }
        }).then((data) => {
            setSong(data);
            console.log(data);
        });
    }

    const authenticateSpotify = () => {
        fetch('/spotify/is-authenticated').then((response) => response.json()).then((data) => {
            setSpotifyAuthenticated(data.status);
            if (!data.status) {
                fetch('/spotify/get-auth-url').then((response) => response.json()).then((data) => {
                    window.location.replace(data.url);
                });
            }
        });
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
        getCurrentSong();

    }, [roomCode]);

    useEffect(() => {
        if (isHost) {
            authenticateSpotify();
        }
    }, [isHost]);

    useEffect(() => {
        interval.current = setInterval(getCurrentSong, 1000);
        return () => clearInterval(interval.current);
    }, []);

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
            <MusicPlayer {...song}/>
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


