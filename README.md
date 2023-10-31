# Frontend application template

## Scripts

- `dev`/`start` - start dev server and open browser
- `build` - build for production
- `preview` - locally preview production build
- `test` - launch test runner
- `lint`: - starts the check
- `lint:fix`: - corrects

When you press ctrl/cmd + s - automatic formatting occurs.
If you don't have the Prettier extension installed, install it.

## Proxy
In file `vite.config.ts` a proxy is registered - this is the address to which requests will be sent during development.
```
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
			},
		},
```
