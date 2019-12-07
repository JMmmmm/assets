import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, Grid, Row, Table, Col} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import { SocialIcon } from 'react-social-icons';
import LoadingOrderAnimation from 'react-loading-order-with-animation';

const UnderHeader = () => (
    <Navbar className={'under-header'}>
        <Grid>
            <Row>
                <Col lg={9} md={9} xsHidden sm={8}>
                    <Nav>
                        <NavItem
                            title="Доставка"
                            id="delivery"
                        >
                            <LoadingOrderAnimation animation="fade-in"
                                                   move="from-top-to-bottom"
                                                   distance={400}
                                                   speed={700}
                                                   wait={600}>
                                <Link to={"/delivery"} className={'delivery-about-style'}>Услуги</Link>
                            </LoadingOrderAnimation>
                        </NavItem>
                        <NavItem
                            title="О нас"
                            id="about"
                        >
                            <LoadingOrderAnimation animation="fade-in"
                                                   move="from-bottom-to-top"
                                                   distance={50}
                                                   speed={700}
                                                   wait={450}>
                                <Link to={"/about"} className={'delivery-about-style'}>О нас</Link>
                            </LoadingOrderAnimation>
                        </NavItem>
                    </Nav>
                </Col>

                <Col lg={3} md={3} sm={4} xsHidden>
                    <LoadingOrderAnimation
                        animation="fade-in"
                        move="from-right-to-left"
                        distance={100}
                        speed={2000}
                        wait={200}
                    >
                        <div className={"phone-number"}>+7978 135 90 05</div>
                        {/*<div className={"phone-number email-addition"}>KlimatKrim@inbox.ru</div>*/}
                    </LoadingOrderAnimation>
                </Col>

                <Col lgHidden mdHidden smHidden xs={12}>
                    <div className={"phone-number"}>+7978 135 90 05</div>
                    {/*<div className={"phone-number email-addition"}>KlimatKrim@inbox.ru</div>*/}
                </Col>

            </Row>
        </Grid>
    </Navbar>
);

export default UnderHeader;