import React from "react";
import {Modal} from "react-bootstrap";
import AdvancedFilters from "../components/AdvancedFilters";

const AdvancedFiltersModal = (props) => (
    <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Настройки</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <AdvancedFilters applyFilters={props.applyFilters} clearFilters={props.clearFilters}/>
        </Modal.Body>
        <div className={'common-style-for-categories-checkbox'}>
            <img height={100} className={"img-brand"} alt="На главную" src="/storage/site/razdels.svg"/>
            {props.subCategories.map((category) => (
                <div
                    key={category}
                    className={"pretty p-fill p-curve p-jelly p-rotate p-icon p-toggle p-plain style-for-categories-checkbox"}
                >
                    <input
                        type="checkbox"
                        name={category}
                        onChange={checked => props.applySubCategory(category, checked)}
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

        <div className={'common-style-for-categories-checkbox categories-checkbox-addition'}>
            <img height={100} className={"img-brand"} alt="На главную" src="/storage/site/brands.svg"/>
            {props.brands.map((brand) => (
                <div
                    key={brand}
                    className={"pretty p-fill p-curve p-jelly p-rotate p-icon p-toggle p-plain style-for-categories-checkbox"}
                >
                    <input
                        type="checkbox"
                        name={brand}
                        onChange={checked => props.applyBrand(brand, checked)}
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
    </Modal>
);

export default AdvancedFiltersModal;