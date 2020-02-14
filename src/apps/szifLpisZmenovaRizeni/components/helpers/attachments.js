import path from "path";
import config from "../../../../config/index";

const getAttachmentsBaseUrl = () => {
    return config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, config.apiBackendPath, 'backend','rest','attachments');
};

export default getAttachmentsBaseUrl;