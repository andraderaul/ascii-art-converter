# Security Policy

## Supported versions

This project is maintained from the `main` branch. Security fixes, when needed, are applied there first.

## Reporting a vulnerability

If you find a vulnerability, please open a private vulnerability report on GitHub or contact the maintainer directly. Avoid opening public issues for exploitable security problems until they have been reviewed.

## API keys and privacy model

ASCII Art Converter is a fully client-side app. It does not operate a backend server and does not receive user images, webcam frames, or AI provider API keys.

The optional AI analysis feature uses a bring-your-own-key model:

- API keys are stored in browser `localStorage`.
- Rendered ASCII canvas images are sent directly from the browser to the selected AI Provider.
- The project cannot revoke, inspect, or protect API keys beyond the browser storage model.

Do not commit API keys, `.env` files, provider credentials, or personal secrets to this repository.
