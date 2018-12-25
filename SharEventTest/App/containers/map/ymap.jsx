import React, { Component } from 'react';
import Point from './Point.jsx'
import YMap from './Map.jsx';
import queryString from 'query-string'

import 'isomorphic-fetch';



export default class YandexApiMap extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            eventId: 1, 
            event: '',
            center: [55.76, 37.64],
            points: [],
            users: [],
            addedLogin: ''
        };


        /*Я дико извиняюсь, но это сделано, чтобы можно было нормально разбить массив с координатами на 2 отдельных поля. 
         Можно конечно постараться и обойтись без него, но придется переписывать половину функций*/
        this.pointsToSend = {
            lats: [],
            longs: []
        }
    }


    //Тут костыль с EventId. Подробнее в EventController.cs - 50 строка
    componentDidMount() {

        const values = queryString.parse(this.props.location.search)
        this.state.eventId = values.eventId // EventId из ссылки

        let queryTrailer = '?eventId=' + this.state.eventId;
        fetch(constants.eventById + queryTrailer)
            .then(response => response.json())
            .then(data => {
                const results = data.points.map(x => {

                    return {
                        coord: new Array(x.pointLatitiude, x.pointLongitude)
                    }
                })
                this.setState({ points: results });
                this.setState({ event: data });
                console.log(data);
            });

        this.updateUserInfo();
        
    }

    updateUserInfo() {
        let queryTrailer = '?eventId=' + this.state.eventId;
        fetch(constants.usersByEventId + queryTrailer)
            .then(response => response.json())
            .then(data => {
                this.setState({ users: data });
                console.log(data);
            });
    }

    updateInputValue(value) {
        this.setState({
            addedLogin: value
        });
    }

    addUser() {
        let queryTrailer = '?login=' + this.state.addedLogin + '&eventId=' + this.state.eventId;
        fetch(constants.member + queryTrailer)
            .then((response) => {
            this.updateUserInfo();
            this.setState({ addedLogin: '' })
        });
            
    }

    changeMapCenter(coord) {
        this.setState({
            center: coord
        })
    }

    changePoint(id, val) {
        let points = this.state.points;
        points[id]['coord'] = val;

        this.setState({
            points: points
        })
    }

    addPoint(coord) {
        this.setState({
            points: this.state.points.concat([{
                coord: coord //сорян за такое
            }])
        })
    }

    removePoint(id) {
        let points = this.state.points;
        points.splice(id, 1);

        this.setState({
            points: points
        })
    }

    parseIntoFormat()
    {

        this.pointsToSend.lats = []
        this.pointsToSend.longs = []

        for (var i = 0,len = this.state.points.length; i < len; i++)
        {
            this.pointsToSend.lats[i]=this.state.points[i].coord[0];
            this.pointsToSend.longs[i]=this.state.points[i].coord[1];

        }
        console.log(this.pointsToSend)
        console.log(this.state.eventId)
    }

    submitData = () => {
        fetch(constants.addPointsToEvent,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({ EventId: this.state.eventId, PointLatitiudeList: this.pointsToSend.lats, PointLongitudeList: this.pointsToSend.longs })
            }).then((response) => {
                console.log(response.body); this.setState()
            });
    }
   
    render() {
        const pointsList = this.state.points.map((item, i) =>
            <Point key={i} id={i} name={item.coord} removePoint={(i) => this.removePoint(i)} />
        );
        

        let usersList = this.state.users.map((item, i) => {
            return (
                <tr key={i}>
                    <td> {item.login} </td>
                    <td> {item.password == 'True' ? 'Подтвердил участие' : 'Ожидание подтверждения'} </td>
                </tr>
            );
        })

        let eventData = this.state.event;
       

        return (
            <div className="event-container">
                <div className="row">
                    <div className="event-points-table">
                        <div className="single-service">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Номер точки</th>
                                        <th>Описание</th>
                                        <th> </th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {pointsList}
                                </tbody>
                            </table>
                            <button onClick={() => { this.parseIntoFormat(), this.submitData(); }}> Обновить точки в базе</button>
                        </div>
                    </div>
                    <div className="event-map">
                        <div className="single-service">
                            <YMap 
                                center={this.state.center}
                                points={this.state.points}
                                changePoint={this.changePoint.bind(this)}
                                addPoint={this.addPoint.bind(this)}
                                changeMapCenter={this.changeMapCenter.bind(this)}
                                />
                        </div>
                    </div>
                </div>

                <div className="row2">
                    <div className="event-main-info">
                        <div className="single-service">
                            <h1> Событие </h1>
                            Название:
                            <h2> {eventData.eventName} </h2>
                            Описание:
                            <h2> {eventData.eventDescription} </h2>
                        </div>    
                    </div>

                    <div className="event-members">
                        <div className="single-service">
                            <h1> Участники </h1>
                            <div className="row3">
                                <div className="users-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Логин участника</th>
                                                <th>Статус</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {usersList}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="add-user-input"> 
                                    <h5>Добавить нового участника</h5>
                                    <input type="input" value={this.state.addedLogin} onChange={(e) => this.updateInputValue(e.target.value)} placeholder="username" />
                                    <input type="button" value="Добавить" onClick={() => this.addUser()} />
                                </div>
                            </div>
                        </div>    
                    </div>
                </div>
            </div>           
        );
    }
};