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
    renderChoroplethItem(item) {
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
        let content = null;
        const legendItems = this.props.choroplethLegend.map((v) => this.renderChoroplethItem(v));

        if (this.props.type === "relative") {
            content = (
                <div className={'legend'}>
                    {legendItems}
                </div>
            );
        } else if (this.props.type === "absolute") {
            content = (
                <div className={'legend'}>
                    Kartodiagram
                </div>
            );
        }

        return content;
    }
}


MapLegend.defaultProps = {
    legendItems: [],
    type: PropTypes.string
  };
  
MapLegend.propTypes = {
    legendItems: PropTypes.array,
};

export default MapLegend;