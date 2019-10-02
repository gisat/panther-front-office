import React from "react";
import PropTypes from 'prop-types';
import _ from 'lodash';
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

    renderDiagram(item) {
        let style = {
            background: item.color,
            width: (2*item.radius),
            height: (2*item.radius),
            borderRadius: (item.radius),
            marginLeft: -item.radius
        };

        return (
            <div className='diagram' style={style}>
            </div>
        );
    }

    renderDiagramLabel(item) {
        return (
            <div className='label'>
                <div>
                    {item.value.toLocaleString()}
                </div>
            </div>
        );
    }

    render () {
        let content = null;

        if (this.props.type === "relative") {
            const legendItems = this.props.choroplethLegendData.map((v) => this.renderChoroplethItem(v));
            content = (
                <div className={'legend'}>
                    {legendItems}
                </div>
            );
        } else if (this.props.type === "absolute") {
            let items = _.filter(this.props.diagramLegendData, (item) => {
                return item.radius < 100 && item.radius > 1.5;
            });
            let size = items.length ? (2 * items[0].radius) : 0;

            content = (
                <div className='legend esponFuore-diagram-legend'>
                    <div className='labels'>
                        {items.map((item) => this.renderDiagramLabel(item))}
                    </div>
                    <div className='diagrams' style={{width: size, height: size}}>
                        {items.map((item) => this.renderDiagram(item))}
                    </div>
                </div>
            );
        }

        return content;
    }
}


MapLegend.defaultProps = {
    choroplethLegendData: [],
    diagramLegendData: [],
    type: PropTypes.string
  };
  
MapLegend.propTypes = {
    choroplethLegendData: PropTypes.array,
    diagramLegendData: PropTypes.array
};

export default MapLegend;