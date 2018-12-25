import React from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Auth from '../../utilities/auth.js';
import { getEventsByCreator, getEventsByMember, getEventsRequestsToJoin } from './eventsListActions.jsx';

class EventsList extends React.Component {

    componentDidMount() {
        this.props.getEventsByCreator();
        this.props.getEventsByMember();
        this.props.getEventsRequestsToJoin();
    }

    acceptRequest = (eventId, ind) => {
        fetch(constants.acceptJoinRequest,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({ EventId: eventId, UserId:  Auth.getUserId() })
            }).then((response) => {
                this.props.getEventsByMember();
                this.props.getEventsRequestsToJoin();
            });
    }

    declineRequest = (eventId, ind) => {
        fetch(constants.declineJoinRequest,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({ EventId: eventId, UserId: Auth.getUserId() })
            }).then((response) => {
                this.props.getEventsByMember();
                this.props.getEventsRequestsToJoin();
            });
    }

    render() {
        let listCreator = this.props.eventsList.eventsByCreatorList.map(item => {
            return (
                <div key={item.eventId} className="event-preview">
                    <Link value="eventName" className="event-name-preview" to={`/map?eventId=${item.eventId}`}> {item.eventName} </Link>
                    <div className="event-description-preview"> {item.eventDescription} </div>
                </div>
            );
        });

        let listMember = this.props.eventsList.eventsByMemberList.map(item => {
            return (
                <div key={item.eventId} className="event-preview">
                    <Link value="eventName" to={`/map?eventId=${item.eventId}`}> {item.eventName} </Link>
                    <div className="event-description-preview"> {item.eventDescription} </div>
                </div>
            );
        })

        let requestsList = this.props.eventsList.eventsJoinRequests.map((item,i) => {
            return (
                <div key={item.eventId} className="event-preview">
                    <Link value="eventName" className="event-name-preview" to={`/map?eventId${item.eventId}`}> {item.eventName} </Link>
                    <div className="event-description-preview"> {item.eventDescription} </div>
                    <button className="accept" onClick={() => { this.acceptRequest(item.eventId, i); }} > Accept </button>
                    <button className="decline" onClick={() => { this.declineRequest(item.eventId, i); }}> Decline</button>
                    
                </div>
            );
        })

        return (
            <div className="events-list-container">
                <h1> Ваши события </h1>
                <div className="row">
                    <div className="col-event">
                        <div className="single-service">
                            <h2> Я создатель </h2>
                            {listCreator.length == 0 ? <h3> Вы не создали ни одного события. Создать новое событие можно в главном меню "Добавить событие" </h3>: ''}
                            {listCreator}
                        </div>
                    </div>
                    <div className="col-event">
                        <div className="single-service">
                            <h2> Я участник </h2>
                            {listCreator.length == 0 ? <h3> Вы не участвуете ни в одном событии </h3> : ''}
                            {listMember}
                        </div>
                    </div>
                    <div className="col-event">
                        <div className="single-service">
                            <h2> Входящие запросы </h2>
                            {requestsList.length == 0 ? <h3> Новых приглашений нет </h3> : ''}
                            {requestsList}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

let mapProps = (state) => {
    return {
        eventsList: state.eventsList
    }
}

let mapDispatch = (dispatch) => {
    return {
        getEventsByCreator: () => dispatch(getEventsByCreator()),
        getEventsByMember: () => dispatch(getEventsByMember()),
        getEventsRequestsToJoin: () => dispatch(getEventsRequestsToJoin())
    }
}

export default connect(mapProps, mapDispatch)(EventsList) 