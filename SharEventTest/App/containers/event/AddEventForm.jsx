import React from 'react';
import Auth from '../../utilities/auth'


export default class AddEventForm extends React.Component{

    constructor(props) {
        super(props);
        this.state =
        {
            adminId: Auth.getUserId(),
            eventName: '',
            eventDescription: '',
            eventUrl: ''
         
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        alert('Название события: ' + this.state.eventName + '\n Описание события: ' + this.state.eventDescription + '\n Ссылка события: ' + this.state.eventUrl);
        event.preventDefault();
    }

    submitData = () => {
        fetch(constants.newevent,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(this.state)
            }).then((response) => { console.log(response.body); this.setState() });
       

    }

    render() {
        return (
         
            <div className='popup'>
                <div className='popup-inner'>
                    <form onSubmit={this.handleSubmit}>
                        
                        <h3>Название события </h3>
                        <input type="text" placeholder='Event name' name="eventName" value={this.state.eventName} onChange={this.handleChange} />

                        <h3>Описание </h3>
                        <textarea name="eventDescription" placeholder="Description" value={this.state.eventDescription} onChange={this.handleChange} />
                        
                        <div className='submitForm'>
                            <input type="submit" value="Добавить" onClick={() => {
                                this.submitData();
                                }} />
                        </div>
                        <button onClick={this.props.closePopup}>Закрыть</button>
                    </form> 
                </div>
            </div>


        );
    }
};