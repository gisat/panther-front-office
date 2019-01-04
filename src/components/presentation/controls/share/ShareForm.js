import React from "react";
import PropTypes from "prop-types";
let polyglot = window.polyglot;

const LANGUAGES = [
    {key: 'cz', name: 'CZ'},
    {key: 'en', name: 'EN'},
]

const getSelect = (items, selected, name, onChange, defaultEmpty = false) => {
    const options = items.map((item) => {
        return <option value={item.key} key={item.key}>{item.name || item.data.name}</option>;
    });

    if (defaultEmpty) {
        options.unshift(<option value="null" key="null"></option>);
    }

    return (<select onChange={onChange} name={name} value={selected}>{options}</select>);
}

const BASE_STATE = {
    usersSelect: {
        value: 'null',
        required: true,
    },
    groupsSelect: {
        value: 'null',
        required: true,
    },
    langSelect: {
        value: LANGUAGES[0].key,
        required: true,
    },
    description: {
        value: '',
        required: true,
    },
    name: {
        value: '',
        required: true,
    },
    dataviewId: null,
};

class ShareForm extends React.PureComponent {

    static propTypes = {
		users: PropTypes.array,
        groups: PropTypes.array,
        onSubmit: PropTypes.func,
        handleClearForm: PropTypes.func,
        dataviewId: PropTypes.number,
        onMount: PropTypes.func,
        onUnmount: PropTypes.func,
    };
    
    constructor(props) {
        super(props);
        this.state = {...BASE_STATE, dataviewId: props.dataviewId};
        
        this.handleClearForm = this.handleClearForm.bind(this);
    
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isDisabled = this.isDisabled.bind(this);
    }

    componentWillUnmount() {
        this.handleClearForm();
        this.props.handleClearForm();
        this.props.onUnmount();
    }

    componentDidMount() {
        this.props.onMount();
    }

    handleSubmit(event) {
        event.preventDefault();
        if(!this.isDisabled()){
            this.props.onSubmit(this.state);
        }
    }

    handleClearForm() {
        this.state = {...BASE_STATE};
    }
    

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const title = target.type.includes('select') ? event.target.options[event.target.selectedIndex].text : null;
        const name = target.name;
    
        this.setState({
            [name]: {
              ...this.state[name], 
              value: value,
              title: title,
            }
        });
    }

    isDisabled() {
        return !Object.entries(this.state).filter(i => i[1].required).every(i => i[1].value && i[1].value !== 'null' && i[1].value !== '')
    }

    render() {
        const dataviewMetadataTitle = polyglot.t('sharingMetadataTitle');
        const dataviewMetadataDescription = polyglot.t('sharingMetadataDescription');
        const nameLabel = polyglot.t('sharingNameLabel');
        const descriptionLabel = polyglot.t('sharingDescriptionLabel');
        const langLabel = polyglot.t('sharingLangLabel');
        const permissionsTitle = polyglot.t('sharingPermissionsTitle');
        const permissionsDescription = polyglot.t('sharingPermissionsDescription');
        const userLabel = polyglot.t('sharingUserLabel');
        const groupLabel = polyglot.t('sharingGroupLabel');
        const shareLabel = polyglot.t('share');
        
        const LanguageSelect = LANGUAGES ? getSelect(LANGUAGES, this.state['langSelect'].value, 'langSelect', this.handleInputChange) : null;
        const GroupsSelect = this.props.groups ? getSelect(this.props.groups, this.state['groupsSelect'].value, 'groupsSelect', this.handleInputChange, true) : null;
        const UsersSelect = this.props.users ? getSelect(this.props.users, this.state['usersSelect'].value, 'usersSelect', this.handleInputChange, true) : null;

        return (
            <form className="basic-form" onSubmit={this.handleSubmit}>
                <div className="widget-section">
                    <h3>{dataviewMetadataTitle}</h3>
                    <p className="paragraph">{dataviewMetadataDescription}</p>
                    <div className="widget-form-row">
                        <label>
                            <span>{nameLabel}</span>
                            <input type="text" value={this.state.name.value} onChange={this.handleInputChange} name="name"/>
                        </label>
                    </div>
                    <div className="widget-form-row">
                        <label>
                            <span>{descriptionLabel}</span>
                            <textarea value={this.state.description.value} onChange={this.handleInputChange} name="description"/>
                        </label>
                    </div>
                    <div className="widget-form-row">
                        <label>
                            <span>{langLabel}</span>
                            {LanguageSelect}
                        </label>
                    </div>
                </div>
                <div className="widget-section">
                    <h3>{permissionsTitle}</h3>
                    <p className="paragraph">
                        {permissionsDescription}
                    </p>
                    <div className="widget-form-row">
                        <label>
                            <span>{userLabel}</span>
                            {UsersSelect}
                        </label>
                    </div>
                    <div className="widget-form-row">
                        <label>
                            <span>{groupLabel}</span>
                            {GroupsSelect}
                        </label>
                    </div>
                </div>

                <div className="floater-footer">
                    <input type="submit" className="component-button  w8 text-centered" value={shareLabel} disabled={this.isDisabled()} />
                </div>
            </form>
        )
    }
}

export default ShareForm;