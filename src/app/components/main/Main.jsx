import React, {useState, useEffect} from 'react';

import {Leg} from './parts';
import styles from './styles.module.scss';

export const Main = ({flights, setPanelIsShown}) => {
    const [flightsToShow, setFlightsToShow] = useState(2);

    useEffect(() => {
        setFlightsToShow(2);
    }, [flights]);

    return (
        <div className={styles.main} onClick={() => setPanelIsShown(false)}>
            <div className={styles.container}>
                {flights.slice(0, flightsToShow).map(({flight}, i) => {
                    const {price, legs, carrier} = flight;
                    const {amount, currency} = price.total;

                    return (
                        <div key={i} className={styles.flight}>
                            <div className={styles.hat}>
                                {/*uid вместо изображения*/}
                                <p className={styles.carrierId}>{carrier.uid}</p>
                                <div className={styles.priceWrapper}>
                                    {/*Костыльное решение для отображения символа rub*/}
                                    <p className={styles.price}>{amount} {currency === 'руб.' ? '\u20bd' : currency}</p>
                                    <span className={styles.priceClarification}>Стоимость для одного взрослого пассажира</span>
                                </div>
                            </div>
                            {legs.map((leg, index) => <Leg key={index} data={leg} index={index}/>)}
                            <button className={styles.selectButton} onClick={() => alert('Рейс выбран!')}>выбрать</button>
                        </div>);
                })}
                {flightsToShow < flights.length
                    ? <button
                        className={styles.showButton}
                        onClick={() => setFlightsToShow(prev => prev + 2)}>
                        Показать ещё
                    </button>
                    : null}
            </div>
        </div>
    );
};
