import React from "react";
import PropTypes from "prop-types";
let polyglot = window.polyglot;

const LANGUAGES = [
    {key: 'cz', name: 'CZ'},
    {key: 'en', name: 'EN'},
]

const getSelect = (items, selected, name, onChange, defaultEmpty = false, multiple = false) => {
    const options = items.map((item) => {
        return <option value={item.key} key={item.key} data-group={item.identifier || item.data && item.data.identifier}>{item.name || item.data.name}</option>;
    });

    if (defaultEmpty) {
        options.unshift(<option value="null" key="null"></option>);
    }

    if(!multiple) {
        return (<select onChange={onChange} name={name} value={selected}>{options}</select>);
    } else {
        return (<select multiple={true} onChange={onChange} name={name} value={selected} style={{height: "10rem"}}>{options}</select>);
    }
}

const BASE_STATE = {
    usersSelect: {
        value: 'null',
        required: false,
    },
    groupsSelect: {
        value: 'null',
        required: false,
    },
    langSelect: {
        value: LANGUAGES[0].key,
        required: true,
    },
    description: {
        value: '',
        required: false,
    },
    shareInPortal: {
        value: true,
        required: false
    },
    shareInVisat: {
        value: true,
        required: false
    },
    name: {
        value: '',
        required: true,
    },
    dataviewId: null,
};

const valueFilled = value => value && value !== 'null' && value !== ''

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
        this.handleInputChangeMultiple = this.handleInputChangeMultiple.bind(this);
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
        const title = target.type.includes('select') ? event.target.options[event.target.selectedIndex].getAttribute('data-group') : null;
        const name = target.name;
    
        this.setState({
            [name]: {
              ...this.state[name], 
              value: value,
              title: title,
            }
        });
    }

    handleInputChangeMultiple(event) {
        const target = event.target;
        const name = target.name;

        const options = event.target.options;
        const values = [];
        const titles = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                values.push(options[i].value);
                titles.push(options[i].getAttribute('data-group'));
            }
        }

        this.setState({
            [name]: {
                ...this.state[name],
                value: values,
                title: titles,
            }
        });
    }

    isDisabled() {
        const fieldsFilled = Object.entries(this.state).filter(i => i[1].required).every(i => i[1].value && i[1].value !== 'null' && i[1].value !== '');
        Object.entries(this.state).filter(i => i[1].required).every(i => valueFilled(i[1].value));
        const userGroups = ['usersSelect', 'groupsSelect'];
        const userGroupsFilled = userGroups.some((select) => valueFilled(this.state[select].value));
        return !(fieldsFilled && userGroupsFilled);
    }

    render() {
        const dataviewMetadataTitle = polyglot.t('sharingMetadataTitle');
        const dataviewMetadataDescription = polyglot.t('sharingMetadataDescription');
        const nameLabel = polyglot.t('sharingNameLabel');
        const descriptionLabel = polyglot.t('sharingDescriptionLabel');
        const shareInPortalCatalogue = polyglot.t('sharingInPortalLabel');
        const shareInVisatCatalogue = polyglot.t('sharingInVisatLabel');
        const langLabel = polyglot.t('sharingLangLabel');
        const permissionsTitle = polyglot.t('sharingPermissionsTitle');
        const permissionsDescription = polyglot.t('sharingPermissionsDescription');
        const userLabel = polyglot.t('sharingUserLabel');
        const groupLabel = polyglot.t('sharingGroupLabel');
        const shareLabel = polyglot.t('share');
        
        const LanguageSelect = LANGUAGES ? getSelect(LANGUAGES, this.state['langSelect'].value, 'langSelect', this.handleInputChange, false) : null;
        const GroupsSelect = this.props.groups ? getSelect(this.props.groups, this.state['groupsSelect'].value, 'groupsSelect', this.handleInputChangeMultiple, true, true) : null;
        const UsersSelect = this.props.users ? getSelect(this.props.users, this.state['usersSelect'].value, 'usersSelect', this.handleInputChange, true, false) : null;

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
                            <span>{shareInPortalCatalogue}</span>
                            <input type="checkbox" checked={this.state.shareInPortal.value} onChange={this.handleInputChange} name="shareInPortal"/>
                        </label>
                    </div>
                    <div className="widget-form-row">
                        <label>
                            <span>{shareInVisatCatalogue}</span>
                            <input type="checkbox" checked={this.state.shareInVisat.value} onChange={this.handleInputChange} name="shareInVisat"/>
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