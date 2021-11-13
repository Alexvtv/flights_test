import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';

import {Main, SortingPanel} from './components';
import styles from './styles.module.scss';

export const App = () => {
    const [data, setData] = useState(null);
    //Параметр отображения панели при разрешении < 960px
    const [panelIsShown, setPanelIsShown] = useState(false);

    //Параметры сортировки
    const [sortValue, setSortValue] = useState('priceIncrease');
    const [transfers, setTransfers] = useState([
        {description: '1 пересадка', value: false, segmentCount: 2},
        {description: 'без пересадок', value: false, segmentCount: 1}
    ]);
    const [price, setPrice] = useState({min: 0, max: 100000});
    const [captions, setCaptions] = useState(null);

    useEffect(() => {
        fetch('data/flights.json', {headers: {'Content-Type': 'application/json'}})
            .then(data => data.json())
            .then(({result}) => {
                ReactDOM.unstable_batchedUpdates(() => {
                    const {flights} = result;

                    setData(result);
                    setCaptions([...new Set(flights.map(({flight}) => flight.carrier.caption))].map(caption => ({
                        caption,
                        value: false,
                        minPrice: flights.filter(({flight}) => flight.carrier.caption === caption)
                            .sort((a, b) => a.flight.price.total.amount - b.flight.price.total.amount)[0].flight.price.total
                    })));
                });
            });
    }, []);

    const selectedCounts = transfers.filter(({value}) => value).map(({segmentCount}) => segmentCount);
    const selectedCaptions = captions?.filter(({value}) => value).map(({caption}) => caption);

    const filteredFlights = data?.flights
        .filter(({flight}) => {
            const {amount} = flight.price.total;
            const {min, max} = price;

            return amount >= min && amount <= max;
        })
        .filter(({flight}) => selectedCounts.length > 0
            ? flight.legs.every(({segments}) => selectedCounts.includes(segments.length))
            : true)
        .filter(({flight}) => selectedCaptions.length > 0
            ? selectedCaptions.includes(flight.carrier.caption)
            : true)
        .sort((a, b) => {
            switch (sortValue) {
                case 'travelTime':
                    return a.flight.legs[0].duration - b.flight.legs[0].duration;
                case 'priceIncrease':
                    return a.flight.price.total.amount - b.flight.price.total.amount;
                default:
                    return b.flight.price.total.amount - a.flight.price.total.amount;
            }
        });

    return (
        <div className={styles.app}>
            <SortingPanel
                options={{sortValue, setSortValue, transfers, setTransfers, price, setPrice, captions, setCaptions}}
                flights={data?.flights}
                panelIsShown={panelIsShown}
                setPanelIsShown={setPanelIsShown}/>
            {filteredFlights
                ? <Main flights={filteredFlights} setPanelIsShown={setPanelIsShown}/>
                : <p className={styles.loading}>Загрузка...</p>}
        </div>
    );
};
