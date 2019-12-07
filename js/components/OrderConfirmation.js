import React from "react";
import {Link} from "react-router-dom";
import {Panel, Glyphicon} from "react-bootstrap";
import ReactRevealText from 'react-reveal-text';
import LoadingOrderAnimation from 'react-loading-order-with-animation';

const OrderConfirmation = (props) => (
    <div>
        <Panel bsStyle="success">
            <Panel.Heading>
                <Panel.Title componentClass="h3">Заказ успешно оплачен</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
                <div className={'order-confirmation'}>
                    <h4>Благодарим за покупку!</h4>
                    <p>Ожидайте, с вами свяжутся в течении дня!</p>
                    <p>На вашу почту отправили письмо с деталями заказа!</p>
                    {/*props.authentication*/}
                    <p>Войдите в личный кабинет, чтобы следить за состоянием ваших заказов.</p>
                    <br/>
                    <br/>
                    <div>
                        <Glyphicon glyph={"shopping-cart"} className={"empty-checkout-size"}/>
                    </div>
                    <br/>
                    <LoadingOrderAnimation animation="fade-in"
                                           move="from-bottom-to-top"
                                           distance={70}
                                           speed={2000}
                                           wait={200}>
                        &ensp;<Link to={"/"} className={"btn-sm fit continue-shopping-btn"}>Продолжить</Link>
                    </LoadingOrderAnimation>
                </div>
            </Panel.Body>
        </Panel>
    </div>
);

export default OrderConfirmation;