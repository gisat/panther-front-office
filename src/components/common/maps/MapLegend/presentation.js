import React from "react";
import PropTypes from 'prop-types';
import './mapLegend.scss';
class MapLegend extends React.PureComponent {

    renderItemImage(item) {
        return (
            <div className={'image'} key={item.title}>
                <span>{item.image}</span>
                <span className={'title'}>{item.title}</span>
            </div>
        )
    }
    renderItem(item) {
        const images = item.items.map((i) => this.renderItemImage(i));
        return (<div className={'legend-item'} key={item.name}>
                   <div className={'legend-title'}>
                        {item.name}
                   </div>
                    <div className={'legend-subtitle'}>
                        {item.description}
                    </div>
                   <div className={'images'}> 
                        {images}
                   </div> 
                </div>)

    }

    render () {
        const legendItems = this.props.legendItems.map((v) => this.renderItem(v))
        return (
                <div className={'legend'}>
                   {legendItems} 
                </div>
        )
    }
}


MapLegend.defaultProps = {
    legendItems: [],
  };
  
MapLegend.propTypes = {
    legendItems: PropTypes.array,
};

export default MapLegend;