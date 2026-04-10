import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

export class Poe implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Poe',
		name: 'poe',
		icon: 'file:Poelightsvg.svg',
		group: ['transform'],
		version: 1,
		description: 'Send prompts to AI models via Poe',
		usableAsTool: true,
		defaults: {
			name: 'Poe',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'poeApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Model Name or ID',
				name: 'model',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getModels',
				},
				default: '',
				required: true,
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
				required: true,
				description: 'The prompt to send to the model',
			},
			{
				displayName: 'Max Tokens',
				name: 'maxTokens',
				type: 'number',
				default: 1024,
				description:
					'Maximum number of tokens to generate. Lower values help avoid credit limit errors.',
			},
			{
				displayName: 'Temperature',
				name: 'temperature',
				type: 'number',
				typeOptions: { minValue: 0, maxValue: 2 },
				default: 0.7,
				description: 'Sampling temperature between 0 and 2. Higher values produce more random output.',
			},
		],
	};

	methods = {
		loadOptions: {
			async getModels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'poeApi',
						{
							method: 'GET',
							url: 'https://api.poe.com/v1/models',
							json: true,
						},
					);

					if (!response.data || !Array.isArray(response.data)) {
						return [];
					}

					return response.data.map((model: { id: string; name?: string; description?: string }) => ({
						name: model.name || model.id,
						value: model.id,
						description: model.description || `Model ID: ${model.id}`,
					}));
				} catch (error) {
					throw new NodeOperationError(this.getNode(), `Failed to fetch models: ${(error as Error).message}`);
				}
			},
		},
	};

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		const returnData = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const prompt = this.getNodeParameter('prompt', i) as string;
				const model = this.getNodeParameter('model', i) as string;
				const maxTokens = this.getNodeParameter('maxTokens', i) as number;
				const temperature = this.getNodeParameter('temperature', i) as number;

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'poeApi',
					{
						method: 'POST',
						url: 'https://api.poe.com/v1/chat/completions',
						body: {
							model,
							messages: [{ role: 'user', content: prompt }],
							max_tokens: maxTokens,
							temperature,
						},
						json: true,
					},
				);

				returnData.push({ json: response });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: i });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
