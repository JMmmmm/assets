import React from "react";
import {Button, Row, Col, Glyphicon} from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import {image} from "./image";
import { connect } from 'react-redux';
import {addToCart} from "../actions/shoppingCart";

class CustomListGroupItemOrder extends React.Component{

    state = {
        checkedToCart: false
    };

    componentDidMount(){
        const checkedToCart = this.props.checkedToCart;
        this.setState(() => ({checkedToCart}));
    }

    addToCartOnClick = (e) => {
        e.stopPropagation();
        // dispatching an action to redux store
        const product = {
            productName: this.props.children,
            productImage: this.props.image,
            sellerName: this.props.sellerName,
            ratings: this.props.ratings ? this.props.ratings : undefined,
            quantity: 1,
            price: this.props.actualPrice,
            productID: this.props.productID
        };
        this.props.dispatch(addToCart(product));
        this.setState(() => ({checkedToCart: true}));
    };

    viewClickHandler = (routeName) => {
        this.props.history.push(routeName);
    };

    render() {
        return (
            <li className="list-group-item" onClick={() => this.viewClickHandler(`/product/${this.props.productID}`)}>
                {/*<div className={"media-left"}>*/}
                    {/*<img className="media-object" width={64} height={64} src={this.props.image ? this.props.image : image} alt="..." />*/}
                {/*</div>*/}

                <Row>
                    <Col lg={3} md={3} sm={3} xs={12}>
                        <img className="media-object img-order-style" width={120} height={120} src={this.props.image ? this.props.image : image} alt="..." />
                    </Col>
                    <Col lg={9} md={9} sm={9} xs={12}>
                        <div className={"media-body"}>
                            <Row>
                                <Col lg={7} md={7} sm={12} xs={12}>
                                    <h4 className={"media-heading"}>{this.props.children}</h4>
                                    <div className={"seller-name-div"}>
                                        <span>{this.props.sellerName}</span>
                                    </div>
                                    <div>
                                        <span className={"subcategory-deal-price"}>{this.props.currentPrice} ₽</span>
                                    </div>
                                </Col>

                                <Col lg={3} md={3} sm={12} xs={12}>
                                    <div className={"star-rating-div"}>
                                        <span>Кол-во: {this.props.quantity}</span>
                                    </div>
                                </Col>

                                <Col md={2} lg={2} sm={12} xs={12}>
                                    <div>
                              <span>
                                  {this.state.checkedToCart ?
                                      <div className={"btn-sm view-atc-button"}>Товар уже в корзине</div>
                                      :
                                      <Button bsStyle={"warning"} className={"btn-sm view-atc-button"} onClick={this.addToCartOnClick}>
                                          <Glyphicon glyph={"shopping-cart"} className={"cart-symbol-size"}/>
                                          {/*&ensp; В корзину*/}
                                      </Button>
                                  }

                                  {/*<Button bsStyle={"default"} className={"btn-sm view-atc-button"} onClick={this.removeFromWishlistHandler}>View</Button>*/}
                                  {/*<Button bsStyle={"primary"} className={"btn-sm view-atc-button"} onClick={this.addToCartOnClick}>Buy Again</Button>*/}
                              </span>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </li>
        )
    }
}

export default connect()(withRouter(CustomListGroupItemOrder));