import React from "react";
import {
    Step,
    Stepper,
    StepLabel,
    StepContent,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {Row, Col, FormGroup, ControlLabel, FormControl, Radio, Form, Button} from "react-bootstrap";
import AddressForm from "./AddressForm";
import {withRouter} from "react-router-dom";
import axios, {getHeaders} from "../api/axiosInstance";
import {ACCESS_TOKEN, SUCCESSFUL_ORDER} from "../api/strings";
import {checkoutinformationAPI, placeOrderAPI, validatePromoAPI} from "../api/apiURLs";
import {connect} from "react-redux";
import LoadingScreen from "../components/LoadingScreen";
import {totalReducer} from "./ShoppingCart";

const FieldGroup = ({ id, label, validationState=null, ...props }) => (
        <FormGroup controlId={id} validationState={validationState}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
            <FormControl.Feedback />
        </FormGroup>
);

const s = "success";

class CheckoutInformation extends React.Component {

    state = {
        finished: false,
        stepIndex: 0,
        name: '',
        email: '',
        paymentMethod: 1,
        nameValidation: null,
        emailValidation: null,
        creditCardChecked: false,
        debitCardChecked: true,
        nameDisabled: false,
        emailDisabled: false,
        loadedAddress: null,
        isLoading: false,
        promoCodeError: undefined,
        promoCodeMessage: undefined,
        promoCode: "",
        promoCodeResponse: {},

        deliveryType: 1,
        deliveryPickup: true,
        deliveryDelivery: false,

        billingNumber: '',
        productNames: '',
        orderTotalSum: '',
        successUrl: '',
        paymentType: '',
    };

    componentDidMount(){
        // load the logged in user data
        // if(this.props.authentication.isAuthenticated) {
            const access_token = window.localStorage.getItem(ACCESS_TOKEN);
            const headers = getHeaders(access_token);
            axios.get(checkoutinformationAPI, {headers})
                .then((response) => {
                    const data = response.data;
                    this.setState(() => ({
                        loadedAddress: data.loadedAddress,
                        nameDisabled: true,
                        emailDisabled: true,
                    }));
                    if (data.name !== null && data.name !== '' && data.name !== undefined){
                        this.setState(() => ({
                            name: data.name,
                            nameValidation: s,
                        }));
                    }
                    if (data.email !== null && data.email !== '' && data.email !== undefined){
                        this.setState(() => ({
                            email: data.email,
                            emailValidation: s,
                        }));
                    }
                })
                .catch((error) => {
                    console.log(error.response);
                });
        // }
    }

    handleNext = (address) => {
        const {stepIndex} = this.state;
        this.setState({
            stepIndex: stepIndex + 1,
            finished: stepIndex >= 3,
        });
        if(stepIndex === 1){
            this.setState(() => ({loadedAddress: address}));
        }
        else if(stepIndex === 2){
            // process the order
            this.setState(() => ({isLoading: true}));
            const totalAmount = this.props.shoppingCart.reduce(totalReducer, 0);
            let headers = {};
            if(this.props.authentication.isAuthenticated){
                const access_token = window.localStorage.getItem(ACCESS_TOKEN);
                headers = getHeaders(access_token);
            }

            let products = [];
            this.props.shoppingCart.map((item) => (
                products.push({
                    productId: item.productID,
                    quantity: item.quantity,
                    price: item.price
                })
            ));
            const paymentMethod = this.state.creditCardChecked ? 'CARD_PAYMENT' : 'BALANCE_PAYMENT';
            const deliveryType = this.state.deliveryPickup ? 'DELIVERY_PICKUP' : 'DELIVERY_DELIVERY';

            const {name, email, promoCodeResponse} = this.state;
            let promoCodeId = null;
            let amountDue = totalAmount;
            if(typeof promoCodeResponse.promoCodeId !== 'undefined'){
                promoCodeId = promoCodeResponse.promoCodeId;
                const discount = parseFloat(promoCodeResponse.discount);
                amountDue = parseFloat(totalAmount) - discount;
            }

            const data = {
                ...this.state.loadedAddress,
                name,
                email,
                totalAmount,
                products,
                paymentMethod,
                promoCodeId,
                amountDue,
                deliveryType
            };
            axios.post(placeOrderAPI, data, {headers})
                .then((response) => {
                    if (paymentMethod === 'BALANCE_PAYMENT') {
                        this.props.history.push({
                            pathname: '/order',
                            state: { order: SUCCESSFUL_ORDER }
                        });
                    } else {
                        this.setState(() => ({
                            isLoading: false,
                            billingNumber: response.data.billing_number,
                            productNames: response.data.product_names,
                            orderTotalSum: response.data.amount_due,
                            successUrl: response.data.success_url,
                        }));
                    }
                })
                .catch((error) => {
                    console.log(error.response);
                });

        }
    };

    handlePrev = () => {
        const {stepIndex} = this.state;
        if (stepIndex > 0) {
            this.setState({stepIndex: stepIndex - 1});
        }
    };

    onNameChange = (e) => {
        let name = e.target.value;
        let nameValidation = "success";
        if(name.trim().length === 0){
            nameValidation = "error";
        }
        if(name.length <= 45){
            this.setState(() => ({name, nameValidation}));
        }
    };

    static emailValidation = (email) => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    onEmailChange = (e) => {
        let email = e.target.value;
        let emailValidation = "error";
        if(CheckoutInformation.emailValidation(email.trim())){
            emailValidation = "success";
        }

        if(email.length <= 45){
            this.setState(() => ({email, emailValidation}));
        }
    };

    handleDeliveryMethod = (e) => {
        let deliveryType = e.target.value;
        this.setState(() => ({deliveryType}));
    };

    handleDeliveryChange = () => {
        this.setState((prevState) => ({deliveryPickup: !prevState.deliveryPickup, deliveryDelivery: !prevState.deliveryDelivery}));
    };

    handlePaymentMethod = (e) => {
        let paymentMethod = e.target.value;
        this.setState(() => ({paymentMethod}));
    };

    handlePaymentType = (e) => {
        let paymentType = e.target.value;
        this.setState(() => ({paymentType}));
    };

    handlePaymentChange = () => {
      this.setState((prevState) => ({creditCardChecked: !prevState.creditCardChecked, debitCardChecked: !prevState.debitCardChecked}));
    };

    onPromoCodeFormSubmit = (e) => {
        e.preventDefault();
        const promoCode = e.target.promo_code.value.trim();
        if(promoCode.length === 0){
            this.setState(() => ({promoCodeError: true, promoCodeMessage: "Promo code cannot be empty."}));
        }
        else{
            // validate promo code
            const access_token = window.localStorage.getItem(ACCESS_TOKEN);
            const headers = getHeaders(access_token);
            const data = {
                promoCode
            };
            axios.post(validatePromoAPI, data, {headers})
                .then((response) => {
                    const response_data = response.data;
                    if(response_data.used_by.length > 0){
                        this.setState(() => ({
                            promoCodeError: true,
                            promoCodeMessage: "You have already used this promo code",
                            promoCode,
                            promoCodeResponse: {}
                        }));
                    }
                    else{
                        this.setState(() => ({
                            promoCode,
                            promoCodeError: undefined,
                            promoCodeMessage: "Promo code applied successfully",
                            promoCodeResponse: response_data
                        }))
                    }
                })
                .catch(() => {
                    this.setState(() => ({
                        promoCodeError: true,
                        promoCodeMessage: "Invalid promo code",
                        promoCode: "",
                        promoCodeResponse: {}
                    }));
                });
        }
    };

    promoCodeChange = (e) => {
          const promoCode = e.target.value.trim();
          if(promoCode.length < 25){
              this.setState(() => ({
                 promoCode
              }));
          }
    };

    addPaymentToOrder = () => {
        const access_token = window.localStorage.getItem(ACCESS_TOKEN);
        const headers = getHeaders(access_token);
        const { billingNumber, paymentType } = this.state;
        const data = {
            billingNumber,
            paymentType
        };
        axios.post("api/payment/create", data, {headers})
            .then((response) => {
                console.log('ok');
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    renderStepActions(step) {
        const {stepIndex, paymentType} = this.state;
        let paymentNotChecked = paymentType === '';
        let disabledButtonFirstStep = this.state.name !== '' &&
            this.state.name !== null &&
            this.state.email !== '' &&
            this.state.email !== null;

        {/*<RaisedButton*/}
            {/*label={stepIndex === 2 ? 'Оформить заказ' : 'Дальше'}*/}
            {/*// disableTouchRipple={true}*/}
            {/*// disableFocusRipple={true}*/}
            {/*primary={true}*/}
            {/*onClick={this.handleNext}*/}
            {/*style={{marginRight: 12}}*/}
            {/*disabled={disabledButtonFirstStep}*/}
        {/*/>*/}

        return (
            <div style={{margin: '12px 0'}}>
                {stepIndex !== 3 ? (
                    <button
                    disabled={!disabledButtonFirstStep}
                    className='do-payment btn btn-info'
                    onClick={this.handleNext}
                    style={{marginRight: 12}}
                    >
                    {stepIndex === 2 ? 'Оформить заказ' : 'ДАЛЬШЕ'}
                    </button>
                ) :
                <button
                    disabled={paymentNotChecked}
                    className='do-payment btn btn-success'
                    onClick={this.addPaymentToOrder}
                >
                    {/*<input type="submit" className='do-payment btn btn-success' value="ОПЛАТИТЬ"/>*/}
                    <input
                        disabled={paymentNotChecked}
                        type="submit"
                        className='do-payment-submit'
                        value="ОПЛАТИТЬ"
                    />
                </button>
                }
                {step > 0 && (
                    <FlatButton
                        label="Назад"
                        disabled={stepIndex === 0}
                        disableTouchRipple={true}
                        disableFocusRipple={true}
                        onClick={this.handlePrev}
                    />
                )}
            </div>
        );
    }

    render() {
        const {stepIndex} = this.state;

        if(this.state.isLoading){
            return <LoadingScreen/>
        }

        const totalAmount = this.props.shoppingCart.reduce(totalReducer, 0);

        let discount = 0.0;
        let amountDue = totalAmount;
        if(typeof this.state.promoCodeResponse.promoCodeId !== 'undefined'){
            discount = parseFloat(this.state.promoCodeResponse.discount);
            amountDue = parseFloat(totalAmount) - discount;
        }

        return (

            <div>
                <Stepper activeStep={stepIndex} orientation="vertical">
                    <Step>
                        <StepLabel>Введите ваши личные данные</StepLabel>
                        <StepContent>
                            <Row>
                                <Col lg={12} md={12}>
                                    <form>
                                        <FieldGroup
                                            id="formControlsText"
                                            type="text"
                                            label="ФИО"
                                            validationState={this.state.nameValidation}
                                            // placeholder="Фамилия Имя Отчество"
                                            // disabled={this.state.nameDisabled}
                                            value={this.state.name}
                                            onChange={this.onNameChange}
                                        />
                                        <FieldGroup
                                            id="formControlsEmail"
                                            type="email"
                                            label="E-MAIL"
                                            validationState={this.state.emailValidation}
                                            // placeholder="Эл. почта"
                                            // disabled={this.state.emailDisabled}
                                            value={this.state.email}
                                            onChange={this.onEmailChange}
                                        />
                                    </form>
                                </Col>
                            </Row>
                            {this.state.nameValidation === "success" && this.state.emailValidation === "success" && this.renderStepActions(0)}
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel>Ваша контактная информация</StepLabel>
                        <StepContent>
                            <Row>
                                <Col lg={12} md={12}>
                                    <AddressForm
                                        loadedAddress={this.state.loadedAddress}
                                        handleNext={this.handleNext}
                                        handlePrev={this.handlePrev}
                                    />
                                </Col>
                            </Row>
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel>Выберите способ получения товара</StepLabel>
                        <StepContent>
                            <Row>
                                <Col lg={12} md={12}>
                                    <FormGroup>
                                        <div className={"pretty p-default p-round p-jelly"}>
                                            {/*<Radio name="radioGroup" value="1"*/}
                                                   {/*onClick={this.handleDeliveryMethod}*/}
                                                   {/*checked={this.state.deliveryPickup}*/}
                                                   {/*onChange={this.handleDeliveryChange}*/}
                                            {/*>*/}

                                            {/*</Radio>*/}
                                            <input
                                                type="radio"
                                                name="radioGroup1" value="1"
                                                   onClick={this.handleDeliveryMethod}
                                                   checked={this.state.deliveryPickup}
                                                   onChange={this.handleDeliveryChange}
                                            >

                                            </input>
                                            <div className="state p-info-o">
                                                <label>Самовывоз</label>
                                            </div>
                                        </div>
                                        <div className={"pretty p-default p-round p-jelly"}>
                                            {/*<ControlLabel>Способ получения товара</ControlLabel>*/}
                                            {/*<Radio name="radioGroup" value="2"*/}
                                                   {/*onClick={this.handleDeliveryMethod}*/}
                                                   {/*checked={this.state.deliveryDelivery}*/}
                                                   {/*onChange={this.handleDeliveryChange}*/}
                                            {/*>*/}

                                            {/*</Radio>*/}
                                            <input
                                                type="radio"
                                                name="radioGroup1"
                                                value="2"
                                                   onClick={this.handleDeliveryMethod}
                                                   checked={this.state.deliveryDelivery}
                                                   onChange={this.handleDeliveryChange}
                                            >

                                            </input>
                                            <div className="state p-info-o">
                                                <label>Доставка на дом</label>
                                            </div>
                                        </div>
                                    </FormGroup>
                                    <FormGroup>

                                        <div className="pretty p-switch p-fill">
                                            <input
                                                type="checkbox"
                                                // name="radioGroup2" value="1"
                                                onClick={this.handlePaymentMethod}
                                                checked={this.state.creditCardChecked}
                                                onChange={this.handlePaymentChange}
                                            />
                                            <div className="state p-info">
                                                <label>Оплатить через платежные системы</label>
                                            </div>
                                        </div>

                                        {/*<ControlLabel>Оплата</ControlLabel>*/}
                                        {/*<p>Итоговая сумма составляет: {totalAmount.toFixed(2)} ₽</p>*/}
                                        {/*{(typeof this.state.promoCodeResponse.promoCodeId !== 'undefined') &&*/}
                                        {/*<p>Discount applied: ${discount.toFixed(2)}</p>}*/}

                                        {/*<Radio name="radioGroup2" value="1"*/}
                                               {/*onClick={this.handlePaymentMethod}*/}
                                               {/*checked={this.state.creditCardChecked}*/}
                                               {/*onChange={this.handlePaymentChange}*/}
                                        {/*>*/}
                                            {/*через платежные системы*/}
                                        {/*</Radio>*/}
                                        {/*<Radio name="radioGroup2" value="2"*/}
                                               {/*onClick={this.handlePaymentMethod}*/}
                                               {/*checked={this.state.debitCardChecked}*/}
                                               {/*onChange={this.handlePaymentChange}*/}
                                        {/*>*/}
                                            {/*наличными*/}
                                        {/*</Radio>*/}
                                        <hr/>
                                        <p>К оплате: {amountDue.toFixed(2)} ₽</p>
                                    </FormGroup>
                                </Col>
                            </Row>
                            {this.renderStepActions(2)}
                        </StepContent>
                    </Step>
                    {this.state.debitCardChecked ? '' :
                        <Step>
                            <StepLabel>Выберите платежную систему</StepLabel>
                            <StepContent>
                                <Row>
                                    <Col lg={12} md={12}>
                                        {/*{this.props.authentication.isAuthenticated &&*/}
                                        {/*<Form onSubmit={this.onPromoCodeFormSubmit}>*/}
                                        {/*<FormGroup controlId={"promo-code-text"}>*/}
                                        {/*<ControlLabel>Promo Code</ControlLabel>*/}
                                        {/*<FormControl*/}
                                        {/*type="text"*/}
                                        {/*placeholder="Promo Code"*/}
                                        {/*max={45}*/}
                                        {/*name={"promo_code"}*/}
                                        {/*className={"fifty-width"}*/}
                                        {/*value={this.state.promoCode}*/}
                                        {/*onChange={this.promoCodeChange}*/}
                                        {/*/>*/}
                                        {/*{this.state.promoCodeError ?*/}
                                        {/*<p className={"error-message"}>*/}
                                        {/*{this.state.promoCodeMessage}*/}
                                        {/*</p> :*/}
                                        {/*<p className={"promo-successfully-applied"}>*/}
                                        {/*{this.state.promoCodeMessage}*/}
                                        {/*</p>*/}
                                        {/*}*/}
                                        {/*<Button*/}
                                        {/*bsStyle={"primary"}*/}
                                        {/*type={"submit"}*/}
                                        {/*className={"star-rating-div btn-sm"}*/}
                                        {/*>*/}
                                        {/*Apply*/}
                                        {/*</Button>*/}
                                        {/*</FormGroup>*/}
                                        {/*</Form>*/}
                                        {/*}*/}
                                        <form method="POST" action="https://money.yandex.ru/quickpay/confirm.xml">
                                            <input type="hidden" name="receiver" value="410013350834015"/>
                                            <input type="hidden" name="formcomment" value='Оплата товаров и услуг'/>
                                            <input type="hidden" name="short-dest" value='Оплата товаров и услуг'/>
                                            <input type="hidden" name="label" value={this.state.billingNumber}/>
                                            <input type="hidden" name="quickpay-form" value="shop"/>
                                            <input type="hidden" name="targets" value={"Транзакция " + this.state.billingNumber}/>
                                            <input type="hidden" name="sum" value={this.state.orderTotalSum} data-type="number"/>
                                            <input type="hidden" name="comment" value={this.state.productNames}/>
                                            <input type="hidden" name="successURL" value={this.state.successUrl}/>

                                            <div
                                                className={"pretty p-fill p-curve p-tada p-icon p-toggle p-plain radio-pay"}
                                            >
                                                <input
                                                    type="radio"
                                                    name="paymentType"
                                                    value="PC"
                                                    onClick={this.handlePaymentType}
                                                />
                                                <div className={"state p-danger-o p-on"}>
                                                    <i className={"icon payment-yandex-symbol"}>Я</i>
                                                    <label
                                                        className={"style-for-checkbox-opacity-on"}
                                                    >Кошелек в Яндекс.Деньгах</label>
                                                </div>

                                                <div className={"state p-off"}>
                                                    <label
                                                        className={"style-for-checkbox-opacity-off"}
                                                    >Кошелек в Яндекс.Деньгах</label>
                                                </div>
                                            </div>
                                            <div
                                                className={"pretty p-fill p-curve p-rotate p-icon p-toggle p-plain radio-pay"}
                                            >
                                                <input
                                                    type="radio"
                                                    name="paymentType"
                                                    value="AC"
                                                    onClick={this.handlePaymentType}
                                                />
                                                <div className={"state p-warning p-on"}>
                                                    <i className={"icon glyphicon glyphicon-credit-card"}></i>
                                                    <label
                                                        className={"style-for-checkbox-opacity-on"}
                                                    >Банковская карта</label>
                                                </div>

                                                <div className={"state p-off"}>
                                                    <label
                                                        className={"style-for-checkbox-opacity-off"}
                                                    >Банковская карта</label>
                                                </div>
                                            </div>
                                            <div
                                                className={"pretty p-fill p-curve p-jelly p-icon p-toggle p-plain radio-pay"}
                                            >
                                                <input
                                                    type="radio"
                                                    name="paymentType"
                                                    value="MC"
                                                    onClick={this.handlePaymentType}
                                                />
                                                <div className={"state p-info-o p-on"}>
                                                    <i className={"icon glyphicon glyphicon-phone"}></i>
                                                    <label
                                                        className={"style-for-checkbox-opacity-on"}
                                                    >Баланс телефона</label>
                                                </div>

                                                <div className={"state p-off"}>
                                                    <label
                                                        className={"style-for-checkbox-opacity-off"}
                                                    >Баланс телефона</label>
                                                </div>
                                            </div>
                                            {/*<label><input type="radio" name="paymentType" value="PC">Яндекс.Деньгами</label>*/}
                                            {/*<label><input type="radio" name="paymentType" value="AC">Банковской картой</label>*/}
                                            {this.renderStepActions(3)}
                                        </form>
                                    </Col>
                                </Row>
                            </StepContent>
                        </Step>
                    }

                </Stepper>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authentication: state.authentication,
        shoppingCart: state.shoppingCart
    };
};

export default connect(mapStateToProps)(withRouter(CheckoutInformation));