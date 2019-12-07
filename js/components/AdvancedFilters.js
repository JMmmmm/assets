import React from "react";
import {FormControl, Form, FormGroup, Button, Checkbox, Glyphicon} from "react-bootstrap";
import {ANY, MORE_THAN_FOUR, MORE_THAN_THREE, NO, ONE_TO_THREE, YES} from "../api/strings";
import InputRange from 'react-input-range';

class AdvancedFilters extends React.Component {

    state = {
        priceRangeError: false,
        priceRangeErrorMessage: '',
        filterApplied: false,
        priceRange: {
            min: 1,
            max: 150000
        },
    };

    onFormSubmit = (e) => {
        e.preventDefault();
        const ratings = e.target.ratings.value;
        // const from = e.target.from.value.trim();
        // const to = e.target.to.value.trim();
        const from = this.state.priceRange.min;
        const to = this.state.priceRange.max;
        const fast_shipping = e.target.fastShipping.checked;
        if(from || to){
            if(from && to){
                if(parseFloat(from) >= parseFloat(to)){
                    this.setState(() => ({priceRangeError: true, priceRangeErrorMessage: '"To" should be greater than "From"'}));
                }
                else{
                    this.setState(() => ({priceRangeError: false}));
                }
            }
            else{
                this.setState(() => ({priceRangeError: true, priceRangeErrorMessage: 'From and To both must be present'}));
            }
        }

        if(!this.state.priceRangeError){
            this.setState(() => ({filterApplied: true}));
            // setTimeout(() => {
            //     this.setState({ show: true });
            // }, 2000);
            const filters = {
                ratings,
                from,
                to,
                fast_shipping
            };
            this.props.applyFilters(filters);
        }
    };

    onFormReset = () => {
        this.setState(() => ({priceRangeError: false, filterApplied: false}));
        this.props.clearFilters();
    };

    render() {

        const {priceRangeError, priceRangeErrorMessage} = this.state;

        return (
            <div className={"minimum-height normal-padding"}>
                <Form onSubmit={this.onFormSubmit}>
                    <div className={"text-center"}>
                        {/*<p>Ratings: </p>*/}
                        <FormControl
                            componentClass="select"
                            placeholder="All"
                            name={"ratings"}
                            className={"advanced-filter-button-default btn-lg"}
                        >
                            <option
                                value={ANY}
                            >
                                ВСЕ
                            </option>
                            <option value={MORE_THAN_FOUR}>
                                ОТ &#9733;&#9733;&#9733;&#9733;&#9734;
                            </option>
                            <option value={MORE_THAN_THREE}>
                                ОТ &#9733;&#9733;&#9733;&#9734;&#9734;
                                </option>
                            <option value={ONE_TO_THREE}>
                                ДО &#9733;&#9733;&#9733;&#9734;&#9734;
                            </option>
                        </FormControl>
                    </div>

                    <div className={"text-center input-range-main-style"}>
                        {/*<div className={"inline-advanced-div"}>*/}
                            <InputRange
                                maxValue={150000}
                                minValue={1}
                                formatLabel={value => `${value} ₽`}
                                value={this.state.priceRange}
                                onChange={value => this.setState({ priceRange: value })}
                                onChangeComplete={value => console.log(value)}
                            />

                            {/*<FormGroup controlId="formInlineFrom">*/}
                                {/*<FormControl type="number" placeholder="From" className={"left-advanced-filter"} name={"from"}/>*/}
                            {/*</FormGroup>{' '}*/}
                            {/*<FormGroup controlId="formInlineTo">*/}
                                {/*<FormControl type="number" placeholder="To" className={"right-advanced-filter"} name={"to"}/>*/}
                            {/*</FormGroup>*/}
                        {/*</div>*/}
                        {priceRangeError && <span className={"error-message"}>{priceRangeErrorMessage}</span>}
                    </div>

                    <div className={"pretty p-switch p-fill"}>
                        {/*<p>Fast Shipping: </p>*/}
                        {/*<FormControl*/}
                            {/*componentClass="select"*/}
                            {/*placeholder="All"*/}
                            {/*name={"fast_shipping"}*/}
                            {/*className={"advanced-filter-button-default btn-lg"}*/}
                        {/*>*/}
                            {/*<option value={ANY}>{ANY}</option>*/}
                            {/*<option value={YES}>{YES}</option>*/}
                            {/*<option value={NO}>{NO}</option>*/}
                        {/*</FormControl>*/}

                        <input
                            type="checkbox"
                            name={"fastShipping"}
                        />
                        <div className="state">
                            <label>В наличии</label>
                        </div>
                    </div>

                    <div className={"inline-advanced-div"}>
                        <Button className={"btn-sm btn-primary left-advanced-filter"} type={"submit"}>Показать</Button>
                        <Button className={"btn-sm btn-danger right-advanced-filter"} type={"reset"} onClick={this.onFormReset}>Сбросить</Button>
                    </div>

                </Form>
            </div>
        )
    }
}

export default AdvancedFilters;