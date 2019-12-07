import React from "react";
import {Link} from "react-router-dom";
import {Panel, Glyphicon} from "react-bootstrap";

const NoCheckoutItems = () => (
    <div>
        <Panel bsStyle="primary">
            <Panel.Heading>
                <Panel.Title componentClass="h3">Корзина пуста</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
                {/*<h4>There are no items to checkout</h4>*/}
                {/*<p>Browse our wide range of collections or search for your product to get started</p>*/}

                <div>
                    <Glyphicon glyph={"hand-down"} className={"empty-checkout-size"}/>
                </div>
                <div>
                    <Glyphicon glyph={"shopping-cart"} className={"empty-checkout-size"}/>
                </div>
                <br/><br/>
                <Link to={"/"}>Продолжить покупки</Link>
            </Panel.Body>
        </Panel>
    </div>
);

export default NoCheckoutItems;