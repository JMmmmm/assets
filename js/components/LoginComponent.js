import React from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Button, Grid, Row, Col } from 'react-bootstrap';
import {withRouter, Link} from 'react-router-dom';
import axios from 'axios';
import {loginAPI, getUserAPI, getUserCartAPI} from "../api/apiURLs";
import {loginUser, logoutUser} from "../actions/authentication";
import { connect } from 'react-redux';
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../api/strings";
import LoadingScreen from "../components/LoadingScreen";
import {addToCartHelper, emptyCart} from "../actions/shoppingCart";
import {imageWatch} from "./image";
import { Route, Redirect } from 'react-router-dom';

const FieldGroup = ({ id, label, help, ...props }) => (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
);

class LoginComponent extends React.Component{

    state = {
        passwordHelp: undefined,
        usernameHelp: undefined,
        invalidCredentials: undefined,
        isLoading: false
    };

    loadCartService = () => {
        const access_token = window.localStorage.getItem(ACCESS_TOKEN);
        const headers = {Accept: "application/json", Authorization: `Bearer ${access_token}`};
        axios.get(getUserCartAPI, {headers})
            .then((response) => {
                    this.props.dispatch(loginUser());
                    response.data.map((item) => {
                        const productName = item.name;
                        const productImage = item.image;
                        const sellerName = item.sellerName;
                        const ratings = item.ratings;
                        const quantity = 1;
                        const price = item.price;
                        const productID = item.productId;
                        const product = {
                            productName,
                            productImage,
                            sellerName,
                            ratings,
                            quantity,
                            price,
                            productID
                        };
                        this.props.dispatch(emptyCart());
                        this.props.dispatch(addToCartHelper(product));
                    });
                    // window.location.reload(true);
                    // this.props.history.push("/");
                window.location.replace("/");
                }
            )
            // @TODO
            // Вернуть ошибку
            .catch((error) => {
                console.log(error);
                window.localStorage.removeItem(ACCESS_TOKEN);
                this.props.dispatch(logoutUser());
            });
    };

    componentDidMount(){
        if(window.localStorage.getItem(ACCESS_TOKEN) !== null){
            // means the user is already logged in, check if it is valid
            this.setState(() => ({isLoading: true}));
            this.loadCartService();
        }
    }

    onLoginSubmit = (e) => {
        e.preventDefault();
        const email = e.target.formControlsUsername.value;
        const password = e.target.formControlsPassword.value;

        if(password.length === 0){
            this.setState(() => ({passwordHelp: "Пароль не может быть пустым"}));
        }else{
            this.setState(() => ({passwordHelp: undefined}));
        }

        if(email.length === 0){
            this.setState(() => ({usernameHelp: "E-MAIL не может быть пустым"}));
        }else{
            this.setState(() => ({usernameHelp: undefined}));
        }

        if(email.length > 0 && password.length > 0){
            this.setState(() => ({isLoading: true}));
            const data = {
              grant_type: "password",
              client_id: "2",
              client_secret: window.Laravel.client_secret,
              username: email,
              password: password,
              scope: "*"
            };
            axios.post(loginAPI, data)
                .then((response) => {
                    window.localStorage.setItem(ACCESS_TOKEN, response.data.access_token);
                    window.localStorage.setItem(REFRESH_TOKEN, response.data.refresh_token);
                    this.props.dispatch(loginUser());
                    this.loadCartService();
                })
                .catch((error) => (
                    this.setState(() => ({
                        invalidCredentials: true,
                        isLoading: false
                    }))
                ));
        }
    };

    render(){

        if(this.state.isLoading){
            return <LoadingScreen/>
        }

        return (
            <Grid className={"minimum-height nice-background"}>
                <Row>
                    <Col mdOffset={2} lgOffset={2} smOffset={1} xsOffset={1} lg={8} md={8} sm={10} xs={10}>
                        <h3 className={"text-center"}>ВХОД</h3>
                        <form onSubmit={this.onLoginSubmit}>
                            <FieldGroup
                                id="formControlsUsername"
                                type="email"
                                label="E-MAIL"
                                // placeholder="Введите зарегистрированную эл. почту"
                                help={this.state.usernameHelp}
                            />
                            <FieldGroup
                                id="formControlsPassword"
                                label="ПАРОЛЬ"
                                type="password"
                                // placeholder="Введите пароль"
                                help={this.state.passwordHelp}
                            />
                            {this.state.invalidCredentials && <p className={"error-message"}>Неверный логин или пароль</p>}
                            <Button type={"submit"} className={'btn btn-primary'}>Войти</Button>
                        </form>
                        <div className={'registration-div'}>
                            <br/>
                            <span>Нет аккаунта?</span> &ensp; <Link to={"/register"} className='btn btn-default'>Регистрация</Link>
                        </div>
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

export default connect(mapStateToProps)(withRouter(LoginComponent));