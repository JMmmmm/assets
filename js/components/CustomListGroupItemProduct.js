import React from "react";
import {Button, Row, Col, Glyphicon} from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import StarRatingComponent from 'react-star-ratings';
import {addToCart} from "../actions/shoppingCart";
import {image} from "./image";
import { connect } from 'react-redux';
import {ACCESS_TOKEN} from "../api/strings";
import axios from "../api/axiosInstance";
import {getHomeInfo, getUserAPI} from "../api/apiURLs";

class CustomListGroupItemProduct extends React.Component{

    state = {
        checkedToCart: false
    };

    addToCartOnClick = (e) => {
        e.stopPropagation();
        // dispatching an action to redux store
        const product = {
            productName: this.props.children,
            productImage: this.props.image,
            sellerName: this.props.sellerName,
            ratings: this.props.ratings ? this.props.ratings : undefined,
            quantity: 1,
            price: this.props.currentPrice,
            productID: this.props.productID
        };
        this.props.dispatch(addToCart(product));
        this.setState(() => ({checkedToCart: true}));
    };

    componentDidMount(){
        const checkedToCart = this.props.checkedToCart;
        this.setState(() => ({checkedToCart}));
    }

    viewClickHandler = (routeName) => {
        this.props.history.push(routeName);
    };

    render() {
        return (
            <Col lg={3} md={4} sm={4} xs={6}>

            <li className="list-group-item beautiful-div-product" onClick={() => this.viewClickHandler(`/product/${this.props.productID}`)}>
                {/*<div className={"media-left"}>*/}
                {/*</div>*/}
                <div className={"media-body"}>
                            <Row>
                                <Col lg={12} md={12} sm={12} xs={12}>
                                    {/*<img className="media-object" height={64} width={64} src={this.props.image ? this.props.image : image} alt="..." />*/}
                                    <img className="product-img-title-style" src={this.props.image ? this.props.image : image} alt="..." />

                                </Col>
                                <Col lg={12} md={12} sm={12} xs={12}>
                                    <h4 className={'textss'}>{this.props.children}</h4>

                                    <div className={"seller-name-div"}>
                                        <span>{this.props.sellerName}</span>
                                    </div>
                                    <div>
                                        {this.props.prevPrice && <span className={"subcategory-deal-price-st"}>{this.props.prevPrice}</span>}
                                        <span className={"subcategory-deal-price"}>{this.props.currentPrice} ₽</span>

                                    </div>
                                </Col>

                                <Col lg={12} md={12} sm={12} xs={12}>
                                    <div className={"star-rating-div"}>
                                        <StarRatingComponent
                                            rating={this.props.ratings}
                                            starDimension={"20px"}
                                            starSpacing={"0px"}
                                            starRatedColor={"rgb(247, 202, 37)"}
                                        />
                                    </div>
                                </Col>

                                <Col md={12} lg={12} sm={12} xs={12}>
                                    {/*<div className={'button-buy svg-wrapper'}>*/}
                                        {/*<svg height="60">*/}
                                            {/*<rect className="shape" height="60"/>*/}
                                            {/*<div className="text">*/}
                                                {/*{this.state.checkedToCart ?*/}

                                                    {/*<Button bsStyle={"gray"} className={"btn-sm view-atc-button"}>*/}
                                                        {/*<span className={"btn-sm view-atc-button"}>Товар уже в корзине</span>*/}
                                                    {/*</Button>*/}
                                                    {/*:*/}
                                                    {/*<Button bsStyle={"warning"} className={"btn-sm view-atc-button"} onClick={this.addToCartOnClick}>*/}
                                                        {/*<span><Glyphicon glyph={"shopping-cart"} className={"cart-symbol-size"}/></span>*/}

                                                    {/*</Button>}*/}
                                            {/*</div>*/}
                                        {/*</svg>*/}
                                    {/*</div>*/}

                                    <div className={'button-buy'}>
                                        <div>
                                            {this.state.checkedToCart ?
                                                <div className={"btn-sm view-atc-button"}>Товар в корзине</div>
                                                :
                                                <Button bsStyle={"warning"} className={"btn-sm view-atc-button"} onClick={this.addToCartOnClick}>
                                                    <Glyphicon glyph={"shopping-cart"} className={"cart-symbol-size"}/>
                                                    {/*&ensp; В корзину*/}
                                                </Button>
                                            }
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                </div>
            </li>
            </Col>
        )
    }
}

export default connect()(withRouter(CustomListGroupItemProduct));