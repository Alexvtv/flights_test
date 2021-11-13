import React from 'react';

import styles from './styles.module.scss';

export const Leg = ({data, index}) => {
    const {segments, duration} = data;

    const createDate = (date) => {
        const timeOptions = {
            hour: 'numeric',
            minute: 'numeric'
        };
        const dateOptions = {
            day: 'numeric',
            month: 'short',
        };
        const weekDay = {weekday: 'short'};

        const prepareDate = (obj) => new Date(date).toLocaleString('ru', obj);

        return {
            time: prepareDate(timeOptions),
            date: prepareDate(dateOptions),
            weekDay: prepareDate(weekDay)
        };
    };

    const preparePoints = (isArrival) => {
        const segment = segments[isArrival ? segments.length - 1 : 0];
        const {departureCity, departureAirport, arrivalAirport, arrivalCity} = segment;
        const city = isArrival ? arrivalCity : departureCity;
        const airport = isArrival ? arrivalAirport : departureAirport;
        const {caption, uid} = airport;

        return <p className={styles.points}>
            {city?.caption} {caption} <span
            className={styles.uid}>({uid})</span>
        </p>;
    };

    const {departureDate, airline} = segments[0];

    return (
        <div>
            <div className={styles.pointsWrapper}>
                {preparePoints(false)}
                <span className={styles.arrow}>&#8594;</span> {/*Стрелка вправо*/}
                {preparePoints(true)}
            </div>
            <div className={styles.dateParams}>
                {[departureDate, segments[segments.length - 1].arrivalDate].map((e, i) => {
                    const array = e === departureDate ? ['time', 'date', 'weekDay'] : ['date', 'weekDay', 'time'];

                    return <p className={styles.param} key={i}>
                        {array.map((data, index) => (
                            <span className={`${styles[data]} ${styles[`${data}_${i === 0 ? 'left' : 'right'}`]}`} key={index}>
                                {createDate(e)[data]}&#160;
                            </span>))}
                    </p>;
                })}
                <p className={styles.duration}>
                    <img className={styles.clockImage} src='Feather-core-clock.svg' alt=''/>
                    {Math.floor(duration / 60)} ч {duration % 60 > 0 ? `${duration % 60} мин` : null}
                </p>
            </div>
            <div className={styles.transfers}>
                {segments.length > 1 ? <p className={styles.transferCount}>{segments.length - 1} пересадка</p> : null}
                <hr className={styles.transferLine}/>
            </div>
            <p className={styles.carrier}>
                Рейс выполняет: {airline.caption}
            </p>
            {index === 0 ? <hr className={styles.legSeparation}/> : null}
        </div>);
};
