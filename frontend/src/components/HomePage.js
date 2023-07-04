import React, { Component } from 'react';
import RoomJoinPage from './RoomJoinPage';
import CreateRoomPage from './CreateRoomPage';
import { BrowserRouter as Router, Routes, Route, Link, Redirect } from "react-router-dom";
import Room from './Room';

export default class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <Router>
            <Routes>
                <Route exact path='/' element={<p>This is the home page</p>} />
                <Route exact path='/join' element={<RoomJoinPage />}></Route>
                <Route exact path='/create' element={<CreateRoomPage />}></Route>
                <Route exact path='/room/:roomCode' element={<Room />}></Route>
            </Routes>
        </Router>
        );
    }
}