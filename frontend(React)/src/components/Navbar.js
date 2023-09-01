import React,{ useEffect, useState} from 'react';
import {NavLink} from "react-router-dom";

const Navbar = ({messages}) => {
    const [hasUnreadMessages, setHasUnreadMessages] = useState(false); // State to track unread messages

    useEffect(() => {
    if (messages && messages.length > 0) {
        setHasUnreadMessages(true);
    }
    }, [messages]);

    return ( 
        <nav className="navbar">
            <h1>Secret Survey</h1>
            <div className="NavLinks">
                <NavLink exact to="/" activeClassName="active-NavLink">Home</NavLink>
                <NavLink to="/create" activeClassName="active-NavLink" >New Survey</NavLink>
                <NavLink to="/viewAnsweredSurveys" activeClassName="active-NavLink" >View Answered Surveys</NavLink>
                <NavLink to="/researcherDash" activeClassName="active-NavLink" >Researcher Dashboard</NavLink>
                <NavLink to="/findParticipants" activeClassName="active-NavLink" >Search Participants</NavLink>
                <NavLink to="/messages" className="message-icon"  activeClassName="active-NavLink">
                    <div className="svg-container">
                    <div className="dot-container">
                        <span className={`dot${hasUnreadMessages ? ' active' : ''}`} />
                    </div>
                    <svg fill="#000000" height="24px" width="24px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 455.862 455.862" xmlSpace="preserve">
                        <path d="M441.088,63.154H14.774C6.615,63.154,0,69.77,0,77.93v300.003c0,8.16,6.615,14.775,14.774,14.775h426.313
                            c8.16,0,14.775-6.614,14.775-14.775V77.93C455.862,69.77,449.248,63.154,441.088,63.154z M403.394,316.659
                            c6.256,5.43,6.926,14.903,1.497,21.16c-5.43,6.254-14.901,6.928-21.161,1.496c-3.876-3.364-101.683-88.252-105.452-91.523
                            l-40.515,35.164c-2.82,2.448-6.326,3.672-9.832,3.672s-7.012-1.224-9.832-3.672l-40.515-35.164
                            c-3.77,3.272-101.576,88.159-105.452,91.523c-6.257,5.43-15.731,4.761-21.161-1.496c-5.43-6.257-4.76-15.73,1.497-21.16
                            L154.7,227.93L52.468,139.203c-6.256-5.43-6.926-14.903-1.497-21.16c5.431-6.256,14.904-6.928,21.161-1.496
                            c5.07,4.4,146.594,127.231,155.799,135.22c7.972-6.919,150.305-130.451,155.799-135.22c6.256-5.431,15.731-4.762,21.161,1.496
                            c5.43,6.257,4.76,15.731-1.497,21.16L301.162,227.93L403.394,316.659z"/>
                    </svg>
                </div>
                </NavLink>
            </div>
        </nav>
     );
}
 
export default Navbar;