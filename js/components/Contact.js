import React from "react";
import { Button, Grid, Row, Col, ControlLabel, FormGroup, FormControl, HelpBlock, Panel } from 'react-bootstrap';
import RegistrationComponent from "../components/RegistrationComponent";
import axios from "../api/axiosInstance";
import {contactAPI} from "../api/apiURLs";
import LoadingScreen from "../components/LoadingScreen";

const FieldGroup = ({ id, label, help, ...props }) => {
    return (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
};

const ConfirmationPanel = () => (
    <Grid className={"minimum-height nice-background"}>
        <Row>
            <Col lg={10} md={10} lgOffset={1} mdOffset={1}>
                <Panel bsStyle="success">
                    <Panel.Heading>
                        <Panel.Title componentClass="h3">Спасибо, что связались с нами.</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        <div className={'order-confirmation'}>
                            <p>Мы вам ответим в течение 1 часа.</p>
                            <p>Удачного дня.</p>
                        </div>
                    </Panel.Body>
                </Panel>
            </Col>
        </Row>
    </Grid>
);

class Contact extends React.Component{

    state = {
        error: undefined,
        contacted: false,
        isLoading: false
    };

    componentDidMount(){
        // if(window.sessionStorage.getItem("contacted")){
        //     this.setState(() => ({contacted: true}));
        // }
    }

    handleFormSubmit = (e) => {
        e.preventDefault();
        const name = e.target.fullname.value.trim();
        const email = e.target.email.value.trim();
        const message = e.target.message.value.trim();

        if(name && email && message){
            if(!RegistrationComponent.emailValidation(email)){
                this.setState(() => ({error: "Неправильный email."}));
            }
            else{
                this.setState(() => ({isLoading: true}));
                const data = {
                    name,
                    email,
                    message
                };
                axios.post(contactAPI, data)
                    .then(() => {
                        // window.sessionStorage.setItem("contacted", true);
                        this.setState(() => ({contacted: true, error: undefined, isLoading: false}));
                    })
                    .catch((error) => {
                        console.log(error);
                        const message = error.response.data;
                        this.setState(() => ({error: message, isLoading: false}));
                    });
            }
        }
        else{
            this.setState(() => ({error: "Все поля обязательны."}));
        }
    };


    render(){

        const {error, contacted, isLoading} = this.state;

        if(contacted){
            return <ConfirmationPanel/>
        }

        if(isLoading){
            return <LoadingScreen/>
        }

        return (
            <Grid className={"minimum-height nice-background"}>
                <Row>
                    <Col lg={10} md={10} mdOffset={1} lgOffset={1}>
                        <h4>Свяжитесь с нами</h4>
                        <hr/>
                        {error && <p className={"error-message"}>{error}</p>}
                        <form onSubmit={this.handleFormSubmit}>
                            <FieldGroup
                                id="formControlsName"
                                type="text"
                                label="Введите полное имя"
                                placeholder="..."
                                name={"fullname"}
                            />

                            <FieldGroup
                                id="formControlsEmail"
                                type="email"
                                label="E-MAIL"
                                placeholder="..."
                                name={"email"}
                            />

                            <FormGroup controlId="formControlsTextarea">
                                <ControlLabel>Сообщение (или введите ваш номер телефона и мы с вами свяжемся)</ControlLabel>
                                <FormControl componentClass="textarea" placeholder="..." name={"message"} rows={4} />
                            </FormGroup>

                            <span className={'contact-message'}>
                                <Button type="submit" bsStyle={"primary"} className={"btn-sm"}>Отправить</Button>
                                {/*<Button type="reset" className={"btn-sm left-margin-pointfive"}>Reset</Button>*/}
                            </span>
                            <div className={'contact-message'}>
                            </div>
                        </form>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

export default Contact;