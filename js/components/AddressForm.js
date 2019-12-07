import React from "react";
import {FormGroup, ControlLabel, FormControl, Row, Col} from "react-bootstrap";
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

const s = "success";

export default class AddressForm extends React.Component {

    state = {
        address: '',
        city: '',
        zip: '',
        phone: '',
        addressValidation: null,
        cityValidation: null,
        zipValidation: null,
        phoneValidation: null,
        editDisabled: false
    };

    componentDidMount(){
        if(this.props.loadedAddress !== null){
            const {address, city, phone} = this.props.loadedAddress;
            const zip = this.props.loadedAddress.post_index;
            this.setState(() => ({
                editDisabled: false
            }));
            if (address !== null && address !== '' && address !== undefined){
                this.setState(() => ({
                    address,
                    addressValidation: s,
                }));
            }
            if (city !== null && city !== '' && city !== undefined){
                this.setState(() => ({
                    city,
                    cityValidation: s,
                }));
            }
            if (zip !== null && zip !== '' && zip !== undefined){
                this.setState(() => ({
                    zip,
                    zipValidation: s,
                }));
            }
            if (phone !== null && phone !== '' && phone !== undefined){
                this.setState(() => ({
                    phone,
                    phoneValidation: s,
                }));
            }
            console.log(address);
        }
    }

    handleAddressChange = (e) => {
        let address = e.target.value;
        let addressValidation = "success";
        if(address.trim().length === 0 || address === null){
            addressValidation = "error";
        }
        if(address.length <= 45){
            this.setState(() => ({address, addressValidation}));
        }

    };

    handleCityChange = (e) => {
        let city = e.target.value;
        let cityValidation = "success";
        if(city.trim().length === 0 || city === null){
            cityValidation = "error";
        }
        this.setState(() => ({city, cityValidation}));
    };

    handleZipChange = (e) => {
        let zip = e.target.value;
        let zipValidation = null;
        if(zip.length < 6){
            zipValidation = "error";
        }
        else{
            zipValidation = "success"
        }

        if(zip.length <= 6){
            this.setState(() => ({zip, zipValidation}));
        }
    };

    handlePhoneChange = (e) => {
        let phone = e.target.value.trim();
        let phoneValidation = null;
        if(phone.length < 11 || phone === null){
            phoneValidation = "error"
        }
        else{
            phoneValidation = "success"
        }

        if(phone.length <= 11){
            this.setState(() => ({phone, phoneValidation}));
        }
    };

    handleNextAddress = () => {
        const {address, city, zip, phone} = this.state;
        const addressData = {
            address,
            city,
            zip,
            phone
        };
        this.props.handleNext(addressData);
    };


    render(){

        return (
            <form>
                <fieldset disabled={this.state.editDisabled}>
                    <FormGroup
                        controlId="formBasicAddress"
                        validationState={this.state.addressValidation}
                    >
                        <ControlLabel>Адрес</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.address}
                            // placeholder={this.state.address !== '' ? this.state.address : "Улица, дом, квартира"}
                            onChange={this.handleAddressChange}
                        />
                        <FormControl.Feedback />
                    </FormGroup>

                    <FormGroup
                        controlId="formBasicCity"
                        validationState={this.state.cityValidation}
                    >
                        <ControlLabel>Город</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.city}
                            // placeholder={this.state.city !== '' ? this.state.city : "Город"}
                            onChange={this.handleCityChange}
                        />
                        <FormControl.Feedback />
                    </FormGroup>

                    <Row>
                        <Col lg={6} md={6}>
                            <FormGroup
                                controlId="formBasicZip"
                                validationState={this.state.phoneValidation}
                            >
                                <ControlLabel>Телефон</ControlLabel>
                                <FormControl
                                    type="number"
                                    value={this.state.phone}
                                    // placeholder={this.state.phone !== '' ? this.state.phone : "+7978 000 00 00"}
                                    onChange={this.handlePhoneChange}
                                />
                                <FormControl.Feedback />
                            </FormGroup>
                        </Col>

                        <Col lg={6} md={6}>
                            <FormGroup
                                controlId="formBasicZip"
                                validationState={this.state.zipValidation}
                            >
                                <ControlLabel>Почтовый индекс</ControlLabel>
                                <FormControl
                                    type="number"
                                    value={this.state.zip}
                                    // placeholder={this.state.zip !== '' ? this.state.zip : "Почтовый индекс"}
                                    onChange={this.handleZipChange}
                                />
                                <FormControl.Feedback />
                            </FormGroup>
                        </Col>
                    </Row>
                </fieldset>
                <div style={{margin: '12px 0'}}>
                    <FlatButton
                        label="Назад"
                        disableTouchRipple={true}
                        disableFocusRipple={true}
                        onClick={this.props.handlePrev}
                    />
                {this.state.addressValidation === s &&
                this.state.cityValidation === s &&
                this.state.zipValidation === s &&
                this.state.phoneValidation === s &&
                <RaisedButton
                    label={'Дальше'}
                    disableTouchRipple={true}
                    disableFocusRipple={true}
                    primary={true}
                    onClick={this.handleNextAddress}
                    style={{marginRight: 12}}
                />
                }

                        {/*<button*/}
                            {/*// disabled={!disabledButton}*/}
                            {/*className='do-payment btn btn-info'*/}
                            {/*onClick={this.handleNextAddress}*/}
                            {/*style={{marginRight: 12}}*/}
                        {/*>*/}
                            {/*ДАЛЬШЕ*/}
                        {/*</button>*/}


                </div>
            </form>
        )
    }
}