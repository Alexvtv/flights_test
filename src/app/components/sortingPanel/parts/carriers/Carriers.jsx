import React from 'react';

import styles from './styles.module.scss';

export const Carriers = ({captions, setCaptions, price, flights, transfers}) => {
    const selectedCounts = transfers.filter(({value}) => value).map(({segmentCount}) => segmentCount);
    const filteredFlights = flights?.filter(({flight}) => selectedCounts.length > 0
        ? flight.legs.every(({segments}) => selectedCounts.includes(segments.length))
        : true)

    const isActive = ({minPrice, caption}) => ((minPrice.amount <= price.max)
        && (filteredFlights.filter(({flight}) => flight.carrier.caption === caption).length > 1));

    return captions
        ? captions.map(({caption, value, minPrice}, index) => {
            const {amount, currency} = minPrice;

            return (
                <label
                    className={`${styles.filterOption} ${isActive({minPrice, caption}) 
                        ? '' 
                        : styles.inactiveFilterOption}`}
                    key={index}>
                    <input
                        type='checkbox'
                        checked={value}
                        disabled={!isActive({minPrice, caption})}
                        onChange={() => isActive({minPrice, caption})
                            ? setCaptions(prev => prev.map(captionData => captionData.caption === caption
                                ? {...captionData, value: !value}
                                : captionData))
                            : null}/>
                    <span className={styles.caption}> - {caption}</span>
                    <span className={styles.minPrice}>от {`${amount} ${currency}`}</span>
                </label>)
        })
        : null;
};
