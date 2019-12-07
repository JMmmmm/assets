import React from "react";
import {Grid, Row, Col, Glyphicon} from "react-bootstrap";
import OrderList from "../components/OrderList";
import ScrollToTop from "react-scroll-up";

const MyOrders = () => (
    <Grid className={"minimum-height nice-background"}>
        <div className={'scroll-main-style'}>
            <ScrollToTop
                showUnder={110}
                duration={500}
                easing={'linear'}
            >
                <div className={"text-center"}>
                    <img width={50} height={50} alt="Вверх" src="/storage/site/arrow.png" />
                </div>
            </ScrollToTop>
        </div>
        <Row>
            <Col lg={10} md={10} lgOffset={1} mdOffset={1}>
                <OrderList/>
            </Col>
        </Row>
    </Grid>
);

export default MyOrders;