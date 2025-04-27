import { defineConfig } from '@tanstack/react-start/config'
import tsConfigPaths from 'vite-tsconfig-paths'
import removeConsole from 'vite-plugin-remove-console'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
	tsr: {
		appDirectory: 'src',
	},
	server: {
		preset: 'node-server',
	},
	vite: {
		plugins: [
			removeConsole(),
			svgr(),
			ViteImageOptimizer(),
			tsConfigPaths({
				projects: ['./tsconfig.json'],
			}),
		],
	},
})
