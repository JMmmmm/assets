import React from "react";
import {connect} from "react-redux";
import LoadingScreen from "../components/LoadingScreen";
import {withRouter} from 'react-router-dom';
import axios from '../api/axiosInstance';
import {getUserAPI, registerAPI} from "../api/apiURLs";
import {ACCESS_TOKEN} from "../api/strings";
import WishList from "./WishList";
import ScrollToTop from "react-scroll-up";
import { Button, Grid, Row, Col, ControlLabel, FormGroup, FormControl, Panel, HelpBlock, Glyphicon } from 'react-bootstrap';

class MyAccount extends React.Component{
    state = {
        isLoading: false,
        user: {},

        fullName: null,
        email: null,
        lastPassword: null,
        password: '',
        confirmPassword: '',

        birthdate: null,
        gender: null,
        city: null,
        address: null,
        zip: null,
        phone: null,

        passwordValidation: false,
        fullNameValidation: null,

        birthdateValidation: null,
        genderValidation: null,
        addressValidation: null,
        cityValidation: null,
        zipValidation: null,
        phoneValidation: null,
    };

    componentDidMount(){
        // load the data here
        if(this.props.authentication.isAuthenticated){
            this.setState(() => ({isAuthenticated: true}));
            const access_token = window.localStorage.getItem(ACCESS_TOKEN);
            const headers = {Accept: "application/json", Authorization: `Bearer ${access_token}`};
            axios.get(getUserAPI, {headers})
                .then((response) => {
                    const fullName = response.data.name;
                    const email = response.data.email;
                    const birthdate = response.data.birthdate;
                    const gender = response.data.gender;
                    const city = response.data.city;
                    const address = response.data.address;
                    const zip = response.data.postIndex;
                    const phone = response.data.phone;

                    this.setState(() => ({fullName, email, birthdate, gender,
                        city, address, zip, phone,
                        isLoading: false}));
                })
                .catch((error) => {
                    console.log(error.response);
                    this.props.history.push("/");
                })
        }
        else{
            this.props.history.push("/login");
        }
    }

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

    onEmailChange = (e) => {
        const email = e.target.value;
        let emailValidation = "error";
        if(MyAccount.emailValidation(email.trim())){
            emailValidation = "success";
        }

        if(email.length <= 45){
            this.setState(() => ({email, emailValidation}));
        }
    };

    static emailValidation = (email) => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    lastPasswordChange = (e) => {
        const lastPassword = e.target.value;
        this.setState(() => ({lastPassword}));
    };

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

    handleAddressChange = (e) => {
        let address = e.target.value;
        let addressValidation = "success";
        if(address.trim().length === 0){
            addressValidation = "error";
        }
        if(address.length <= 255){
            this.setState(() => ({address, addressValidation}));
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

    handleZipChange = (e) => {
        let zip = e.target.value;
        let zipValidation = null;
        if(zip.length < 6){
            zipValidation = "error";
        }
        else{
            zipValidation = "success"
        }

        if(zip.length <= 6){
            this.setState(() => ({zip, zipValidation}));
        }

    };

    handlePhoneChange = (e) => {
        let phone = e.target.value.trim();
        let phoneValidation = null;
        if(phone.length < 11){
            phoneValidation = "error"
        }
        else{
            phoneValidation = "success"
        }

        if(phone.length <= 11){
            this.setState(() => ({phone, phoneValidation}));
        }
    };

    onRegisterClick = (e) => {
        e.preventDefault();
        this.setState(() => ({isLoading: true}));
        const access_token = window.localStorage.getItem(ACCESS_TOKEN);
        const data = {
            name: this.state.fullName,
            email: this.state.email,
            address: this.state.address,
            city: this.state.city,
            zip: this.state.zip,
            phone: this.state.phone,
            token: access_token
        };

        if (this.state.lastPassword !== null) {
            data.password = this.state.password;
            data.last_password = this.state.lastPassword;
        }

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
                  <ScrollToTop showUnder={110}>
                      <div className={"text-center"}>
                          <Glyphicon glyph={"arrow-up"}/>
                          <p>Back to Top</p>
                      </div>
                  </ScrollToTop>
                  {/*<Row>*/}
                      {/*<Col lg={12} md={12}>*/}
                          {/*<Panel>*/}
                              {/*<Panel.Heading>*/}
                                  {/*<Panel.Title componentClass="h3" className={"text-center"}>Мой аккаунт</Panel.Title>*/}
                              {/*</Panel.Heading>*/}
                              {/*<Panel.Body>*/}
                                  {/*<Row>*/}
                                      {/*<Col lg={2} md={2}>*/}
                                          {/*<p className={"user-info-label"}>ИМя: </p>*/}
                                      {/*</Col>*/}
                                      {/*<Col lg={10} md={10}>*/}
                                          {/*<p className={"user-info"}>{this.state.user.name}</p>*/}
                                      {/*</Col>*/}
                                  {/*</Row>*/}

                                  {/*<Row>*/}
                                      {/*<Col lg={2} md={2}>*/}
                                          {/*<p className={"user-info-label"}>Email: </p>*/}
                                      {/*</Col>*/}
                                      {/*<Col lg={10} md={10}>*/}
                                          {/*<p className={"user-info"}>{this.state.user.email}</p>*/}
                                      {/*</Col>*/}
                                  {/*</Row>*/}
                              {/*</Panel.Body>*/}
                          {/*</Panel>*/}
                      {/*</Col>*/}
                  {/*</Row>*/}

                  <Row>
                      <Col mdOffset={2} lgOffset={2} lg={7} md={7} sm={10} xs={10}>
                          {/*Старый механизм по избранным товарам  */}
                          {/*<WishList/>*/}
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
                              controlId="formCurrentPassword"
                          >
                              <ControlLabel>Текущий пароль</ControlLabel>
                              <FormControl
                                  type="password"
                                  // placeholder="Существующий пароль"
                                  value={this.state.lastPassword}
                                  onChange={this.lastPasswordChange}
                              />
                          </FormGroup>

                          <FormGroup
                              controlId="formBasicPassword"
                          >
                              <ControlLabel>Новый пароль</ControlLabel>
                              <FormControl
                                  type="password"
                                  // placeholder="Новый пароль"
                                  value={this.state.password}
                                  onChange={this.passwordChange}
                              />
                              {this.state.passwordValidation ? <span className={"error-message"}>Пароль не совпадает</span> : ''}
                          </FormGroup>

                          <FormGroup
                              controlId="formBasicConfirmPassword"
                          >
                              <ControlLabel>Подвердите пароль</ControlLabel>
                              <FormControl
                                  type="password"
                                  value={this.state.confirmPassword}
                                  // placeholder="Введите пароль повторно"
                                  onChange={this.confirmPasswordChange}
                              />
                              {this.state.passwordValidation && <span className={"error-message"}>Пароль не совпадает</span>}
                          </FormGroup>


                          <FormGroup
                              controlId="formBasicAddress"
                              validationState={this.state.addressValidation}
                          >
                              <ControlLabel>Адрес</ControlLabel>
                              <FormControl
                                  type="text"
                                  value={this.state.address}
                                  // placeholder="Улица, дом, квартира"
                                  onChange={this.handleAddressChange}
                              />
                          </FormGroup>

                          <FormGroup
                              controlId="formBasicCity"
                              validationState={this.state.cityValidation}
                          >
                              <ControlLabel>Город</ControlLabel>
                              <FormControl
                                  type="text"
                                  value={this.state.city}
                                  // placeholder="Город"
                                  onChange={this.handleCityChange}
                              />
                              <FormControl.Feedback />
                          </FormGroup>

                          <Row>
                              <Col lg={6} md={6}>
                                  <FormGroup
                                      controlId="formZip"
                                      validationState={this.state.zipValidation}
                                  >
                                      <ControlLabel>Почтовый индекс</ControlLabel>
                                      <FormControl
                                          type="number"
                                          value={this.state.zip}
                                          // placeholder="Почтовый индекс"
                                          onChange={this.handleZipChange}
                                      />
                                      <FormControl.Feedback />
                                  </FormGroup>
                              </Col>

                              <Col lg={6} md={6}>
                                  <FormGroup
                                      controlId="formBasicZip"
                                      validationState={this.state.phoneValidation}
                                  >
                                      <ControlLabel>Телефон</ControlLabel>
                                      <FormControl
                                          type="number"
                                          value={this.state.phone}
                                          // placeholder="Телефон"
                                          onChange={this.handlePhoneChange}
                                      />
                                      <FormControl.Feedback />
                                  </FormGroup>
                              </Col>
                          </Row>
                              <Button type={"submit"} onClick={this.onRegisterClick} bsStyle={"primary"}>Изменить</Button>
                              <br/> <br/>
                          </form>
                      </Col>
                  </Row>
              </Grid>
          )
    }
}

const mapStateToProps = (state) => {
    return {
        authentication: state.authentication
    };
};

export default connect(mapStateToProps)(withRouter(MyAccount));

