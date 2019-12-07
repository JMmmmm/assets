import React from 'react';
import {Grid, Row, Col, ListGroup, DropdownButton, MenuItem, Button, Panel, Glyphicon, Form} from 'react-bootstrap';
import Pagination from "react-js-pagination";
import CustomListGroupItem from './CustomListGroupItemProduct';
import AdvancedFilters from './AdvancedFilters';
import AdvancedFiltersModal from './AdvancedFiltersModal';
import axios from "../api/axiosInstance";
import {searchProductsAPI} from "../api/apiURLs";
import LoadingScreen from "../components/LoadingScreen";
import {Link} from "react-router-dom";
import ReactRevealText from 'react-reveal-text';
import {
    ACCESS_TOKEN,
    ANY, MORE_THAN_FOUR, MORE_THAN_THREE, NEW, NO, ONE_TO_THREE, PRICE_HIGH_TO_LOW, PRICE_LOW_TO_HIGH, RATINGS,
    YES
} from "../api/strings";
import ScrollToTop from "react-scroll-up";
import {logoutUser} from "../actions/authentication";

class SearchResultsComponent extends React.Component{

    state = {
        sortBySelected: NEW,
        sortByOptions: [PRICE_LOW_TO_HIGH, PRICE_HIGH_TO_LOW, RATINGS],
        activePage: 1,
        totalItemsCount: 55,
        advancedFilterModalShow: false,
        products: [],
        isLoading: false,
        originalProducts: [],
        brands: [],
        rememberBrands: [],
        filterApplied: undefined,
        categories: [],
        rememberCategories: [],
        subCategories: [],
    };

    componentDidMount(){
        let category = this.props.match.params.category;
        let query = this.props.match.params.query;
        const url = searchProductsAPI(category, query);
        const access_token = window.localStorage.getItem(ACCESS_TOKEN);
        const headers = {Accept: "application/json", Authorization: `Bearer ${access_token}`};
        // fetch initial data in this function here
        this.setState(() => ({isLoading: true}));
        axios.get(url, {headers})
            .then((response) => (this.setState(
                {
                    originalProducts: response.data.products,
                    products: response.data.products,
                    totalItemsCount: response.data.products.length,
                    isLoading: false,
                    activePage: 1,
                    subCategories: response.data.categories,
                    brands: response.data.brands,
                }
            )))
            .catch((error) => {
                console.log(error);
                window.localStorage.removeItem(ACCESS_TOKEN);
                this.props.dispatch(logoutUser());
                // window.location.reload(true);
                window.location.assign("/");
            });
        setTimeout(() => {
            this.sortByChange(PRICE_LOW_TO_HIGH);
        }, 500);
    }

    componentWillReceiveProps(nextProps){
        let currentCategory = this.props.match.params.category;
        let currentQuery = this.props.match.params.query;

        let newCategory = nextProps.match.params.category;
        let newQuery = nextProps.match.params.query;
        if((currentCategory !== newCategory) || (currentQuery !== newQuery)){
            const url = searchProductsAPI(newCategory, newQuery);
            const access_token = window.localStorage.getItem(ACCESS_TOKEN);
            const headers = {Accept: "application/json", Authorization: `Bearer ${access_token}`};
            this.setState(() => ({isLoading: true}));
            axios.get(url, {headers})
                .then((response) => (this.setState(
                {
                    originalProducts: response.data.products,
                    products: response.data.products,
                    totalItemsCount: response.data.products.length,
                    isLoading: false,
                    activePage: 1,
                    subCategories: response.data.categories,
                    brands: response.data.brands,
                }
                )))
                .catch((error) => {
                    console.log(error);
                    window.localStorage.removeItem(ACCESS_TOKEN);
                    this.props.dispatch(logoutUser());
                    // window.location.reload(true);
                    window.location.assign("/");
                });
        }
        setTimeout(() => {
            this.sortByChange(PRICE_LOW_TO_HIGH);
        }, 500);
    }

    handlePageChange = (pageNumber) => {
        window.scrollTo(0, 0);
        this.setState({activePage: pageNumber});
    };

    sortByChange = (selectedSortBy) => {
        switch(selectedSortBy){
            case PRICE_LOW_TO_HIGH:
                this.setState((prevState) => {
                    return {
                        sortByOptions:
                            prevState.sortByOptions.concat(prevState.sortBySelected).filter((menuItem) => (
                                menuItem !== PRICE_LOW_TO_HIGH
                            )),
                        sortBySelected: PRICE_LOW_TO_HIGH,
                        products: prevState.products.sort((a, b) => {
                            return a.price > b.price ? 1 : -1;
                        })
                    }
                });
                break;
            case PRICE_HIGH_TO_LOW:
                this.setState((prevState) => {
                    return {
                        sortByOptions:
                            prevState.sortByOptions.concat(prevState.sortBySelected).filter((menuItem) => (
                                menuItem !== PRICE_HIGH_TO_LOW
                            )),
                        sortBySelected: PRICE_HIGH_TO_LOW,
                        products: prevState.products.sort((a, b) => {
                            return a.price < b.price ? 1 : -1;
                        })
                    }
                });
                break;
            case RATINGS:
                this.setState((prevState) => {
                    return {
                        sortByOptions:
                            prevState.sortByOptions.concat(prevState.sortBySelected).filter((menuItem) => (
                                menuItem !== RATINGS
                            )),
                        sortBySelected: RATINGS,
                        products: prevState.products.sort((a, b) => {
                            return a.ratings < b.ratings ? 1 : -1;
                        })
                    }
                });
                break;
            default:
                this.setState((prevState) => {
                    return {
                        sortByOptions:
                            prevState.sortByOptions.concat(prevState.sortBySelected).filter((menuItem) => (
                                menuItem !== NEW
                            )),
                        sortBySelected: NEW,
                        products: prevState.products.sort((a, b) => {
                            return a.timeStamp < b.timeStamp ? 1 : -1;
                        })
                    }
                });
                break;
        }
    };

    advancedFiltersModalShow = () => {
      this.setState(() => ({
          advancedFilterModalShow: true,
          products: this.state.originalProducts,
          filterApplied: undefined,
          totalItemsCount: this.state.originalProducts.length,
      }));
    };

    advancedFiltersModalHide = () => {
        this.setState(() => ({advancedFilterModalShow: false}));
    };

    applyFilters = ({ratings = ANY, from, to, fast_shipping = ANY}) => {
        const {sortBySelected} = this.state;
        const products = this.state.originalProducts.filter((product) => {
            const rating = ((r) => {switch (r){
                case MORE_THAN_FOUR:{
                    return product.ratings > 4;
                }
                case MORE_THAN_THREE:{
                    return product.ratings > 3;
                }
                case ONE_TO_THREE:{
                    return (product.ratings >= 1 && product.ratings <= 3);
                }
                default:{
                    return product;
                }
            }})(ratings);
            let from_to = product;
            if(from && to){
                from_to = product.price >= from && product.price <= to;
            }

            const shipping = ((s) => {
                switch (s){
                    case true:{
                        return product.featured_being_shipping === true;
                    }
                    // case NO:{
                    //     return product.fastShipping.toString() === "0";
                    // }
                    default:{
                        return product;
                    }
                }
            })(fast_shipping);

            return rating && from_to && shipping;
        }).sort((a, b) => {
            if(sortBySelected === RATINGS){
                return a.ratings < b.ratings ? 1 : -1;
            }
            else if(sortBySelected === PRICE_LOW_TO_HIGH){
                return a.price > b.price ? 1 : -1;
            }
            else if(sortBySelected === PRICE_HIGH_TO_LOW){
                return a.price < b.price ? 1 : -1;
            }
            else{
                return a.timeStamp < b.timeStamp ? 1 : -1;
            }
        });

        this.setState(() => ({
            products,
            filterApplied: true,
            totalItemsCount: products.length,
            activePage: 1
        }));
    };

    denySubCategory = (subCategory) => {
        this.state.rememberCategories = this.state.rememberCategories.filter((category) => {
            console.log(subCategory === category);
            return subCategory !== category;
        })
    };

    applySubCategory = (subCategory, checked) => {
        console.log(subCategory);
        if (checked.target.checked) {
            this.state.rememberCategories.push(subCategory);
            this.makeExtraFilter();
        } else {
            this.denySubCategory(subCategory);
            if (this.state.rememberCategories.length === 0 && this.state.rememberBrands.length === 0) {
                this.setState(() => ({
                    products: this.state.originalProducts,
                    filterApplied: undefined,
                    totalItemsCount: this.state.originalProducts.length,
                }));
            } else {
                console.log(this.state.rememberCategories.length);
                this.makeExtraFilter();
            }
        }
    };

    applyBrand = (brand, checked) => {
        if (checked.target.checked) {
            this.state.rememberBrands.push(brand);
            this.makeExtraFilter();
        } else {
            this.denyBrand(brand);
            if (this.state.rememberCategories.length === 0 && this.state.rememberBrands.length === 0) {
                this.setState(() => ({
                    products: this.state.originalProducts,
                    filterApplied: undefined,
                    totalItemsCount: this.state.originalProducts.length,
                }));
            } else {
                this.makeExtraFilter();
            }
        }
    };

    makeExtraFilter  = () => {
        const {sortBySelected} = this.state;
        const products = this.state.originalProducts.filter((product) => {
            let hasCategory = true;
            if (this.state.rememberCategories.length !== 0) {
                hasCategory = false;
                this.state.rememberCategories.forEach((category) =>
                {
                    if (product.category === category) {
                        hasCategory = true;
                    }
                });
            }

            let hasBrand = true;
            if (this.state.rememberBrands.length !== 0) {
                hasBrand = false;
                this.state.rememberBrands.forEach((brand) =>
                {
                    if (product.brand === brand) {
                        hasBrand = true;
                    }
                });
            }

            return hasCategory && hasBrand;
        }).sort((a, b) => {
            if(sortBySelected === RATINGS){
                return a.ratings < b.ratings ? 1 : -1;
            }
            else if(sortBySelected === PRICE_LOW_TO_HIGH){
                return a.price > b.price ? 1 : -1;
            }
            else if(sortBySelected === PRICE_HIGH_TO_LOW){
                return a.price < b.price ? 1 : -1;
            }
            else{
                return a.timeStamp < b.timeStamp ? 1 : -1;
            }
        });

        this.setState(() => ({
            products,
            filterApplied: true,
            totalItemsCount: products.length,
            activePage: 1
        }));
    };

    denyBrand = (brand) => {
        this.state.rememberBrands = this.state.rememberBrands.filter((brandOs) => {
            console.log(brand === brandOs);
            return brand !== brandOs;
        })
    };

    setArrowType = (selected) => {
        if (selected == PRICE_LOW_TO_HIGH) {
           return <Glyphicon glyph={"arrow-up"}/>;
        } else if(selected == PRICE_HIGH_TO_LOW) {
            return <Glyphicon glyph={"arrow-down"}/>;
        }
    }

    clearFilters = () => {
        const {sortBySelected} = this.state;
        const products = this.state.originalProducts.sort((a, b) => {
            if(sortBySelected === RATINGS){
                return a.ratings < b.ratings ? 1 : -1;
            }
            else if(sortBySelected === PRICE_LOW_TO_HIGH){
                return a.price > b.price ? 1 : -1;
            }
            else if(sortBySelected === PRICE_HIGH_TO_LOW){
                return a.price < b.price ? 1 : -1;
            }
            else{
                return a.timeStamp < b.timeStamp ? 1 : -1;
            }
        });

        this.setState(() => (
            {
                products,
                filterApplied: undefined,
                totalItemsCount: products.length,
                activePage: 1
            }
            ));
    };

    render() {
        if(this.state.isLoading){
            return <LoadingScreen/>
        }

        let width = window.innerWidth;
        let items = [];
        const {activePage, products} = this.state;
        const end = (activePage*12) - 1;
        const start = end - 11;
        // const end = products.length;
        for (let i = start; i <= end; i++ ) {
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

        let newItems = [];
        let preEnd = items.length - 1;
        let itemsEnd = items.length;
        if (width < 991) {
            for (let index = 0; index <= itemsEnd; index++) {
                let realIndex = index + 1;

                if (itemsEnd % 2 && realIndex === itemsEnd) {
                    newItems.push([items[index]]);
                    break;
                } else {
                    if (realIndex % 2 === 0) {
                        newItems.push([items[index - 1], items[index]]);
                    }
                }
            }

        } else {
            for (let index = 0; index <= itemsEnd; index++ ) {
                let realIndex = index + 1;

                if (itemsEnd % 3 === 0) {
                    if (realIndex % 3 === 0) {
                        newItems.push([items[index - 2], items[index - 1], items[index]]);
                    }
                } else {
                    if (realIndex % 3 === 0) {
                        newItems.push([items[index - 2], items[index - 1], items[index]]);
                    } else if (realIndex === preEnd) {
                        newItems.push([items[index], items[index + 1]]);
                        break;
                    } else if (realIndex === itemsEnd) {
                        newItems.push([items[index]]);
                    }
                }
            }
        }

        let priceArrow = '';
        if (this.state.sortBySelected == PRICE_LOW_TO_HIGH) {
            priceArrow = <Glyphicon glyph={"arrow-up"}/>;
        } else if(this.state.sortBySelected == PRICE_HIGH_TO_LOW) {
            priceArrow = <Glyphicon glyph={"arrow-down"}/>;
        }

        return (
            <Grid className={"minimum-height"}>
                <div className={'scroll-main-style'}>
                    <ScrollToTop
                        showUnder={110}
                        duration={500}
                        easing={'linear'}
                    >
                        <div className={"text-center"}>
                            <img width={50} height={50} alt="Вверх" src="/storage/site/arrow.png" />
                        </div>
                    </ScrollToTop>
                </div>
                {this.state.originalProducts.length > 0 ?
                    <Row>
                        <Row>
                            <Col lg={3} md={3} sm={4} xsHidden>
                                <div className={'subcategory-search-title'}>
                                    <span>Н а й д е н о </span>
                                    <span className={'subcategory-search-addition'}> {this.state.products.length}шт.</span>
                                </div>
                            </Col>
                            <Col lg={9} md={9} sm={8} xs={12}>
                                <div className={'hidden-lg hidden-md hidden-sm margin-bottom-style subcategory-search-title'}>
                                    <span>Н а й д е н о </span>
                                    <span className={'subcategory-search-addition'}> {this.state.products.length}шт.</span>
                                </div>


                                {width <= 510 ?
                                    <img height={100} alt="" src={"/storage/categories/default_img_desc.png"} /> :
                                    <img height={150} alt="" src={"/storage/categories/default_img_desc.png"} />}
                                <br/>

                                <div className={'subcategory-search-title-dolbaeb'}>
                                    {/*<label className={'sort-by-label'}>Расширенные параметры - </label>*/}
                                    <span>Сортировка {this.state.sortBySelected} {priceArrow} &ensp;</span>
                                    <DropdownButton
                                        bsStyle={'info'}
                                        title={''}
                                        key={'sortBy'}
                                        id={`dropdown-sort-by`}
                                        className={'btn-xs'}
                                    >
                                        {this.state.sortByOptions.map((sortByOption) => (
                                            <MenuItem key={sortByOption} onClick={() => this.sortByChange(sortByOption)}>{sortByOption} {this.setArrowType(sortByOption)}</MenuItem>
                                        ))}
                                    </DropdownButton>
                                    <div>
                                        <Button bsStyle={"warning"} className={"btn-md view-atc-button hidden-lg hidden-md hidden-sm"} onClick={this.advancedFiltersModalShow}>
                                            <Glyphicon glyph={"tasks"} className={"cart-symbol-size"}/>
                                            <span>&ensp; Настройки</span>
                                        </Button>
                                    </div>
                                    <hr/>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg={3} md={3} sm={5} xsHidden>
                                {/*<h4 className={"advanced-filter-heading"}>{this.state.sortBySelected} {priceArrow}</h4>*/}
                                <Row>
                                    <Col lg={12} md={12}>
                                        <AdvancedFilters
                                            applyFilters={this.applyFilters}
                                            clearFilters={this.clearFilters}
                                        />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col lg={12} md={12}>
                                        <div className={'common-style-for-categories-checkbox'}>
                                            <img height={100} className={"img-brand"} alt="На главную" src="/storage/site/razdels.svg"/>
                                            {this.state.subCategories.map((category) => (
                                                <div
                                                    key={category}
                                                    className={"pretty p-fill p-curve p-jelly p-rotate p-icon p-toggle p-plain style-for-categories-checkbox"}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name={category}
                                                        onChange={checked => this.applySubCategory(category, checked)}
                                                    />
                                                    <div className={"state p-success-o p-on"}>
                                                        <i className={"icon glyphicon glyphicon-ok"}></i>
                                                        <label
                                                            className={"style-for-checkbox-opacity-on"}
                                                        >{category}</label>
                                                    </div>

                                                    <div className={"state p-off"}>
                                                        <label
                                                            className={"style-for-checkbox-opacity-off"}
                                                        >{category}</label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col lg={12} md={12}>
                                        <div className={'common-style-for-categories-checkbox categories-checkbox-addition'}>
                                            <img height={100} className={"img-brand"} alt="На главную" src="/storage/site/brands.svg"/>
                                            {this.state.brands.map((brand) => (
                                                <div
                                                    key={brand}
                                                    className={"pretty p-fill p-curve p-jelly p-rotate p-icon p-toggle p-plain style-for-categories-checkbox"}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name={brand}
                                                        onChange={checked => this.applyBrand(brand, checked)}
                                                    />
                                                    <div className={"state p-success-o p-on"}>
                                                        <i className={"icon glyphicon glyphicon-ok"}></i>
                                                        <label
                                                            className={"style-for-checkbox-opacity-on"}
                                                        >{brand}</label>
                                                    </div>

                                                    <div className={"state p-off"}>
                                                        <label
                                                            className={"style-for-checkbox-opacity-off"}
                                                        >{brand}</label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={9} md={9} sm={7} xsOffset={1} smOffset={0} mdOffset={0} lgOffset={0}>

                                {products.length > 0 ? <div className={'category-search-style category-color-style'}>
                                        <div>
                                            <ListGroup className={'search-results-list'}>
                                                {newItems.map((item, index) => (
                                                    <Row key={index}>
                                                        {item}
                                                    </Row>
                                                ))}
                                            </ListGroup>
                                        </div>

                                        <div className={'pagination-div'}>
                                            <Pagination
                                                activePage={this.state.activePage}
                                                itemsCountPerPage={10}
                                                totalItemsCount={this.state.totalItemsCount}
                                                onChange={this.handlePageChange}
                                            />
                                        </div>
                                    </div> :

                                    <Row className={"star-rating-div"}>
                                        <Col lg={11} md={11}>
                                            <Panel bsStyle="warning">
                                                <Panel.Heading>
                                                    <Panel.Title componentClass="h3">Упс, ничего не найдено</Panel.Title>
                                                </Panel.Heading>
                                                <Panel.Body>
                                                    По использованному фильтру товаров - нет. Пожалуйста используйте другие фильтры.
                                                </Panel.Body>
                                            </Panel>
                                        </Col>
                                    </Row>
                                }
                            </Col>
                        </Row>
                </Row> :
                <Row>
                    <Col lg={12} md={12}>
                        <div className={"minimum-height text-center container"}>
                            <Panel bsStyle="primary">
                                <Panel.Heading>
                                    <Panel.Title componentClass="h3">Таких товаров нет</Panel.Title>
                                </Panel.Heading>
                                <Panel.Body>
                                    <img src={"/images/noproductfound.jpg"} alt={"No product found"}/>
                                    <h4>Мы постараемся приобрести данный товар в будущем!</h4>
                                    <p>Возможно вам подойдет другой товар.</p>
                                    <Link to={"/"}>Продолжить</Link>
                                </Panel.Body>
                            </Panel>
                        </div>
                    </Col>
                </Row>}
                <AdvancedFiltersModal
                    handleClose={this.advancedFiltersModalHide}
                    show={this.state.advancedFilterModalShow}
                    applyFilters={this.applyFilters}
                    clearFilters={this.clearFilters}
                    subCategories={this.state.subCategories}
                    brands={this.state.brands}
                    applySubCategory={this.applySubCategory}
                    applyBrand={this.applyBrand}
                />
            </Grid>
        )
    }
}

export default SearchResultsComponent;