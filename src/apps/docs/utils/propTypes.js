import React from 'react';
import {DocsToDoInline} from "../components/Page";
import parsePropTypes from 'parse-prop-types'


export const mergePropsDoc = (component, docPropTypes = []) => {
    const documentedPropTypes = [];
    const propTypes = parsePropTypes(component)
    //prefill doc
    for (const [key, value] of Object.entries(propTypes)) {
        const doc = docPropTypes.find(p => p.name === key);
        documentedPropTypes.push({
            name: key,
            type: value.type.name,
            required: value.required,
            default: value.defaultValue ? value.defaultValue.value : null,
            description: doc ? doc.description : <DocsToDoInline>description</DocsToDoInline>,
        })
    }
    return documentedPropTypes;
}