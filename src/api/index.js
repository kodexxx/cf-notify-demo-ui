import config from '../config';
import axios from 'axios';

class Api {
    getUsers() {
        return axios({
            method: 'GET',
            url: config.apiUri + '/user',
        });
    }

    getIntegrations(userId) {
        return axios({
            method: 'GET',
            url: config.apiUri + '/integration',
            params: {
                userId,
            },
        });
    }

    getAvailableIntegration() {
        return axios({
            method: 'GET',
            url: config.apiUri + '/integration/available',
        });
    }

    setEvents(integrationId, eventName, value) {
        return axios({
            method: 'POST',
            url: config.apiUri + '/integration/events',
            data: {
                integrationId,
                eventName,
                value,
            },
        });
    }

    updateSettings(integrationId, settings) {
        return axios({
            method: 'POST',
            url: config.apiUri + '/integration/settings',
            data: {
                integrationId,
                settings,
            },
        });
    }

    sendNotify(userId, eventType, data) {
        return axios({
            method: 'POST',
            url: config.apiUri + '/notification',
            data: {
                userId,
                eventType,
                data,
            },
        });
    }
}


export default new Api();
