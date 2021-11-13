import React from 'react';

import {Carriers} from './parts';
import styles from './styles.module.scss';

export const SortingPanel = ({options, flights, panelIsShown, setPanelIsShown}) => {
    const {sortValue, setSortValue, transfers, setTransfers, price, setPrice, captions, setCaptions} = options;
    const {min, max} = price;

    const changePrice = (value, param) => setPrice(prev => ({
        ...prev, [param]: Number(value.replace(/[^\d;]/g, '').replace(/^0+/, '') || 0)
    }));

    return (
        <div className={`${styles.panelWrapper} ${panelIsShown ? styles.panelWrapperShown : ''}`}>
            <button className={styles.closeButton} onClick={() => setPanelIsShown(false)}><p>&#10799;</p></button>
            <button className={styles.displayButton} onClick={() => setPanelIsShown(prev => !prev)}>
                фильтрация
            </button>
            <div className={styles.panel}>
                <div className={styles.panelMain}>
                    <div className={styles.sort}>
                        <p className={styles.title}>Сортировать</p>
                        {[
                            {option: 'priceIncrease', description: 'по возрастанию цены'},
                            {option: 'priceDecrease', description: 'по убыванию цены'},
                            {option: 'travelTime', description: 'по времени в пути'}
                        ].map(({option, description}, index) => (
                            <label className={styles.sortOption} key={index}>
                                <input
                                    type='radio'
                                    checked={sortValue === option}
                                    onChange={() => setSortValue(option)}/> - {description}
                            </label>))}
                    </div>
                    <div className={styles.filter}>
                        <p className={styles.title}>Фильтровать</p>
                        {transfers.map(({description, value}, index) => (
                            <label key={index} className={styles.filterOption}>
                                <input
                                    type="checkbox"
                                    checked={value}
                                    onChange={() => setTransfers(prev => prev.map(transfer => transfer.description === description
                                        ? {...transfer, value: !value}
                                        : transfer))}/> - {description}
                            </label>
                        ))}
                    </div>
                    <div className={styles.price}>
                        <p className={styles.title}>Цена</p>
                        <label>От <input
                            style={{outline: 'none'}}
                            value={min}
                            onChange={e => changePrice(e.target.value, 'min')}/>
                        </label>
                        <label style={{marginTop: '15px'}}>До <input
                            style={{outline: 'none'}}
                            value={max}
                            onChange={e => changePrice(e.target.value, 'max')}/>
                        </label>
                    </div>
                    <div className={styles.carriers}>
                        <p className={styles.title}>Авиакомпании</p>
                        <Carriers
                            captions={captions}
                            setCaptions={setCaptions}
                            price={price}
                            flights={flights}
                            transfers={transfers}/>
                    </div>
                </div>
            </div>
        </div>
    );
};
