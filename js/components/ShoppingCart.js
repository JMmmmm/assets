import React from "react";
import {Modal, Button, ListGroup, Row, Col} from "react-bootstrap";
import CustomListGroupItem from "../components/CustomListGroupItemCart";
import { connect } from 'react-redux';
import {withRouter} from "react-router-dom";

export const totalReducer = (accumulator, item) => {
    return accumulator + (item.quantity * item.price);
};

class ShoppingCart extends React.Component{

    onCheckoutClick = () => {
      this.props.handleCheckout();
      this.props.history.push("/checkout");
    };

    onDenyClick = () => {
        this.props.handleClose();
        this.props.history.push("/");
    };

    render(){
        let itemCount = this.props.shoppingCart.length;
        let cartContent;
        if(itemCount > 0){
            let total = this.props.shoppingCart.reduce(totalReducer, 0);
            cartContent = (
                <div>
                    <ListGroup className={"shopping-cart-listgroup"}>
                        {this.props.shoppingCart.map((item, key) => {
                            return <CustomListGroupItem key={item.productID} {...item} {...this.props} />;
                        })}
                    </ListGroup>

                    <div className={"total-cart-label-div"}>
                        <Row>
                            <Col lg={9} md={9}>
                                <span className={"total-cart-label"}>Сумма</span>
                            </Col>

                            <Col lg={3} md={3}>
                                <span className={"total-cart-amount"}>
                                    {parseFloat(total).toFixed(2)} ₽
                                </span>
                            </Col>
                        </Row>
                    </div>
                </div>);
        }
        else{
            cartContent = (
                <div>
                    <span>Вы еще ничего не добавили.</span>
                </div>
            )
        }
        return (
            <Modal show={this.props.show} onHide={this.props.handleClose} className={'sizeShoppingCart'} >
                <Modal.Header closeButton>
                    <Modal.Title>Корзина</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {cartContent}
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.onDenyClick}>Вернуться</Button>

                    <Button bsStyle="primary" onClick={this.onCheckoutClick}>Купить</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        shoppingCart: state.shoppingCart
    };
};

export default connect(mapStateToProps)(withRouter(ShoppingCart));