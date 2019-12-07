import React from "react";
import {Grid, Col, Row} from "react-bootstrap";
import {connect} from "react-redux";
import CheckoutItems from "../components/CheckoutItems";
import NoCheckoutItems from "../components/NoCheckoutItems";
import CheckoutInformation from "../components/CheckoutInformation";

const Checkout = (props) => (
    <Grid className={"minimum-height nice-background"}>


        {props.shoppingCart.length > 0 ?
            <Row>
                <h2 className={"checkout-title"}>Оформление заказа</h2>
                {/*<hr/>*/}
                <Col lg={6} md={6} sm={6} xsHidden>
                    {props.shoppingCart.length > 0 ? <CheckoutItems/> : <NoCheckoutItems/>}
                </Col>

                <Col lg={6} md={6} sm={6} xs={12}>
                    {props.shoppingCart.length > 0 ? <CheckoutInformation/> : ''}
                </Col>
            </Row>
            : <NoCheckoutItems/>
        }
    </Grid>
);

const mapStateToProps = (state) => {
    return {
        shoppingCart: state.shoppingCart
    };
};

export default connect(mapStateToProps)(Checkout);