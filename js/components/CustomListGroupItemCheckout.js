import React from "react";
import {Row, Col, Button, FormControl, Popover, ButtonToolbar, Overlay, Glyphicon, Tooltip, OverlayTrigger} from "react-bootstrap";
import ProductInfo from "./ProductInfo";
import { connect } from 'react-redux';
import {editCart} from "../actions/shoppingCart";
import { withRouter } from 'react-router-dom';

const tooltip = (
    <Tooltip id="tooltip">
        Убрать из корзины
    </Tooltip>
);

class CustomListGroupItemCheckout extends React.Component{

    state = {
        quantity: this.props.quantity,
        productID: this.props.productID,
        showRemoveConfirmation: false
    };

    handleRemoveClick = e => {
        this.setState({ target: e.target, showRemoveConfirmation: !this.state.showRemoveConfirmation });
    };

    handleConfirmationCancel = () => {
        this.setState({showRemoveConfirmation: false})
    };

    editCart = (quantity) => {
        let updates = {
          quantity
        };
        this.props.dispatch(editCart(this.state.productID, updates));
    };

    onQuantityChange = (e) => {
        let quantity = e.target.value;
        if(quantity.length < 3){
            this.setState(() => ({quantity}));
        }
    };

    onQuantityBlur = (e) => {
        let quantity = e.target.value;
        if(quantity.length > 0 && parseInt(quantity) > 0 && parseInt(quantity) < 100){
            this.setState(() => ({quantity}));
            this.editCart(parseInt(quantity));
        }
        else{
            this.setState(() => ({quantity: 1}));
            this.editCart(1);
        }
    };

    removeFromCart = (e) => {
        e.stopPropagation();
        ProductInfo.removeItemFromCart(this.state.productID, this.props);
        // window.location.assign("/checkout");
    };

    render() {
        return (
            <li className="list-group-item">
                {/*<div className={"media-left"}>*/}
                    {/*<img className="media-object" src={this.props.productImage} alt="..." width={64} height={64} />*/}
                {/*</div>*/}
                {/*<div className={"media-body"}>*/}
                    <Row>
                        <Col lg={4} md={4} sm={4} xs={12}>
                            <h4 className={"media-heading"}>{this.props.productName}</h4>
                            {/*<div className={"seller-name-div"}>*/}
                                {/*<span>{this.props.sellerName}</span>*/}
                            {/*</div>*/}

                        </Col>

                        {/*<Col lg={2} md={2} sm={2} xs={12}>*/}
                            {/*<div className={"star-rating-div"}>*/}
                                {/*/!*<span>Quantity: </span>*!/*/}
                                {/*<span className={"checkout-quantity"}>*/}
                                    {/*&ensp; {this.state.quantity}*/}
                                {/*</span>*/}
                            {/*</div>*/}
                        {/*</Col>*/}

                        <Col md={5} lg={5} sm={5}>
                            <div className={"checkout-price-div"}>
                              <span className={"cart-price"}>
                                  {parseFloat(parseFloat(this.props.price) * parseInt(this.state.quantity)).toFixed(2)} ₽
                              </span>
                            </div>
                        </Col>
                        <Col md={3} lg={3} sm={3}>
                            <div>
                                <ButtonToolbar>
                                    <Button onClick={this.handleRemoveClick} bsStyle={"danger"} className={"btn-sm"}>Убрать</Button>

                                    <Overlay
                                        show={this.state.showRemoveConfirmation}
                                        target={this.state.target}
                                        placement="right"
                                        container={this}
                                        containerPadding={20}
                                    >
                                        <Popover id="popover-contained" title="Вы уверены?">
                                            <span>
                                                <Button className={"btn-sm"} bsStyle={"danger"} onClick={this.removeFromCart}>Да</Button>
                                                <Button className={"btn-sm"} bsStyle={"link"} onClick={this.handleConfirmationCancel}>Отмена</Button>
                                            </span>
                                        </Popover>
                                    </Overlay>
                                </ButtonToolbar>
                            </div>
                            {/*<div className={'cart-remove-div1'}>*/}
                                {/*<OverlayTrigger placement="top" overlay={tooltip}>*/}
                                    {/*<span onClick={this.removeFromCart}><Glyphicon glyph={"remove"}/></span>*/}



                                {/*</OverlayTrigger>*/}
                            {/*</div>*/}
                        </Col>

                    </Row>
                {/*</div>*/}
            </li>
        )
    }
}

export default connect()(withRouter(CustomListGroupItemCheckout));