import React, { Component } from 'react';
import { YMaps, Map, Placemark, Polyline } from 'react-yandex-maps';


class YMap extends Component {



    changePoint(e, i) {
        this.props.changePoint(i, e.originalEvent.target.geometry._coordinates);
    }


    changeMapCenter(e) {
        this.props.changeMapCenter(e.originalEvent.target._yandexState._model.center);
    }

    addPoint(e) {
        this.props.addPoint(e.get('coords'));
    }


    render() {

       
        // это пока не юзается, но потом будет отмечать метки
        const pointsList = this.props.points.map((item, i) =>
            <Placemark
                key={i}
                geometry={
                    item.coord
                }
                properties={{
                    balloonContent: 'darov',
                    balloonContentHeader: 'header',
                    hintContent: 'hint',
                    iconContent: i
                }}
                options={{
                    preset: "islands#darkOrangeIcon",
                    draggable: true,
                    openBalloonOnClick: true
                }}

                onDragEnd={(e) => this.changePoint(e, i)}
            />
        );

     

        const mapState =
        {
            center: this.props.center,
            zoom: 10
        }

        return (
            <YMaps>
                <Map state={mapState} onActionEnd={this.changeMapCenter.bind(this)} onClick={this.addPoint.bind(this)} width="auto">
                    {pointsList}
                </Map>
            </YMaps>
            
        )
    };

}

export default YMap;
