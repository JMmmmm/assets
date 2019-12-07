import React from 'react';
import { Grid, Col, Row, Carousel, ListGroup } from 'react-bootstrap';
import {withRouter} from "react-router-dom";
import {getHomeInfo, getUserCartAPI} from "../api/apiURLs";
import axios from "../api/axiosInstance";
import CustomListGroupItem from './CustomListGroupItemProduct';
import LoadingScreen from "../components/LoadingScreen";
import HeartCheckbox from 'react-heart-checkbox';
import { swap, swashIn } from 'react-magic';
// import { StyleSheet, css } from 'aphrodite';
import ReactRevealText from 'react-reveal-text';
import LoadingOrderAnimation from 'react-loading-order-with-animation';
import Bounce from 'react-reveal/Bounce';
import {ACCESS_TOKEN} from "../api/strings";
import ScrollToTop from "react-scroll-up";
import {connect} from "react-redux";
import {loginUser, logoutUser} from "../actions/authentication";
import {addToCartHelper} from "../actions/shoppingCart";
import { Link, animateScroll as scroll } from "react-scroll";
import Coverflow from 'react-coverflow';
import AliceCarousel from 'react-alice-carousel'
import "react-alice-carousel/lib/alice-carousel.css"
// import AwesomeButton from 'react-awesome-button';


const OFFER_ONE = "offerone";
const OFFER_TWO = "offertwo";
const OFFER_THREE = "offerthree";

class HomePage extends React.Component{
    state = {
        products: [],
        discountProducts: [],
        news: [],
        isLoading: false,
        showStartText: false,
        width: 0,
        categories: [],
    };

    handleOfferClick = (offer) => {
        switch (offer){
            case OFFER_ONE:{
                this.props.history.push('/electronics/cellphone');
                break;
            }
            case OFFER_TWO:{
                this.props.history.push('/books/book');
                break;
            }
            case OFFER_THREE:{
                this.props.history.push('/homerequirements/furniture');
                break;
            }
        }
    };

    componentDidMount(){
        this.setState(() => ({isLoading: true}));
        const access_token = window.localStorage.getItem(ACCESS_TOKEN);
        const headers = {Accept: "application/json", Authorization: `Bearer ${access_token}`};

        axios.get(getHomeInfo, {headers})
            .then((response) => (this.setState(
                {
                    products: response.data.products,
                    discountProducts: response.data.discount_products,
                    news: response.data.news,
                    categories: response.data.categories,
                    isLoading: false,
                })))
            .catch((error) => {
                console.log(error);
                window.localStorage.removeItem(ACCESS_TOKEN);
                this.props.dispatch(logoutUser());
                // window.location.reload(true);
                window.location.assign("/");
            });

        setTimeout(() => {
            this.setState({ showStartText: true });
        }, 1000);

        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    }

    componentWillReceiveProps(nextProps){
        this.setState(() => ({isLoading: true}));
        const access_token = window.localStorage.getItem(ACCESS_TOKEN);
        const headers = {Accept: "application/json", Authorization: `Bearer ${access_token}`};

        axios.get(getHomeInfo, {headers})
            .then((response) => (this.setState(
                {
                    products: response.data.products,
                    discountProducts: response.data.discount_products,
                    news: response.data.news,
                    categories: response.data.categories,
                    isLoading: false,
                })))
            .catch((error) => {
                console.log(error);
                window.localStorage.removeItem(ACCESS_TOKEN);
                this.props.dispatch(logoutUser());
                // window.location.reload(true);
                window.location.assign("/");
            });

        setTimeout(() => {
            this.setState({ showStartText: true });
        }, 1000);
    }

    resize() {
        this.setState({width: window.innerWidth});
    }

    scrollTo = () => {
        scroll.scrollTo(900);
    };

    responsive = {
        0: { items: 3 },
        517: { items: 3},
        767: { items: 4 },
        1024: { items: 4 }
    };

    categoryClickHandler = (routeName) => {
        this.props.history.push(routeName);
    };

    render(){

        if(this.state.isLoading){
            return <LoadingScreen/>
        }

        let items = [];
        const {products, news, discountProducts, categories} = this.state;
        const end = products.length;
        for (let i = 0; i <= end; i++ ) {
            if(i < products.length) {

                items.push(<CustomListGroupItem
                    key={i}
                    currentPrice={products[i].price}
                    prevPrice={products[i].originalPrice}
                    sellerName={products[i].sellerName}
                    ratings={products[i].ratings}
                    productID={products[i].productId}
                    image={products[i].photo.photo}
                    checkedToCart={products[i].checkedToCart}
                >
                    {products[i].name}
                </CustomListGroupItem>);
            }else{
                break;
            }
        }

        let discountItems = [];
        const discountEnd = discountProducts.length;
        for (let i = 0; i <= discountEnd; i++ ) {
            let key = i + 1000;
            if(i < discountProducts.length) {
                discountItems.push(<CustomListGroupItem
                    key={key}
                    currentPrice={discountProducts[i].price}
                    prevPrice={discountProducts[i].originalPrice}
                    sellerName={discountProducts[i].sellerName}
                    ratings={discountProducts[i].ratings}
                    productID={discountProducts[i].productId}
                    image={discountProducts[i].photo.photo}
                    checkedToCart={discountProducts[i].checkedToCart}
                >
                    {discountProducts[i].name}
                </CustomListGroupItem>);
            }else{
                break;
            }
        }

        let newsItems = [];
        for (let i = 0; i < news.length; i++) {
            if (this.state.width >= 1024) {
                newsItems.push(
                    <div
                        key={i}
                        className={'beautiful-div-news'}
                    >
                        <img width={250} height={200} alt={"..."} src={news[i].image}/>
                    </div>
                );
            } else if(this.state.width >= 880) {
                newsItems.push(
                    <div
                        key={i}
                        className={'beautiful-div-news'}
                    >
                        <img width={200} height={150} alt={"..."} src={news[i].image}/>
                    </div>
                );
            }else if(this.state.width >= 660) {
                newsItems.push(
                    <div
                        key={i}
                        className={'beautiful-div-news'}
                    >
                        <img width={150} height={100} alt={"..."} src={news[i].image}/>
                    </div>
                );
            }else {
                newsItems.push(
                    <div
                        key={i}
                        className={'beautiful-div-news'}
                    >
                        <img width={100} height={50} alt={"..."} src={news[i].image}/>
                    </div>
                );
            }
        }

        let categoryList = [];
        if (this.state.width <= 517) {
            for (let i = 0; i < categories.length; i++) {
                categoryList.push(
                    <a
                        // onClick={this.categoryClickHandler("/categories/" + categories[i].slug)}
                        href={"/categories/" + categories[i].slug}
                    >
                        <img
                            width={170}
                            height={130}
                            alt={"..."}
                            src={'/storage/' + categories[i].img}
                        />
                    </a>
                );
            }
        } else {
            for (let i = 0; i < categories.length; i++) {
                categoryList.push(
                    <a
                        // onClick={this.categoryClickHandler("/categories/" + categories[i].slug)}
                        href={"/categories/" + categories[i].slug}
                    >
                        <img
                            width={250}
                            height={200}
                            alt={"..."}
                            src={'/storage/' + categories[i].img}
                        />
                    </a>
                );
            }
        }



        // categoryList.push(<img width={250} height={200} alt={"..."} src={'/storage/site/file_1.jpg'}/>);
        // categoryList.push(<img width={250} height={200} alt={"..."} src={'/storage/site/file_2.jpg'}/>);
        // categoryList.push(<img width={250} height={200} alt={"..."} src={'/storage/site/file_3.jpg'}/>);
        // categoryList.push(<img width={250} height={200} alt={"..."} src={'/storage/site/file_4.jpg'}/>);

        return (
        <div className={"home-page-div"}>
            <Grid>
                <div className={'scroll-main-style'}>
                    <ScrollToTop
                        showUnder={110}
                        duration={500}
                        easing={'linear'}
                    >
                        <div className={"text-center"}>
                            <img width={50} height={50} alt="Вверх" src="/storage/site/arrow.png" />
                            {/*<Glyphicon glyph={"arrow-up"}/>*/}
                            {/*<p>ВВЕРХ</p>*/}
                        </div>
                    </ScrollToTop>
                </div>

                {/*<Row>*/}
                    {/*<Col lg={12} md={12} sm={12} xs={12}>*/}
                        {/*<div className={'div-start'}>*/}
                            {/*<LoadingOrderAnimation animation="fade-in"*/}
                                                   {/*move="from-top-to-bottom"*/}
                                                   {/*distance={300}*/}
                                                   {/*speed={1000}*/}
                                                   {/*wait={300}>*/}
                                {/*<h1>С чего начать</h1>*/}
                            {/*</LoadingOrderAnimation>*/}
                            {/*<ReactRevealText*/}
                                {/*show={this.state.showStartText}*/}
                            {/*>*/}
                                {/*Чай – это напиток с тысячелетней историей, который внесёт в вашу жизнь нечто абсолютно новое!*/}
                                {/*Главное открыть дверь.*/}
                            {/*</ReactRevealText>*/}
                            {/*<br/> <br/>*/}

                            {/*<LoadingOrderAnimation animation="fade-in"*/}
                                                   {/*move="from-bottom-to-top"*/}
                                                   {/*distance={100}*/}
                                                   {/*speed={2000}*/}
                                                   {/*wait={1700}>*/}
                                {/*/!*<a href="https://youtu.be/s6zR2T9vn2c" className="button fit opacity-style" data-poptrox="youtube,800x400">Смотреть</a>*!/*/}
                                {/*<a onClick={this.scrollTo} className={'more'}><div className={'glyphicon glyphicon-chevron-down arrow-home-page'}></div> </a>*/}
                            {/*</LoadingOrderAnimation>*/}
                        {/*</div>*/}
                    {/*</Col>*/}
                {/*</Row>*/}

                <Row>
                    <Col lg={12} md={12}>
                        <Carousel
                            // activeIndex={index}
                            className={'vertical'}
                            // fade={true}
                            // wrap={false}
                            interval={2000}
                            controls={true}
                        >
                            <Carousel.Item>
                                <img className={"transparent"} alt="Browse our offers." src="storage/site/categ1.png" />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img className={"transparent"} alt="Browse our offers." src="storage/site/categ2.png" />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img className={"transparent"} alt="Browse our offers." src="storage/site/categ3.png" />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img className={"transparent"} alt="Browse our offers." src="storage/site/categ4.png" />
                            </Carousel.Item>
                            {/*<Carousel.Item>*/}
                                {/*<img width={1750} height={450} className={"transparent"} alt="Browse our offers." src="storage/site/category3.png" />*/}
                            {/*</Carousel.Item>*/}
                        </Carousel>

                    </Col>
                    <br/>
                </Row>

                <Row>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <div className={'beatiful-div-carousel'}>
                            <Row>
                                <Col lg={8} md={8} sm={8} xs={12}>
                                    <h3 className={'beautiful-text-v1'}>Х и т ы</h3>
                                </Col>
                                <Col lg={4} md={4} sm={4} xs={12}>
                                    <Row>
                                        <Col lg={6} md={6} sm={6} xs={6}>
                                            <div className={'carousel-bottom-style'} onClick={() => this.Carousel._slidePrev()}>
                                            </div>
                                        </Col>
                                        <Col lg={6} md={6} sm={6} xs={6}>
                                            <div className={'carousel-bottom-style carousel-bottom-style-right'} onClick={() => this.Carousel._slideNext()}>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <div className="style-five"></div>
                            <hr className={"style-five"}/>
                                <AliceCarousel
                                    items={items}
                                    responsive={this.responsive}
                                    autoPlayInterval={3000}
                                    autoPlayDirection="rtl"
                                    autoPlay={true}
                                    fadeOutAnimation={true}
                                    mouseDragEnabled={true}
                                    disableAutoPlayOnAction={true}
                                    keysControlDisabled={true}
                                    dotsDisabled={false}
                                    buttonsDisabled={true}
                                    ref={(el) => (this.Carousel = el)}
                                />
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col lgHidden md={12} sm={12} xs={12}>
                        <div className={'beatiful-div-carousel-category additional-color-style'}>
                            <AliceCarousel
                                items={categoryList}
                                responsive={this.responsive}
                                fadeOutAnimation={true}
                                mouseDragEnabled={true}
                                disableAutoPlayOnAction={true}
                                keysControlDisabled={true}
                                dotsDisabled={false}
                                buttonsDisabled={true}
                            />
                        </div>
                    </Col>
                    <Col lg={12} mdHidden smHidden xsHidden>
                        <div className={'beatiful-div-carousel beatifull-div-left'}>
                            <Row>
                                {categoryList.map((item, index) => (
                                    <Col key={index} lg={4}>
                                        {item}
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <div className={'beatiful-div-carousel'}>
                            <Row>
                                <Col lg={8} md={8} sm={8} xs={12}>
                                    <h3 className={'beautiful-text-v1'}>А к ц и и</h3>
                                </Col>
                                <Col lg={4} md={4} sm={4} xs={12}>
                                    <Row>
                                        <Col lg={6} md={6} sm={6} xs={6}>
                                            <div className={'carousel-bottom-style'} onClick={() => this.Carousel2._slidePrev()}></div>
                                        </Col>
                                        <Col lg={6} md={6} sm={6} xs={6}>
                                            <div className={'carousel-bottom-style carousel-bottom-style-right'} onClick={() => this.Carousel2._slideNext()}></div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <div className="style-five"></div>
                            <hr className={"style-five"}/>
                            <AliceCarousel
                                items={discountItems}
                                responsive={this.responsive}
                                autoPlayInterval={3000}
                                autoPlayDirection="rtl"
                                autoPlay={true}
                                fadeOutAnimation={true}
                                mouseDragEnabled={true}
                                disableAutoPlayOnAction={true}
                                keysControlDisabled={true}
                                dotsDisabled={false}
                                buttonsDisabled={true}
                                ref={(el) => (this.Carousel2 = el)}
                            />
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <div className={'carousel-catalog'}>
                            <h3 className={'beautiful-text-v1 white-color'}>Н а ш и &ensp; р а б о т ы</h3>
                            <Coverflow width="960" height="500"
                                       displayQuantityOfSide={2}
                                       navigation={false}
                                       enableScroll={true}
                                       clickable={true}
                                       active={0}
                            >
                                {newsItems}
                            </Coverflow>
                        </div>
                        <div className={'carousel-catalog-alternative'}></div>
                    </Col>
                </Row>



                {/*<Row>*/}
                    {/*<div className={'div-optimaze-width'}>*/}
                        {/*<Col lg={3} md={3} sm={3} xsHidden>*/}
                            {/*<br/>*/}
                            {/*<h3 className={'beautiful-text-v1'}>Н о в о c т и</h3>*/}
                            {/*<ListGroup className={'search-results-list'}>*/}
                                {/*{newsItems.map((item, index) => (*/}
                                    {/*<Row key={index}>*/}
                                        {/*{item}*/}
                                    {/*</Row>*/}
                                {/*))}*/}
                            {/*</ListGroup>*/}
                        {/*</Col>*/}

                        {/*<Col lg={8} md={8} sm={8} xs={12}>*/}
                            {/*<div className={"text-center beautiful-div-title"} >*/}
                                {/*<h3 className={"beautiful-text-v1"} >Лучшее предложение </h3>*/}
                            {/*</div>*/}
                            {/*<h4 className={'textss'}>*/}
                            {/*</h4>*/}
                            {/*<ListGroup className={'search-results-list'}>*/}
                                {/*{newItems.map((item, index) => (*/}
                                    {/*<Row key={index}>*/}
                                        {/*{item}*/}
                                    {/*</Row>*/}
                                {/*))}*/}
                            {/*</ListGroup>*/}
                        {/*</Col>*/}
                    {/*</div>*/}
                {/*</Row>*/}
            </Grid>
        </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authentication: state.authentication
    };
};

// export default withRouter(HomePage);
export default connect(mapStateToProps)(withRouter(HomePage));
