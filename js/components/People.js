import React from "react";
import {Grid, Col, Row, ListGroup, ListGroupItem} from "react-bootstrap";
import LoadingOrderAnimation from 'react-loading-order-with-animation';

const People = () => (
    <Grid className={"minimum-height about-div"}>
        <Row>
            <h4>СКИДОЧНЫЕ КАРТЫ</h4>
            <hr/>
            <Col lg={12} md={12}>
                <LoadingOrderAnimation animation="fade-in"
                                       move="from-top-to-bottom"
                                       distance={30}
                                       speed={1000}
                                       wait={300}>
                    <div>
                        <Row>
                            <Col lg={4} md={4}>
                                <img width={230} height={230} src={"/storage/site/people_cart.jpg"}/>
                            </Col>

                            <Col lg={8} md={8}>
                                <ListGroup>
                                    <div className={'about-style'}>
                                        <ListGroupItem>
                                            Всем нашим постоянным <strong>клиентам</strong> мы с радостью предоставляем скидки
                                            <br/>
                                            Мы отслеживаем количество и объём заказов каждого покупателя и присваиваем скидки на сайте - после присвоения вы видите цены сайта уже с учётом скидки.
                                            <br/>
                                            Для участия в скидочной системе необходимо оформлять заказы от имени <strong>зарегистрированного пользователя</strong>
                                        </ListGroupItem>

                                        <ListGroupItem>
                                            По любым вопросам касательно скидок - пожалуйста пишите нам.
                                        </ListGroupItem>
                                    </div>
                                </ListGroup>
                            </Col>
                        </Row>

                        <hr/>

                        <div className={'delivery-style'}>
                            <br/>
                            <br/>
                            <div>Акция поощрения действует бессрочно. Наиболее активные участники будут вознаграждены наиболее Щедро!</div>
                            <br/>
                            <br/>
                        </div>
                    </div>
                </LoadingOrderAnimation>
            </Col>

        </Row>
    </Grid>
);

export default People;