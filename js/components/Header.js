import React from 'react';
import { Navbar, Nav, NavItem, FormControl, FormGroup, NavDropdown, MenuItem, Button, Glyphicon, DropdownButton, InputGroup, Collapse, Grid, Col, Row } from 'react-bootstrap';
// import { Container, Collapse, Navbar, NavbarToggler, Nav, NavItem } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import ShoppingCart from '../components/ShoppingCart';
import { connect } from 'react-redux';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItemMUI from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import {loginUser} from "../actions/authentication";
import {addToCartHelper, emptyCart} from "../actions/shoppingCart";
import axios from "../api/axiosInstance";
import {getUserCartAPI, getAllCategories} from "../api/apiURLs";
import SearchBar from 'material-ui-search-bar';
import styled from 'styled-components';
import FlipMove from 'react-flip-move';
import Slide from 'react-reveal/Slide';
import Bounce from 'react-reveal/Bounce';
import LoginComponent from '../components/LoginComponent';
import {ACCESS_TOKEN} from "../api/strings";
import { bubble as BuMenu } from "react-burger-menu";
import ReactRevealText from 'react-reveal-text';

class Header extends React.Component{

    state = {
        isOpenCategories: false,
        isOpenEachCategory: false,
        isOpenAbout: false,
        isOpenDelivery: false,
        placeholder: "Поиск",
        menuItems: [],
        searchMenuItems: [],
        dropDownSelected: "All",
        dropDownSelectedView: "Все",
        searchBoxText: "",
        shoppingCartOpen: false,
        menuItemMUI: ["Log In", "My Orders", "Register"],
        open: false,
        activeClass: false,
        expanded: false,
        isMobile: false,
        positionY: 0,
        showStartText: false,
    };

    categoryStateChangeHelper = (t, name) => {
        this.setState((prevState) => {
            return {
                placeholder: "Поиск " + name,
                // searchMenuItems:
                //     prevState.searchMenuItems.concat(prevState.dropDownSelected).filter((menuItem) => (
                //         menuItem.slug !== t
                //     )),
                dropDownSelected: t,
                dropDownSelectedView: name
            }
        });
    };

    menuOptionsClick = (menuItemName) => {
        this.setState(() => ({open: false}));
        const url = "/".concat(menuItemName.split(" ").join("").toLowerCase());
        this.props.history.push(url);
    };

    mouseOut() {
        console.log("Mouse out!!!");
        this.setState({expanded: false});
    };

    touchChange() {
        let expanded = !this.state.expanded;
        this.setState({expanded: expanded});
    }

    touchOut = (menuItemName) => {
        // this.setState(() => ({expanded: false}));
        this.setState({expanded: false});
        this.categoryClickHandler(menuItemName);
    };

    touchOutMenuOptions = (menuItemName) => {
        this.setState(() => ({expanded: false}));
        this.menuOptionsClick(menuItemName);
    };

    mouseOver() {
        console.log("Mouse over!!!");
        this.setState({expanded: true});
    };

    changeMenuMUIOptionsAuthenticated = () => {
        this.setState(() => ({menuItemMUI: ["My account", "My Orders", "Divider", "Log out"]}));
    };

    changeMenuMUIOptionsUnauthenticated = () => {
        this.setState(() => ({menuItemMUI: ["Log In", "My Orders", "Register"]}));
    };

    componentWillReceiveProps(nextProps){
        let currentPath = this.props.location.pathname.toString();
        let nextPath = nextProps.location.pathname.toString();
        if(currentPath !== nextPath || this.props.authentication.isAuthenticated !== nextProps.authentication.isAuthenticated){
            // path is been changed
            // let t = nextPath.split('/',2)[1];
            // this.categoryStateChangeHelper(t);

            if(nextProps.authentication.isAuthenticated){
                this.changeMenuMUIOptionsAuthenticated();
            }
            else{
                this.changeMenuMUIOptionsUnauthenticated();
            }

            setTimeout(() => {
                this.setState({ showStartText: true });
            }, 1000);
        }
    };

    componentDidMount(){
        axios.get(getAllCategories)
            .then((response) => {
                this.setState(() => ({
                    menuItems: response.data,
                    searchMenuItems: response.data,
                }))
            })
            .catch((error) => {
                console.log(error);
            });

        if(this.props.authentication.isAuthenticated){
            this.changeMenuMUIOptionsAuthenticated();
        }
        else{
            this.changeMenuMUIOptionsUnauthenticated();
        }

        window.addEventListener("resize", this.resize.bind(this));
        window.addEventListener('scroll', this.handleScroll.bind(this));
        this.resize();
        this.handleScroll();

        setTimeout(() => {
            this.setState({ showStartText: true });
        }, 1000);
    };

    // Отслеживание событий
    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
        this.resize = this.resize.bind(this);
        setTimeout(() => {
            this.setState({ showStartText: true });
        }, 1000);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
        window.removeEventListener('resize', this.resize.bind(this));
    };

    handleScroll() {
        this.setState({positionY: window.pageYOffset});
    };

    resize() {
        this.setState({isMobile: window.innerWidth <= 767 || window.innerWidth === 960});
    }
    // Конец

    categoryOnHoverIn = (e) => {
        switch(e.target.id){
            case "categories":{
                this.setState({ isOpenCategories: true });
                break;
            }
            case "about":{
                this.setState({ isOpenAbout: true });
                break;
            }
            case "delivery":{
                this.setState({ isOpenDelivery: true });
                break;
            }
        }

    };

    categoryOnHoverOut = () => {
        this.setState(() => {
           return {
               isOpenCategories: false,
               isOpenAbout: false,
               isOpenDelivery: false,
               isOpenEachCategory: false,
           }
        });

    };

    openEachCategory = (state) => {
        this.setState({
            expanded: state.isOpen,
            isOpenEachCategory: !this.state.isOpenEachCategory
        });

/*        this.setState(() => {
            return {
                isOpenEachCategory: !this.state.isOpenEachCategory,
                expanded: !this.state.expanded
            }
        });*/
    };

    categoryClickHandler = (routeName) => {
        this.props.history.push(routeName);
    };

    onSearchFormSubmit = (e) => {
        e.preventDefault();
        let searchCategorySelected = this.state.dropDownSelected;
        this.setState({expanded: false});
        let searchQuery = this.state.searchBoxText;
        if(searchQuery.length > 1){
            this.props.history.push("/search/"+searchCategorySelected.toLowerCase()+"/"+searchQuery);
        }
        else{
            this.input.focus();
        }

    };

    searchBoxChange = (e) => {
        let searchBoxText = e.target.value;
        if(searchBoxText.length < 25){
            this.setState(() => ({searchBoxText}));
        }
    };

    searchCategoryChange = (t, selectedCategory) => {
        this.categoryStateChangeHelper(t, selectedCategory);
    };

    shoppingCartModalShow = () => {
        this.setState(() => ({
            shoppingCartOpen: true,
            expanded: false
        }));
    };

    shoppingCartModalHide = () => {
        this.setState(() => ({shoppingCartOpen: false}));
        if (this.state.isMobile) {
            this.setState(() => ({expanded: false}));
        }
        if(this.props.authentication.isAuthenticated){
            this.changeMenuMUIOptionsAuthenticated();
        }
        else{
            this.changeMenuMUIOptionsUnauthenticated();
        }
        window.location.reload(true);
        // let currentPath = window.location.hash.substr(1);
        // console.log(currentPath);
        // window.location.assign(currentPath);
    };

    shoppingCartModalCheckout = () => {
        this.setState(() => ({shoppingCartOpen: false}));
        if (this.state.isMobile) {
            this.setState(() => ({expanded: false}));
        }
        if(this.props.authentication.isAuthenticated){
            this.changeMenuMUIOptionsAuthenticated();
        }
        else{
            this.changeMenuMUIOptionsUnauthenticated();
        }
    };

    handleUserAccountClick = (event) => {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        });
    };

    handleUserAccountClose = () => {
        this.setState({
            open: false,
        });
    };

    addActiveClass() {
        this.setState({
            activeClass: true,
        })
    };

    closeActiveClass() {
        this.setState({
            activeClass: false,
            searchBoxText: ""
        })
    };

    updateHeaderCollapseToVertically() {

        let transformToVerticalDesign = false;
        if (this.state !== null && this.state.transformToVerticalDesign !== null) {
            transformToVerticalDesign = !this.state.transformToVerticalDesign;
        }
        this.setState(() => {
            return {
                transformToVerticalDesign: !transformToVerticalDesign
            }
        });
        console.log(this.state.transformToVerticalDesign);
    };

    setToogle() {
        let expanded = !this.state.expanded;
        this.setState(() => ({expanded: expanded}));
        // console.log(expanded);
    };

    linkToHome = () => {
        let expanded = !this.state.expanded;
        this.setState(() => ({expanded: expanded}));
        this.props.history.push('/');
        // window.location.replace("/");
    };

    render(){

        let shoppingCartTotal = this.props.shoppingCart ? this.props.shoppingCart.reduce((accumulator, item) => {
            return accumulator + item.quantity;
        }, 0) : 0;

        return this.state.isMobile ?

            <BuMenu
                className={"buMenu-style"}
                // pageWrapId={ "page-wrap" }
                // outerContainerId={"app"}
                onStateChange={(state) => this.openEachCategory(state) }
                isOpen={ typeof this.state.expanded !== 'undefined' ? this.state.expanded : false }
            >
                <Navbar.Header>
                    <div onClick={this.linkToHome} className={'link-to-home-div burger-menu-to-bottom'}>
                        <img height={50} className={"img-brand"} alt="На главную" src="/storage/site/logo.svg"/>
                    </div>
                </Navbar.Header>


                <div className={"search-down burger-menu-to-top"}>
                    <Navbar.Form>
                        <form onSubmit={this.onSearchFormSubmit}>
                            <FormGroup>
                            <span
                                key={1}
                                className={this.state.activeClass ? "control-size-default-onclick" : "control-size-default"}
                            >
                                <Glyphicon
                                    glyph={"search"}
                                    className={"button-search-symbol"}
                                    onClick={() => this.addActiveClass()}
                                />
                                <InputGroup>
                                    <FormControl type="text"
                                                 placeholder={this.state.placeholder}
                                                 value={this.state.searchBoxText}
                                                 onChange={this.searchBoxChange}
                                                 className={"search-form-text"}
                                                 inputRef={ref => {
                                                     this.input = ref;
                                                 }}
                                    />
                                    <Glyphicon
                                        glyph={"remove"}
                                        className={"button-close-symbol"}
                                        onClick={() => this.closeActiveClass()}
                                    />
                                </InputGroup>
                            </span>
                                <span
                                    key={2}
                                    className={this.state.activeClass ? 'inline-div-display shopping-cart-and-user' : 'inline-div-display'}
                                >
                                <Button onClick={this.shoppingCartModalShow} bsStyle={"link"}>
                                    <img className={"cart-symbol-size"} src="/storage/site/shopping_cart.jpg" />
                                    {shoppingCartTotal > 0 &&
                                    <span className="badge custom-cart-badge">
                                        {shoppingCartTotal}
                                    </span>
                                    }
                                </Button>
                                <div className={"inline-div-display"}>
                                    <Button
                                        onClick={this.handleUserAccountClick}
                                        bsStyle={"link"}
                                    >
                                        <img className={'cart-symbol-size'} src="/storage/site/person.jpg" />
                                    </Button>
                                    <Popover
                                        open={this.state.open}
                                        anchorEl={this.state.anchorEl}
                                        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                        targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                        onRequestClose={this.handleUserAccountClose}
                                        animation={PopoverAnimationVertical}
                                        className={'user-menu-style'}
                                    >
                                        <Menu>
                                            {this.state.menuItemMUI.map((item, key) => {
                                                if (item === "Divider") {
                                                    return <Divider className={"menuDivider user-menu-style"} key={key}/>
                                                }
                                                if (item === "Log In") {
                                                    var userMenuName = 'Войти';
                                                }
                                                if (item === "Register") {
                                                    var userMenuName = 'Зарегистрироваться';
                                                }
                                                if (item === "My account") {
                                                    var userMenuName = 'Аккаунт';
                                                }
                                                if (item === "My Orders") {
                                                    var userMenuName = 'Личный кабинет';
                                                }
                                                if (item === "Log out") {
                                                    var userMenuName = 'Выйти';
                                                }

                                                return <MenuItemMUI
                                                    className={"user-menu-style"}
                                                    primaryText={userMenuName} key={key}
                                                    onTouchEnd={() => this.touchOutMenuOptions(item)}
                                                    onClick={() => this.menuOptionsClick(item)}
                                                />
                                            })}
                                        </Menu>
                                    </Popover>
                                </div>
                                    </span>
                            </FormGroup>
                        </form>
                    </Navbar.Form>
                    <ShoppingCart
                        handleCheckout={this.shoppingCartModalCheckout}
                        handleClose={this.shoppingCartModalHide}
                        show={this.state.shoppingCartOpen}
                    />
                </div>

                {this.state.menuItems.map((menuItem, key) => (

                    <MenuItem
                        key={key}
                        // onTouchEnd={() => this.touchOut("/categories/" + menuItem.slug)}
                        onClick={() => this.touchOut("/categories/" + menuItem.slug)}
                        className={'dropdown-menu-vertical-design fix-size'}
                    >
                        <Slide
                            left when={this.state.isOpenEachCategory}
                        >
                            {menuItem.name}
                        </Slide>
                    </MenuItem>
                ))}

            </BuMenu>

            :

            <Navbar
                className={this.state.positionY < 50 ? "main-mega-style main-mega-style-under" : "main-mega-style"}
            >
                <Nav className={"vertical-align-middle menu-items-style"}>
                    <Link to={"/"} className={'to_main_style'}>Г л а в н а я &ensp; &ensp;</Link>

                    <NavDropdown
                        // onToggle={this.openEachCategory}
                        className={'dropdown-menu-vertical- design'}
                        // title="К а т а л о г"
                        title="К о н д и ц и о н е р ы"
                        id="categories"
                        onMouseEnter={this.openEachCategory}
                        onMouseLeave={this.openEachCategory}
                        open={this.state.isOpenEachCategory}
                        onTouchEnd={this.openEachCategory}
                        // onClick={() => this.categoryClickHandler("/categories")}
                        // noCaret
                        // onClick={this.openEachCategory}
                    >
                        {this.state.menuItems.map((menuItem, key) => (

                            <MenuItem
                                key={key}
                                onClick={() => this.categoryClickHandler("/categories/" + menuItem.slug)}
                                className={'dropdown-menu-vertical-design fix-size'}
                            >
                                <Slide
                                    top when={this.state.isOpenEachCategory}
                                >
                                    {menuItem.name}
                                </Slide>
                            </MenuItem>
                        ))}
                    </NavDropdown>
                </Nav>

                <Navbar.Header>
                    <div onClick={this.linkToHome} className={'link-to-home-div'}>
                        <img height={50} className={"img-brand"} alt="На главную" src="/storage/site/logo.svg"/>
                    </div>
                </Navbar.Header>

                <div className={'dropdown-menu-vertical-design display-header-right'}>
                    <div className={"search-down"}>
                        <Navbar.Form>
                            <form onSubmit={this.onSearchFormSubmit}>
                                <FormGroup>
                            <span
                                key={1}
                                className={this.state.activeClass ? "control-size-default-onclick transition-addition" : "control-size-default transition-addition"}
                            >
                                <Glyphicon
                                    glyph={"search"}
                                    className={"button-search-symbol"}
                                    onClick={() => this.addActiveClass()}
                                />
                                <InputGroup>
                                    <FormControl type="text"
                                                 placeholder={this.state.placeholder}
                                                 value={this.state.searchBoxText}
                                                 onChange={this.searchBoxChange}
                                                 className={"search-form-text"}
                                                 inputRef={ref => {
                                                     this.input = ref;
                                                 }}
                                    />
                                    <Glyphicon
                                        glyph={"remove"}
                                        className={"button-close-symbol"}
                                        onClick={() => this.closeActiveClass()}
                                    />
                                </InputGroup>
                            </span>
                                    <span
                                        key={2}
                                        className={this.state.activeClass ? 'inline-div-display shopping-cart-and-user' : 'inline-div-display'}
                                    >
                                <Button onClick={this.shoppingCartModalShow} bsStyle={"link"}>
                                    <img className={"cart-symbol-size"} src="/storage/site/shopping_cart.jpg" />
                                    {shoppingCartTotal > 0 &&
                                    <span className="badge custom-cart-badge">
                                        {shoppingCartTotal}
                                    </span>
                                    }
                                </Button>
                                <div className={"inline-div-display"}>
                                    <Button
                                        onClick={this.handleUserAccountClick}
                                        bsStyle={"link"}
                                    >
                                        <img className={'cart-symbol-size'} src="/storage/site/person.jpg" />
                                    </Button>
                                    <Popover
                                        open={this.state.open}
                                        anchorEl={this.state.anchorEl}
                                        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                        targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                        onRequestClose={this.handleUserAccountClose}
                                        animation={PopoverAnimationVertical}
                                        className={'user-menu-style'}
                                    >
                                        <Menu>
                                            {this.state.menuItemMUI.map((item, key) => {
                                                if (item === "Divider") {
                                                    return <Divider className={"menuDivider user-menu-style"} key={key}/>
                                                }
                                                if (item === "Log In") {
                                                    var userMenuName = 'Войти';
                                                }
                                                if (item === "Register") {
                                                    var userMenuName = 'Зарегистрироваться';
                                                }
                                                if (item === "My account") {
                                                    var userMenuName = 'Аккаунт';
                                                }
                                                if (item === "My Orders") {
                                                    var userMenuName = 'Личный кабинет';
                                                }
                                                if (item === "Log out") {
                                                    var userMenuName = 'Выйти';
                                                }

                                                return <MenuItemMUI
                                                    className={"user-menu-style"}
                                                    primaryText={userMenuName} key={key}
                                                    onTouchEnd={() => this.touchOutMenuOptions(item)}
                                                    onClick={() => this.menuOptionsClick(item)}
                                                />
                                            })}
                                        </Menu>
                                    </Popover>
                                </div>
                                    </span>
                                </FormGroup>
                            </form>
                        </Navbar.Form>
                        <ShoppingCart
                            handleCheckout={this.shoppingCartModalCheckout}
                            handleClose={this.shoppingCartModalHide}
                            show={this.state.shoppingCartOpen}
                        />
                    </div>
                </div>


            </Navbar>
    }
}

const mapStateToProps = (state) => {
    return {
        shoppingCart: state.shoppingCart,
        authentication: state.authentication,
    };
};

export default connect(mapStateToProps)(withRouter(Header));