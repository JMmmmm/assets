import React from 'react';
import { Button, Grid, Row, Col, ControlLabel, FormGroup, FormControl, Panel, HelpBlock } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import axios from "../api/axiosInstance";
import {getUserAPI, registerAPI} from "../api/apiURLs";
import {loginUser, logoutUser} from "../actions/authentication";
import {ACCESS_TOKEN} from "../api/strings";
import LoadingScreen from "../components/LoadingScreen";
import { connect } from 'react-redux';

const s = "success";

class RegistrationComponent extends React.Component{

    state = {
        usernameValidation: null,
        passwordValidation: false,
        fullNameValidation: null,
        address1: '',
        address2: '',
        city: '',
        stateName: '',
        zip: '',
        phone: '',
        addressValidation: null,
        cityValidation: null,
        zipValidation: null,
        phoneValidation: null,
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        isLoading: false,
        errors: []
    };

    componentDidMount(){
        if(window.localStorage.getItem(ACCESS_TOKEN) !== null){
            // means the user is already logged in, check if it is valid
            this.setState(() => ({isLoading: true}));
            const access_token = window.localStorage.getItem(ACCESS_TOKEN);
            const headers = {Accept: "application/json", Authorization: `Bearer ${access_token}`};
            axios.get(getUserAPI, {headers})
                .then((response) => {
                    this.props.dispatch(loginUser());
                    this.props.history.push("/");
                })
                .catch((error) => {
                    window.localStorage.removeItem(ACCESS_TOKEN);
                    this.props.dispatch(logoutUser());
                    this.setState(() => ({isLoading: false}));
                });
        }
    }

    passwordChange = (e) => {
        const password = e.target.value;
        const confirmPassword = this.state.confirmPassword;
        if(confirmPassword.length > 0 && password !== confirmPassword){
            this.setState(() => ({passwordValidation: true, password}))
        }
        else{
            this.setState(() => ({passwordValidation: false, password}))
        }
    };

    confirmPasswordChange = (e) => {
        const confirmPassword = e.target.value;
        const password = this.state.password;
        if(password.length > 0 && password !== confirmPassword){
            this.setState(() => ({passwordValidation: true, confirmPassword}))
        }
        else{
            this.setState(() => ({passwordValidation: false, confirmPassword}))
        }
    };

    handleAddressOneChange = (e) => {
        let address1 = e.target.value;
        let addressValidation = "success";
        if(address1.trim().length === 0){
            addressValidation = "error";
        }
        if(address1.length <= 255){
            this.setState(() => ({address1, addressValidation}));
        }

    };

    handleAddressTwoChange = (e) => {
        let address2 = e.target.value;
        if(address2.length <= 255) {
            this.setState(() => ({address2}));
        }
    };

    handleCityChange = (e) => {
        let city = e.target.value;
        let cityValidation = "success";
        if(city.trim().length === 0){
            cityValidation = "error";
        }
        this.setState(() => ({city, cityValidation}));
    };

    handleStateChange = (e) => {
        let stateName = e.target.value;
        this.setState(() => ({stateName}));
    };

    handleZipChange = (e) => {
        let zip = e.target.value;
        let zipValidation = null;
        if(zip.length < 7){
            zipValidation = "error";
        }
        else{
            zipValidation = "success"
        }

        if(zip.length <= 7){
            this.setState(() => ({zip, zipValidation}));
        }

    };

    handlePhoneChange = (e) => {
        let phone = e.target.value.trim();
        let phoneValidation = null;
        if(phone.length < 12){
            phoneValidation = "error"
        }
        else{
            phoneValidation = "success"
        }

        if(phone.length <= 12){
            this.setState(() => ({phone, phoneValidation}));
        }
    };

    handleFullNameChange = (e) => {
        const fullName = e.target.value;
        let fullNameValidation = null;
        if(fullName.length > 0 && fullName.length < 45){
            fullNameValidation = "success";
            this.setState(() => ({fullName, fullNameValidation}));
        }
        else{
            fullNameValidation = "error";
            this.setState(() => ({fullNameValidation}));
        }
    };

    static emailValidation = (email) => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    onEmailChange = (e) => {
        const email = e.target.value;
        let emailValidation = "error";
        if(RegistrationComponent.emailValidation(email.trim())){
            emailValidation = "success";
        }

        if(email.length <= 45){
            this.setState(() => ({email, emailValidation}));
        }
    };

    onRegisterClick = (e) => {
        e.preventDefault();
        this.setState(() => ({isLoading: true}));
        const data = {
            name: this.state.fullName,
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.confirmPassword,
            // address1: this.state.address1,
            // address2: this.state.address2,
            // city: this.state.city,
            // state: this.state.stateName,
            // zip: this.state.zip,
            // phone: this.state.phone
        };

        axios.post(registerAPI, data)
            .then(() => {
                this.props.history.push("/login");
            })
            .catch((error) => {
                 const errors = Object.values(error.response.data.errors);
                 this.setState(() => ({isLoading: false, errors }));
            });
    };

    render(){

        if(this.state.isLoading){
            return <LoadingScreen/>
        }

        return (
            <Grid className={"minimum-height nice-background"}>
                <Row>
                    <Col mdOffset={2} lgOffset={2} smOffset={1} xsOffset={1} lg={8} md={8} sm={10} xs={10}>
                        <h3 className={"text-center"}>Регистрация</h3>
                        {this.state.errors.length > 0 &&
                        <div className={'order-confirmation'}>
                            <Panel bsStyle="danger">
                                <Panel.Heading>
                                    <Panel.Title componentClass="h3">Ошибка регистрации</Panel.Title>
                                </Panel.Heading>
                                <Panel.Body>
                                    <ul>
                                        {this.state.errors.map((item) => (
                                            item.map((error, k) => (
                                                <li key={k}>{error}</li>
                                            ))
                                        ))}
                                    </ul>
                                </Panel.Body>
                            </Panel>
                        </div>
                        }
                        <form>

                            <FormGroup
                                controlId="formBasicFullName"
                                validationState={this.state.fullNameValidation}
                            >
                                <ControlLabel>ФИО</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.fullName}
                                    // placeholder="Фамилия Имя Отчество"
                                    onChange={this.handleFullNameChange}
                                />
                                <FormControl.Feedback />
                            </FormGroup>

                            <FormGroup
                                controlId="formBasicUsername"
                                validationState={this.state.emailValidation}
                            >
                                <ControlLabel>E-MAIL</ControlLabel>
                                <FormControl
                                    type="email"
                                    value={this.state.email}
                                    // placeholder="Будет использоваться вместо логина"
                                    onChange={this.onEmailChange}
                                />
                                <FormControl.Feedback />
                            </FormGroup>

                            <FormGroup
                                controlId="formBasicPassword"
                            >
                                <ControlLabel>Пароль</ControlLabel>
                                <FormControl
                                    type="password"
                                    value={this.state.password}
                                    // placeholder="Введите пароль"
                                    onChange={this.passwordChange}
                                />
                                <HelpBlock>*Пароль должен состоять как минимум из 6 символов</HelpBlock>
                                {this.state.passwordValidation ? <span className={"error-message"}>Пароль не совпадает</span> : ''}
                            </FormGroup>

                            <FormGroup
                                controlId="formBasicConfirmPassword"
                            >
                                <ControlLabel>Подвердить пароль</ControlLabel>
                                <FormControl
                                    type="password"
                                    value={this.state.confirmPassword}
                                    // placeholder="Введите пароль повторно"
                                    onChange={this.confirmPasswordChange}
                                />
                                {this.state.passwordValidation && <span className={"error-message"}>Пароль не совпадает</span>}
                            </FormGroup>







                            {/*<FormGroup*/}
                                {/*controlId="formBasicAddress"*/}
                                {/*validationState={this.state.addressValidation}*/}
                            {/*>*/}
                                {/*<ControlLabel>Address</ControlLabel>*/}
                                {/*<FormControl*/}
                                    {/*type="text"*/}
                                    {/*value={this.state.address1}*/}
                                    {/*placeholder="Address 1"*/}
                                    {/*onChange={this.handleAddressOneChange}*/}
                                {/*/>*/}
                                {/*<FormControl.Feedback />*/}
                            {/*</FormGroup>*/}

                            {/*<FormGroup*/}
                                {/*controlId="formBasicAddress2"*/}
                            {/*>*/}
                                {/*<FormControl*/}
                                    {/*type="text"*/}
                                    {/*value={this.state.address2}*/}
                                    {/*placeholder="Address 2"*/}
                                    {/*onChange={this.handleAddressTwoChange}*/}
                                {/*/>*/}
                            {/*</FormGroup>*/}

                            {/*<FormGroup*/}
                                {/*controlId="formBasicCity"*/}
                                {/*validationState={this.state.cityValidation}*/}
                            {/*>*/}
                                {/*<ControlLabel>City</ControlLabel>*/}
                                {/*<FormControl*/}
                                    {/*type="text"*/}
                                    {/*value={this.state.city}*/}
                                    {/*placeholder="City"*/}
                                    {/*onChange={this.handleCityChange}*/}
                                {/*/>*/}
                                {/*<FormControl.Feedback />*/}
                            {/*</FormGroup>*/}

                            {/*<Row>*/}
                                {/*<Col lg={6} md={6}>*/}
                                    {/*<FormGroup*/}
                                        {/*controlId="formBasicState"*/}
                                    {/*>*/}
                                        {/*<ControlLabel>State</ControlLabel>*/}
                                        {/*<FormControl*/}
                                            {/*type="text"*/}
                                            {/*value={this.state.stateName}*/}
                                            {/*placeholder="State"*/}
                                            {/*onChange={this.handleStateChange}*/}
                                        {/*/>*/}
                                        {/*<FormControl.Feedback />*/}
                                    {/*</FormGroup>*/}
                                {/*</Col>*/}

                                {/*<Col lg={6} md={6}>*/}
                                    {/*<FormGroup*/}
                                        {/*controlId="formZip"*/}
                                        {/*validationState={this.state.zipValidation}*/}
                                    {/*>*/}
                                        {/*<ControlLabel>Zip</ControlLabel>*/}
                                        {/*<FormControl*/}
                                            {/*type="number"*/}
                                            {/*value={this.state.zip}*/}
                                            {/*placeholder="Zip"*/}
                                            {/*onChange={this.handleZipChange}*/}
                                        {/*/>*/}
                                        {/*<FormControl.Feedback />*/}
                                    {/*</FormGroup>*/}
                                {/*</Col>*/}
                            {/*</Row>*/}

                            {/*<FormGroup*/}
                                {/*controlId="formBasicZip"*/}
                                {/*validationState={this.state.phoneValidation}*/}
                            {/*>*/}
                                {/*<ControlLabel>Phone</ControlLabel>*/}
                                {/*<FormControl*/}
                                    {/*type="number"*/}
                                    {/*value={this.state.phone}*/}
                                    {/*placeholder="Phone"*/}
                                    {/*onChange={this.handlePhoneChange}*/}
                                {/*/>*/}
                                {/*<FormControl.Feedback />*/}
                            {/*</FormGroup>*/}

                            {/*{this.state.addressValidation === s &&*/}
                            {/*this.state.cityValidation === s &&*/}
                            {/*this.state.zipValidation === s &&*/}
                            {/*this.state.phoneValidation === s &&*/}
                            {/*this.state.fullNameValidation === s &&*/}
                            {/*!this.state.passwordValidation &&*/}
                            {/*this.state.emailValidation === s &&*/}
                            {/*this.state.password.length > 5 &&*/}
                            {/*}*/}
                            <Button type={"submit"} onClick={this.onRegisterClick} bsStyle={"primary"}>Зарегистрироваться</Button>
                        </form>
                        <div className={'registration-div'}>
                            <br/>
                            <span>Уже есть аккаунт?</span> &ensp; <Link to={"/login"} className='btn btn-default'>Войти</Link>
                        </div>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

export default connect()(RegistrationComponent);