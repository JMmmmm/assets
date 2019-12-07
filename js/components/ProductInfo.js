import React from "react";
import {Grid, Row, Col, ControlLabel, FormGroup, FormControl, Button, Glyphicon} from "react-bootstrap";
import ReactImageZoom from 'react-image-zoom';
import StarRatingComponent from 'react-star-ratings';
import {image} from "./image";
import {addToCart, removeFromCart} from "../actions/shoppingCart";
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import axios, {getHeaders} from "../api/axiosInstance";
import {productInfoAPI} from "../api/apiURLs";
import LoadingScreen from "../components/LoadingScreen";
import InformationPanel from "../components/InformationPanel";
import {addToWishlist, removeFromWishlist} from "../actions/wishlist";
import {ACCESS_TOKEN, ADDED_TO_CART_SNACKBAR, ADDED_TO_WISHLIST_SNACKBAR} from "../api/strings";
import MetaTags from 'react-meta-tags';

class ProductInfo extends React.Component {

    state = {
      product: {},
      prevPrice: null,
      quantity: 1,
      numberOfRatings: 239,
      productID: undefined,
      autoHideDuration: 3000,
      snackbarOpen:false,
      isLoading: false,
      productNotFound: false,
      snackbarMessage: "",
      checkedToCart: false,
    };


    loadProductDetails = (productID) => {
        this.setState(() => ({productID, isLoading:true}));
        const url = productInfoAPI(productID);
        const access_token = window.localStorage.getItem(ACCESS_TOKEN);
        let headers = getHeaders(access_token);

        axios.get(url, {headers}).then((response) => (this.setState(
            {
                product: response.data,
                isLoading: false,
                productNotFound: false,
                checkedToCart: response.data.checkedToCart
            }
        ))).catch((error) => (
            this.setState(() => ({
                isLoading: false,
                productNotFound: true
            }))
        ));
    };

    componentWillReceiveProps(nextProps){
        if(this.props.match.params.id !== nextProps.match.params.id){
            let productID = nextProps.match.params.id;
            this.loadProductDetails(productID);
        }
    }

    componentDidMount(){
        let productID = this.props.match.params.id;
        // load the product details here
        this.loadProductDetails(productID);
    }

    addToCartOnClick = (e) => {
        // dispatching an action to redux store
        e.stopPropagation();
        const product = {
            productName: this.state.product.name,
            productImage: this.state.product.image,
            sellerName: this.state.product.sellerName,
            ratings: this.state.product.ratings,
            quantity: this.state.quantity,
            price: this.state.product.price,
            productID: this.state.productID
        };
        this.props.dispatch(addToCart(product));
        this.setState(() => ({snackbarOpen: true, snackbarMessage: ADDED_TO_CART_SNACKBAR}));
        this.setState(() => ({checkedToCart: true}));
        window.location.replace("/");
    };

    onQuantityChange = (e) => {
        let quantity = e.target.value;
        if(parseInt(quantity.length) < 3){
            this.setState(() => ({quantity}));
        }
    };

    onQuantityBlur = () => {
        if(this.state.quantity.length === 0 || (this.state.quantity.length > 0 && parseInt(this.state.quantity) < 1)){
            this.setState(() => ({quantity: 1}))
        }
    };

    handleSnackbarRequestClose = () => {
        this.setState({
            snackbarOpen: false,
        });
    };

    static removeItemFromCart = (productID, props) => {
        let productToRemove = {
            productID
        };
        props.dispatch(removeFromCart(productToRemove));
    };

    handleUndoAction = () => {
        if(this.state.snackbarMessage === ADDED_TO_CART_SNACKBAR){
            ProductInfo.removeItemFromCart(this.state.productID, this.props);
        }
        else{
            this.props.dispatch(removeFromWishlist(this.state.productID));
        }
        this.handleSnackbarRequestClose();
    };

    handleAddToWishlist = () => {
        const product = {
            productName: this.state.product.name,
            productImage: this.state.product.image,
            sellerName: this.state.product.sellerName,
            ratings: this.state.product.ratings,
            quantity: this.state.quantity,
            price: this.state.product.price,
            productID: this.state.productID,
            prevPrice: this.state.product.originalPrice
        };
        this.props.dispatch(addToWishlist(product));
        this.setState(() => ({snackbarOpen: true, snackbarMessage: ADDED_TO_WISHLIST_SNACKBAR}));
    };

    render(){

        const renderHTML = (rawHTML: string) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });

        if(this.state.isLoading){
            return <LoadingScreen/>
        }
        else if(this.state.productNotFound){
            return <InformationPanel
                    panelTitle={"Товар не найден"}
                    informationHeading={"Вы находитесь на неправильной странице!"}
                    message={"Пожалуйста выберите другой товар."}
                    />
        }

        return (
            <div className="wrapper">
                <MetaTags>
                    <title>{this.state.product.name}</title>
                    <meta name="description" content={this.state.product.metaDescription} />
                    <meta name="keywords" content={this.state.product.metaKeyWords}/>
                </MetaTags>
                <Grid className={"home-page-div product-info-style"}>
                    <Row>
                        <br/><br/>

                        <h2><p style={{color: '#ff0059'}}>{this.state.product.name}</p></h2>
                        <hr />
                        <Col lg={4} md={4} sm={4} xsHidden>
                            <div className={"margin-div-five cursor-zoom"}>
                                <ReactImageZoom {...{
                                    width: 300,
                                    height: 200,
                                    zoomWidth: 500,
                                    img: this.state.product.image ? this.state.product.image : image,
                                    zoomStyle: 'z-index: 999;',
                                }} />
                            </div>
                            <div className={"product-info-star-rating hidden-sm"}>
                                {(this.state.product.ratings && this.state.product.ratings > 0) ?
                                    <div>
                                        <StarRatingComponent
                                            rating={this.state.product.ratings}
                                            starDimension={"20px"}
                                            starSpacing={"0px"}
                                            starRatedColor={"rgb(247, 202, 37)"}
                                        />
                                        {this.state.product.numberOfRatings &&
                                        <span className={"product-info-number-of-ratings"}>
                                                {this.state.product.numberOfRatings} ratings
                                            </span>
                                        }
                                    </div>
                                    :
                                    <span className={"not-enough-ratings-span"}>У товара нет рейтинга</span>
                                }
                            </div>
                        </Col>

                        <Col lg={6} md={6} sm={6} xs={11}>

                            <div className={"margin-div-five hidden-lg hidden-md hidden-sm"}>
                                <img width={300} height={200} alt="Вверх" src={this.state.product.image ? this.state.product.image : image} />
                            </div>

                            <div className={"product-info-price"}>
                                <div className={"product-info-star-rating hidden-lg hidden-md"}>
                                    {(this.state.product.ratings && this.state.product.ratings > 0) ?
                                        <div>
                                            <StarRatingComponent
                                                rating={this.state.product.ratings}
                                                starDimension={"20px"}
                                                starSpacing={"0px"}
                                                starRatedColor={"rgb(247, 202, 37)"}
                                            />
                                            {this.state.product.numberOfRatings &&
                                            <span className={"product-info-number-of-ratings"}>
                                                {this.state.product.numberOfRatings} ratings
                                            </span>
                                            }
                                        </div>
                                        :
                                        <span className={"not-enough-ratings-span"}>У товара нет рейтинга</span>
                                    }
                                </div>
                                <span><b>Цена:</b> </span>
                                {this.state.product.originalPrice &&
                                <span className={"product-deal-price-st"}>{this.state.product.originalPrice} </span>}
                                <span className={"product-info-savings"}>{this.state.product.price} ₽</span>
                                {this.state.product.originalPrice &&
                                <p className={"product-info-savings-discount"}>
                                    Скидка составляет {(this.state.product.originalPrice - this.state.product.price).toFixed(2)} ₽
                                </p>
                                }
                            </div>

                            <div className={"margin-div-five"}>
                                <div className={"product-info-seller-name"}>
                                    <span><b>Тип: </b></span>
                                    <span> {this.state.product.category}</span>
                                </div>
                            </div>

                            <div className={"margin-div-five"}>
                                <div className={"product-info-seller-name"}>
                                    <span><b>Брэнд: </b></span>
                                    <span> {this.state.product.brand}</span>
                                </div>
                            </div>

                            <div className={"margin-div-five"}>
                                <div className={"product-info-seller-name"}>
                                    <span><b>Страна/производитель: </b></span>
                                    <span> {this.state.product.sellerName}</span>
                                </div>
                            </div>

                            <div className={"product-info-left-margin margin-bottom-three"}>
                                <hr />
                                <span className={"fast-shipping-span"}>
                                На складе: {this.state.product.realCount ? this.state.product.realCount : '0'} шт.
                            </span>
                                <span>
                                {this.state.checkedToCart ?
                                    <span className={"not-enough-ratings-span"}> &ensp; &ensp; Уже в корзине</span> :
 //                                   <Button
 //                                       bsStyle={"warning"}
 //                                       className={"add-to-cart-product btn-sm"}
 //                                       onClick={this.addToCartOnClick}
 //                                   > &ensp; <Glyphicon glyph={"shopping-cart"} className={"cart-symbol-size"}/> &ensp; В корзину &ensp;
 //                                   </Button>
                                    <div>
                                        <br/>
                                        <Button bsStyle={"warning"} className={"btn-sm view-atc-button"} onClick={this.addToCartOnClick}>
                                            <Glyphicon glyph={"shopping-cart"} className={"cart-symbol-size"}/>
                                            {/*&ensp; В корзину*/}
                                        </Button>
                                    </div>
                                }

                                    {/*{this.props.authentication.isAuthenticated &&*/}
                                    {/*<Button onClick={this.handleAddToWishlist}>Add to Wishlist</Button>}*/}
                            </span>
                            </div>

                            {/*<div className={"product-info-left-margin"}>*/}
                            {/*<FormGroup controlId="formQuantitySelect" className={"quantity-select"}>*/}
                            {/*<ControlLabel>Quantity</ControlLabel>*/}
                            {/*<FormControl*/}
                            {/*type="number"*/}
                            {/*value={this.state.quantity}*/}
                            {/*onChange={this.onQuantityChange}*/}
                            {/*onBlur={this.onQuantityBlur}*/}
                            {/*/>*/}
                            {/*</FormGroup>*/}
                            {/*</div>*/}

                            {/*{this.state.product.fastShipping ?*/}
                            {/*<div className={"product-info-left-margin margin-bottom-three"}>*/}
                            {/*<span className={"fast-shipping-span"}>*/}
                            {/*<Glyphicon glyph={"ok"} className={"color-darkcyan"}/> This item qualifies for fast shipping.*/}
                            {/*</span>*/}
                            {/*</div> : ''}*/}

                        </Col>
                    </Row>

                    <br />

                    <Row>
                        <Col lgOffset={1} mdOffset={1} lg={10} md={10} sm={11} xs={11}>
                            <div className={"product-info-left-margin"}>
                                <h2 className={"product-description-heading"}>Описание:</h2>
                                <hr/>
                                <p className={"product-description"}>{renderHTML(this.state.product.productDescription)}</p>
                            </div>
                        </Col>
                    </Row>

                    <div>
                        <Snackbar
                            open={this.state.snackbarOpen}
                            message={this.state.snackbarMessage}
                            action="Добавлено"
                            autoHideDuration={this.state.autoHideDuration}
                            onActionClick={this.handleUndoAction}
                            onRequestClose={this.handleSnackbarRequestClose}
                        />
                    </div>
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

export default connect(mapStateToProps)(ProductInfo);