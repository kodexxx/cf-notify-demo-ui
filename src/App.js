import React, {Component} from 'react';

import {
    Select,
    Container,
    Header,
    Card,
    Form,
    Label,
    Icon,
    Divider,
    Checkbox,
    List,
    Button,
    Input,
} from 'semantic-ui-react';

import api from './api';
import providers from './providers';
import eventExamples from './eventsExamples';

import 'semantic-ui-css/semantic.min.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            integration: [],
            availableIntegrations: {},
            events: [],
            integrationsSettings: {},
            currentUser: null,
        };


        this.fetchUsers = this.fetchUsers.bind(this);
        this.fetchAvailableIntegration = this.fetchAvailableIntegration.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.syncIntegrationsSettings = this.syncIntegrationsSettings.bind(this);
        this.sendNotify = this.sendNotify.bind(this);


        this.fetchAvailableIntegration().then(() => this.fetchUsers());
    }

    async fetchUsers() {
        const r = await api.getUsers();


        this.setState({
            users: r.data.map(item => ({
                key: item.id,
                value: item.id,
                text: item.username,
            })),
        });
    }

    async handleUserChange(e, { value }) {
        console.log(value);

        const r = await api.getIntegrations(value);
        this.setState({
            integration: r.data, integrationsSettings: r.data.reduce((accum, item) => ({
                ...accum,
                [item._id]: item.settings,
            }), {}),
            currentUser: value,
        });

    }

    async fetchAvailableIntegration() {
        const r = await api.getAvailableIntegration();


        this.setState({ availableIntegrations: r.data.providers, events: r.data.events });
    }

    async syncChange(integrationId, eventName, value) {
        api.setEvents(integrationId, eventName, value);
    }

    async saveSettings(integrationId) {
        const res = await api.updateSettings(integrationId, this.state.integrationsSettings[integrationId]);

        console.log(res);
    }

    async sendNotify(event) {
        const data = eventExamples[event];

        const res = await api.sendNotify(this.state.currentUser, event, data);

        console.log(res);
    }

    syncIntegrationsSettings(value, settingsField, id) {
        console.log(this.state);
        console.log(value, settingsField, id);

        const newIntegrationsSettings = { ...this.state.integrationsSettings };

        newIntegrationsSettings[id][settingsField] = value;
        this.setState({ integrationsSettings: newIntegrationsSettings });
    }

    render() {
        return (
            <div className="App">
                <Container style={{ marginTop: '3em' }}>
                    <Header as={'h1'}>
                        CF-Notification-System
                    </Header>
                    <Divider horizontal>
                        <Header as='h4'>
                            <Icon name='user'/>
                            Users
                        </Header>
                    </Divider>
                    <Container>
                        <Select placeholder='Select your user' options={this.state.users}
                                onChange={this.handleUserChange}/>
                    </Container>
                    {this.state.currentUser && (
                        <div>
                            <Divider horizontal>
                                <Header as='h4'>
                                    <Icon name='bar chart'/>
                                    Integrations
                                </Header>
                            </Divider>

                            <Container>
                                {this.state.integration.map(item => (
                                    <Card fluid key={item.integrationType}>
                                        <Card.Content>
                                            <Card.Header>{item.integrationType}</Card.Header>
                                            <Card.Description>
                                                <List>

                                                </List>
                                                <List>
                                                    {this.state.availableIntegrations[item.integrationType].map(event => (
                                                        <List.Item
                                                            key={event + item.integrationType}>
                                                            <Checkbox label={event} toggle
                                                                      defaultChecked={item.notifications.includes(event)}
                                                                      onChange={(_, { checked }) => this.syncChange(item._id, event, checked)}></Checkbox>
                                                        </List.Item>
                                                    ))}
                                                </List>
                                            </Card.Description>
                                        </Card.Content>
                                        <Card.Content extra>
                                            <Card.Header>Settings</Card.Header>
                                            <Form.Field inline style={{ marginTop: '10px' }}>
                                                <Input type='text'
                                                       value={this.state.integrationsSettings[item._id][providers[item.integrationType].settingsField]}
                                                       style={{ width: '20%' }}
                                                       onChange={(_, { value }) => this.syncIntegrationsSettings(value, providers[item.integrationType].settingsField, item._id)}/>
                                                <Label
                                                    pointing='left'>{providers[item.integrationType].label}</Label>
                                            </Form.Field>
                                            <Button color={'green'} style={{
                                                marginTop: '10px',
                                                float: 'right',
                                            }}
                                                    onClick={() => this.saveSettings(item._id)}>Save</Button>
                                        </Card.Content>
                                    </Card>
                                ))}
                            </Container>

                            <Divider horizontal>
                                <Header as='h4'>
                                    <Icon name='bar chart'/>
                                    Events
                                </Header>
                            </Divider>

                            <Container style={{ marginBottom: '15px' }}>
                                {Object.keys(eventExamples).map(item => (
                                    <Button primary key={item}
                                            onClick={() => this.sendNotify(item)}>{item}</Button>
                                ))}
                            </Container>
                        </div>
                    )}

                </Container>
            </div>
        );
    }
}

export default App;
