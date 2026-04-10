import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class PoeApi implements ICredentialType {
	name = 'poeApi';
	displayName = 'Poe API';
	icon: Icon = { light: 'file:Poelightsvg.svg', dark: 'file:Poelightsvgdark.svg' };
	documentationUrl = 'https://creator.poe.com/docs/quick-start';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.poe.com/v1',
			url: '/models',
			method: 'GET',
		},
	};
}
