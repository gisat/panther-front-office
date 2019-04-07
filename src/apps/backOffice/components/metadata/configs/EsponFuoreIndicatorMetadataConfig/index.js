import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import presentation from "./presentation";
import utils from "../../../../../../utils/utils";
import AttributeMetadataScreen from "../../screens/AttributeMetadataScreen";
import TagMetadataScreen from "../../screens/TagMetadataScreen";
import ViewMetadataScreen from "../../screens/ViewMetadataScreen";

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		data: Select.specific.esponFuoreIndicators.getDataByKey(state, props.itemKey),
		editedData: Select.specific.esponFuoreIndicators.getEditedDataByKey(state, props.itemKey),

		deletable: Select.specific.esponFuoreIndicators.getDeletePermissionByKey(state, props.itemKey),
		editable: Select.specific.esponFuoreIndicators.getUpdatePermissionByKey(state, props.itemKey),

		attributes: Select.specific.backOffice.attributes.getAllForActiveApp(state, order),

		// todo selected tags
		tags: Select.specific.backOffice.tags.getAllForActiveApp(state, order),
		views: Select.specific.backOffice.views.getAllForActiveApp(state, order),

		enableAttributeCreate: Select.users.hasActiveUserPermissionToCreate(state, 'attributes'),
		enableTagCreate: Select.users.hasActiveUserPermissionToCreate(state, 'tags'),
		// todo check permissions for view creation
		enableViewCreate: true,
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'EsponFuoreIndicatorMetadataConfig_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onMount: () => {
				dispatch(Action.specific.esponFuoreIndicators.useKeys([props.itemKey], componentId));

				dispatch(Action.specific.backOffice.attributes.useIndexed({application: true}, null, order, 1, 1000, componentId));
				dispatch(Action.specific.backOffice.tags.useIndexed({application: true}, null, order, 1, 1000, componentId));
				dispatch(Action.specific.backOffice.views.useIndexed({application: true}, null, order, 1, 1000, componentId));
			},
			onSave: () => {
				dispatch(Action.specific.esponFuoreIndicators.saveEdited(props.itemKey));
			},
			onDelete: (item) => {
				dispatch(Action.specific.esponFuoreIndicators.delete({key: props.itemKey, data: item}));
				dispatch(Action.screens.close('metadata', 'metadata-esponFuoreIndicatorConfig'));
			},
			onAttributeAdd(itemKey) {
				dispatch(Action.specific.backOffice.attributes.create(itemKey));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-attributeConfig', 40, 40, AttributeMetadataScreen, {itemKey}))
			},
			onTagAdd(itemKey) {
				dispatch(Action.specific.backOffice.tags.create(itemKey));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-tagConfig', 40, 40, TagMetadataScreen, {itemKey}))
			},
			onViewAdd(itemKey) {
				dispatch(Action.specific.backOffice.views.create(itemKey));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-viewConfig', 40, 40, ViewMetadataScreen, {itemKey}))
			},
			onAttributeClick: (key) => {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-attributeConfig', 40, 40, AttributeMetadataScreen, {itemKey: key}))
			},
			onTagClick: (key) => {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-tagConfig', 40, 40, TagMetadataScreen, {itemKey: key}))
			},
			onViewClick: (key) => {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-viewConfig', 40, 40, ViewMetadataScreen, {itemKey: key}))
			},
			onUnmount: () => {
				dispatch(Action.specific.esponFuoreIndicators.useKeysClear(componentId));

				dispatch(Action.attributes.useIndexedClear(componentId));
				dispatch(Action.tags.useIndexedClear(componentId));
				dispatch(Action.views.useIndexedClear(componentId));
			},
			updateEdited: (key, value) => {
				dispatch(Action.specific.esponFuoreIndicators.updateEdited(props.itemKey, key, value));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);