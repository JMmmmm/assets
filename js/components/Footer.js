import React from 'react';
import { Navbar, Grid, Row, Table, Col} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import { SocialIcon } from 'react-social-icons';
import {connect} from "react-redux";

const Footer = (props) => (
    <footer className={'footer'}>
    <Navbar>
        <Grid>
            <Row>
                <Col lg={4} md={4}>
                    <br/>
                    <Link to={"/contact"}>Связаться с нами</Link>
                </Col>
                <Col lg={4} md={4}>
                    <br/><br/>
                    <SocialIcon url="https://vk.com/public183851165" />
                    &ensp;
                    <SocialIcon url="https://www.instagram.com/klimat.crimea/" color="#7CFC00" />
                    &ensp;
                    <SocialIcon url="https://www.facebook.com/groups/457783988104683/" />
                    <br/>
                </Col>
                <Col lg={4} md={4}>
                    <br/>
                    <Link to={"/delivery"}>Услуги</Link>
                    <br/>
                    <Link to={"/about"}>О нас</Link>
                </Col>
            </Row>

            <Row>
                <Col lg={12}>
                    <div className={"text-center copyright-height"}>
                        &copy; {(new Date().getFullYear())} | maDe By <span className={'dark_site-style'}>Dark Site</span>
                    </div>
                </Col>
            </Row>
        </Grid>
    </Navbar>
    </footer>
);

const mapStateToProps = (props) => {
    return {
        categories: props.categories
    };
};

export default connect(mapStateToProps)(Footer);

// export default Footer;