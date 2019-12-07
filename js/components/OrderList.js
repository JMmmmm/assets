import React from "react";
import {Grid, Row, Col, Panel, ListGroup} from "react-bootstrap";
import axios, {getHeaders} from "../api/axiosInstance";
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import CustomListGroupItem from '../components/CustomListGroupItemOrder';
import {ACCESS_TOKEN, LOG_IN, LOG_OUT, PRICE_HIGH_TO_LOW, PRICE_LOW_TO_HIGH} from "../api/strings";
import {userordersAPI} from "../api/apiURLs";
import LoadingScreen from "../components/LoadingScreen";
import LoadingOrderAnimation from 'react-loading-order-with-animation';
import Slide from 'react-reveal/Slide';
import Jump from 'react-reveal/Jump';
import Wobble from 'react-reveal/Wobble';
import Bounce from 'react-reveal/Bounce';

// const OrderPanels = (props) => (
//
//     <Panel>
//         <Panel.Heading className={"order-list-panel-heading"}>
//             <Panel.Title className={"order-list-panel-title"}>
//                 <Row>
//                     <Col lg={10} md={10} sm={10} xs={10}>
//                         <Row>
//                             <Col lg={3} md={3} sm={3} xs={3}>
//                                 <span className={"bold-text order-panel-headings"}>Создан</span>
//                             </Col>
//                             <Col lg={2} md={2} sm={2} xs={2}>
//                                 <span className={"bold-text order-panel-headings"}>Номер</span>
//                             </Col>
//                             <Col lg={2} md={2} sm={2} xs={2}>
//                                 <span className={"bold-text order-panel-headings"}>Cумма</span>
//                             </Col>
//                             <Col lg={2} md={2} sm={2} xs={2}>
//                                 <span className={"bold-text order-panel-headings"}>Товары</span>
//                             </Col>
//                             <Col lg={3} md={3} sm={3} xs={3}>
//                                 <span className={"bold-text order-panel-headings"}>Статус</span>
//                             </Col>
//                         </Row>
//
//                         <Row>
//                             <Col lg={3} md={3} sm={3} xs={3}>
//                                 <span className={"order-panel-attributes"}>{props.orderDate.split(" ")[0]}</span>
//                             </Col>
//                             <Col lg={2} md={2} sm={2} xs={2}>
//                                 <span className={"order-panel-attributes"}>{props.orderID}</span>
//                             </Col>
//                             <Col lg={2} md={2} sm={2} xs={2}>
//                                 <span className={"order-panel-attributes"}>{props.orderTotal}₽</span>
//                             </Col>
//                             <Col lg={2} md={2} sm={2} xs={2}>
//                                 <span className={"order-panel-attributes"}>{props.itemCount}</span>
//                             </Col>
//                             <Col lg={3} md={3} sm={3} xs={3}>
//                                 <span className={"order-panel-attributes"}>{props.orderStatus}</span>
//                             </Col>
//                         </Row>
//                     </Col>
//                     <Col lg={2} md={2} sm={2} xs={2}>
//                         <div className="pretty p-fill p-curve p-jelly p-rotate p-icon p-toggle p-plain">
//                             <input
//                                 type="checkbox"
//                                 onChange={checked => this.showOrderProducts(category, checked)}
//                             />
//                             <div className="state p-success-o p-on">
//                                 <i className="icon glyphicon glyphicon-eye-open"></i>
//                             </div>
//                             <div className="state p-off">
//                                 <i className="icon glyphicon glyphicon-eye-close"></i>
//                             </div>
//                         </div>
//                     </Col>
//                 </Row>
//             </Panel.Title>
//         </Panel.Heading>
//         <Panel.Body className={isProductsShown
//             ? "order-list-panel-body"
//             : 'order-list-panel-body-hidden'}>
//             {props.children}
//         </Panel.Body>
//     </Panel>
// );


class OrderList extends React.Component {

    state = {
        orders: [],
        isLoading: false,
        isProductsShown: [],
    };

    componentDidMount(){
        // if(this.props.authentication.isAuthenticated){
            this.setState(() => ({isLoading: true}));
            const access_token = window.localStorage.getItem(ACCESS_TOKEN);
            const headers = getHeaders(access_token);
            axios.get(userordersAPI, {headers})
                .then((response) => {
                    const orders = response.data;
                    this.setState(() => ({orders, isLoading: false}));
                })
                .catch((error) => {
                    console.log(error.response);
                    this.setState(() => ({isLoading: false}));
                })
        // }
        // else{
        //     this.props.history.push("/login");
        // }
    }

    showOrderProducts = (orderID, checked) => {
        console.log(checked);
        let orders = this.state.isProductsShown;
        if (checked.target.checked) {
            orders.push(orderID);
            this.setState(() => ({
                isProductsShown: orders
            }));
        } else {
            let index = orders.indexOf(orderID);
            if (index > -1) {
                orders.splice(index, 1);
            }
            this.setState(() => ({
                isProductsShown: orders,
            }));
        }
        console.log(this.state.isProductsShown);
    };

    isShownOrder = (orderID) => {
        return this.state.isProductsShown.includes(orderID);
    };

    translateOrderStatus = (status) => {
        switch (status) {
            case 'OPEN':
                return (<span className={"order-panel-attributes order-status-new"}>Новый</span>);
            case 'NEW':
                return (<span className={"order-panel-attributes order-status-new"}>Новый</span>);
            case 'IN_PROCESS':
                return (<span className={"order-panel-attributes order-status-progress"}>В обработке</span>);
            case 'DENIED':
                return (<span className={"order-panel-attributes order-status-deny"}>Отменен</span>);
            case 'SUCCESS':
                return (<span className={"order-panel-attributes order-status-success"}>Выполнен</span>);
            default:
                return (<span className={"order-panel-attributes"}>Неизвестно</span>);
        }
    };

    render(){

        if(this.state.isLoading){
            return <LoadingScreen/>
        }

        return (
          <div>
              <h4>Мои заказы</h4>
              <hr/>
              <br/>
              {this.state.orders.length === 0 ?
              <p>Вы еще неосуществляли заказы.</p> :
              this.state.orders.map((item, mainIndex) => {

                  let products = (
                      <ListGroup key={mainIndex}>
                          {item.order_items.map((order_item, index) => (
                              <CustomListGroupItem
                                  key={index}
                                  sellerName={order_item.product.sellerName}
                                  ratings={order_item.product.ratings}
                                  productID={order_item.product.productId}
                                  currentPrice={order_item.price}
                                  quantity={order_item.count}
                                  actualPrice={order_item.product.price}
                                  image={order_item.product.photo.photo}
                                  checked={order_item.product.checkedToCart}
                              >
                                  {order_item.product.name}
                              </CustomListGroupItem>
                          ))}
                      </ListGroup>
                  );
                  // return <OrderPanels
                  //           key={item.orderId}
                  //           orderDate={item.orderDate}
                  //           orderTotal={item.totalAmount}
                  //           itemCount={item.order_items.length}
                  //           orderID={item.orderId}
                  //           orderStatus={item.status}
                  //           isProductsShown={this.state.isProductsShown}
                  //       >
                  //           {products}
                  //       </OrderPanels>

                  return (
                  <Panel>
                      <Panel.Heading className={"order-list-panel-heading nice-background-standart"}>
                          <Panel.Title className={"order-list-panel-title"}>
                              <Row>
                                  <Col lg={10} md={10} sm={10} xs={10}>
                                      <Row>
                                          <Col lg={2} md={2} sm={2} xsHidden>
                                              <span className={"bold-text order-panel-headings"}>Создан</span>
                                          </Col>
                                          <Col lg={2} md={2} sm={2} xs={4}>
                                              <span className={"bold-text order-panel-headings"}>Номер</span>
                                          </Col>
                                          <Col lg={2} md={2} sm={2} xs={4}>
                                              <span className={"bold-text order-panel-headings"}>Cумма</span>
                                          </Col>
                                          <Col lg={2} md={2} sm={2} xsHidden>
                                              <span className={"bold-text order-panel-headings"}>Товары</span>
                                          </Col>
                                          <Col lg={2} md={2} sm={2} xs={4}>
                                              <span className={"bold-text order-panel-headings"}>Статус</span>
                                          </Col>
                                          <Col lg={2} md={2} sm={2} xsHidden>
                                              <span className={"bold-text order-panel-headings"}>Оплата</span>
                                          </Col>
                                      </Row>

                                      <Row>
                                          <div onClick={checked => this.showOrderProducts(item.orderId, checked)}>
                                              <Col lg={2} md={2} sm={2} xsHidden>
                                                  <span className={"order-panel-attributes"}>{item.orderDate.split(" ")[0]}</span>
                                              </Col>
                                              <Col lg={2} md={2} sm={2} xs={4}>
                                                  <span className={"order-panel-attributes"}>{item.orderId}</span>
                                              </Col>
                                              <Col lg={2} md={2} sm={2} xs={4}>
                                                  <span className={"order-panel-attributes"}>{item.totalAmount}₽</span>
                                              </Col>
                                              <Col lg={2} md={2} sm={2} xsHidden>
                                                  <span className={"order-panel-attributes"}>{item.order_items.length}</span>
                                              </Col>
                                              <Col lg={2} md={2} sm={2} xs={4}>
                                                  {this.translateOrderStatus(item.status)}
                                              </Col>
                                              <Col lg={2} md={2} sm={2} xsHidden>
                                                  <span className={"order-panel-attributes"}>{item.payment}</span>
                                              </Col>
                                          </div>
                                      </Row>
                                  </Col>
                                  <Col lg={2} md={2} sm={2} xs={2}>
                                      <div className="pretty p-fill p-curve p-jelly p-rotate p-icon p-toggle p-plain">
                                          <input
                                              type="checkbox"
                                              onChange={checked => this.showOrderProducts(item.orderId, checked)}
                                          />
                                          <div className="state p-success-o p-on">
                                              <i className="icon glyphicon glyphicon-eye-open"></i> &ensp; &ensp; Скрыть
                                          </div>
                                          <div className="state p-off">
                                              <i className="icon glyphicon glyphicon-eye-close"></i> &ensp; &ensp; Открыть
                                          </div>
                                      </div>
                                  </Col>
                              </Row>
                          </Panel.Title>
                      </Panel.Heading>
                      <Panel.Body className={this.state.isProductsShown.includes(item.orderId)
                          ? "order-list-panel-body"
                          : 'order-list-panel-body-hidden'}>
                          <Bounce
                              left when={this.state.isProductsShown.includes(item.orderId)}
                          >
                              {products}
                          </Bounce>
                      </Panel.Body>
                  </Panel>
                  )
              })
              }
          </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authentication: state.authentication
    };
};

export default connect(mapStateToProps)(withRouter(OrderList));

