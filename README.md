# n8n-nodes-poe

This is an n8n community node that lets you interact with Poe AI models in your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Poe](https://poe.com/) is an AI platform that provides access to various AI models.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-poe` in **Enter npm package name**
4. Agree to the risks and select **Install**

### Manual Installation

To get started, install the package in your n8n root directory:

```bash
npm install n8n-nodes-poe
```

For Docker-based deployments, add the following line before the font installation command in your n8n Dockerfile:

```dockerfile
RUN cd /usr/local/lib/node_modules/n8n && npm install n8n-nodes-poe
```

## Operations

- **Send Prompt**: Send a prompt to a Poe AI model and receive a response

## Credentials

You need a Poe API key to use this node. You can obtain one from [Poe API Settings](https://poe.com/api_key).

## Compatibility

Tested against n8n version 1.0+.

## Usage

1. Add the Poe node to your workflow
2. Configure your Poe API credentials
3. Select a model from the dropdown
4. Enter your prompt
5. Configure optional parameters (max tokens, temperature)
6. Execute the node

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Poe API Documentation](https://creator.poe.com/docs/quick-start)

## Version History

### 1.0.0
- Initial release
- Support for sending prompts to Poe AI models
- Dynamic model loading
- Configurable parameters (max tokens, temperature)

## License

[MIT](LICENSE.md)
