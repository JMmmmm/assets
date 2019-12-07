import React from "react";
import {Grid, Col, Row, ListGroup, ListGroupItem} from "react-bootstrap";
import LoadingOrderAnimation from 'react-loading-order-with-animation';

const About = () => (
    <Grid className={"minimum-height about-div"}>
        <Row>
            <h4>Наши Услуги:</h4>
            <hr/>
            <Col lg={12} md={12}>
                <br/>
                <br/>
                <LoadingOrderAnimation animation="fade-in"
                                       move="from-top-to-bottom"
                                       distance={30}
                                       speed={1000}
                                       wait={1000}>
                    <div>
                        <p className={"sixzero-weight"}>Установка кондиционеров</p>
                        <Row>
                            <Col lg={12} md={12}>
                                <div className={'about-style'}>
                                    <ListGroup>
                                        <ListGroupItem>На все услуги монтажа климатической техники мы предоставляем гарантию, поскольку полностью уверены в высочайшем уровне подготовки наших сотрудников. Монтаж кондиционеров в Севастополе осуществляется в удобное для клиента время и в четко оговоренные сроки. Все наши мастера используют только качественные расходные материалы, поэтому вы можете смело заказать у нас кондиционер с установкой. В зависимости от габаритов и предназначения помещения, наши мастера всегда помогут   Вам подобрать ту  или иную  модель системы кондиционирования.</ListGroupItem>
                                    </ListGroup>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </LoadingOrderAnimation>

                <LoadingOrderAnimation animation="fade-in"
                                       move="from-top-to-bottom"
                                       distance={30}
                                       speed={1000}
                                       wait={1000}>
                    <div>
                        <p className={"sixzero-weight"}>Ремонт и обслуживание кондиционеров</p>
                        <Row>
                            <Col lg={12} md={12}>
                                <div className={'about-style'}>
                                    <ListGroup>
                                        <ListGroupItem>Стабильная работа сплит-системы зависит, прежде всего, от своевременного  и профессионального техобслуживания. Ведь профилактика неисправностей гораздо лучше, чем их ликвидация. Кондиционеры – довольно сложная климатическая техника, техобслуживание и ремонт которой требует большого практического опыта и знаний. Попытки устранить неисправность своими силами чреваты полным выходом из строя оборудования. Поэтому, если ваш кондиционер перестал «холодить» или потек, отключите технику и обратитесь к профессионалам. В такую услугу, как ремонт и техническое обслуживание кондиционеров в Севастополе, входит ряд работ: контроль давления системы, чистку теплообменника, заправку фреоном и пр. Наши специалисты выявят неполадки и выполнят необходимые работы быстро и качественно.</ListGroupItem>
                                    </ListGroup>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </LoadingOrderAnimation>

                <LoadingOrderAnimation animation="fade-in"
                                       move="from-top-to-bottom"
                                       distance={30}
                                       speed={1000}
                                       wait={1000}>
                    <div>
                        <p className={"sixzero-weight"}>Преимущества обслуживания кондиционеров у нас</p>
                        <Row>
                            <Col lg={12} md={12}>
                                <div className={'about-style'}>
                                    <ListGroup>
                                        <ListGroupItem>С 2010 года сотрудники – квалифицированные мастера с солидным стажем работы обслуживают сотни сплит-систем по всему Крыму;</ListGroupItem>
                                        <ListGroupItem>Установка кондиционеров в Севастополе осуществляется с применением высококачественного расходного материала;</ListGroupItem>
                                        <ListGroupItem>Монтаж кондиционеров  осуществляет авторизованный монтажно-сервисный центр «КлиматКрым» качественно и в кратчайшие сроки;</ListGroupItem>
                                        <ListGroupItem>Оплата услуги  «Монтаж кондиционера» осуществляется согласно прейскуранту цен на услуги,  монтажник заполняет наряд, на выполненные  работы.</ListGroupItem>
                                        <ListGroupItem>Установленный кондиционер ставится на гарантийное и пост-гарантийное сервисное обслуживание.</ListGroupItem>
                                    </ListGroup>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </LoadingOrderAnimation>

                <LoadingOrderAnimation animation="fade-in"
                                       move="from-top-to-bottom"
                                       distance={30}
                                       speed={1000}
                                       wait={1000}>
                    <div>
                        <p className={"sixzero-weight"}>На счету наших мастеров огромное количество выполненных проектов по монтажу и техобслуживанию кондиционеров. Грамотно подобранное климатическое оборудование создает комфортный микроклимат в помещении, а также нормальную эксплуатацию техники. Звоните, выбирайте, мы всегда рады вам помочь!</p>
                    </div>
                </LoadingOrderAnimation>

                <LoadingOrderAnimation animation="fade-in"
                                       move="from-top-to-bottom"
                                       distance={30}
                                       speed={1000}
                                       wait={1000}>
                    <div>
                        <p className={"sixzero-weight"}>КОМПАНИЯ «КлиматКрым»</p>
                    </div>
                </LoadingOrderAnimation>
            </Col>
        </Row>
    </Grid>
);

export default About;