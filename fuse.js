const { src, task, context, bumpVersion } = require('fuse-box/sparky')
const { FuseBox, QuantumPlugin, CSSPlugin, SassPlugin, WebIndexPlugin, CopyPlugin } = require('fuse-box')
const express = require('express')
const path = require('path')

task('default', async context => {
	await context.clean()
	await context.development()
})

task('dist', async context => {
	await context.clean()
	await context.dist()
})

context(
	class {
		getConfig() {
			return FuseBox.init({
				homeDir: 'src',
				target: 'browser@esnext',
				hash: this.isProduction,
				output: 'dist/$name.js',
				plugins: [
          [SassPlugin(), CSSPlugin()],
          CopyPlugin({ files: ['**/*.json', '**/*.png'] }),
					WebIndexPlugin({
						template: 'src/index.html'
					}),
					this.isProduction &&
						QuantumPlugin({
							css: true,
							uglify: true
						})
				]
			})
		}
		async clean() {
			await src('./dist')
				.clean('dist/')
				.exec()
		}

		async prepareDistFolder() {
			await bumpVersion('package.json', { type: 'patch' })
			await src('./package.json')
				.dest('dist/')
				.exec()
		}

		dist() {
			this.isProduction = true
			const fuse = this.getConfig()
			fuse.dev({ fallback: 'index.html' })
			fuse
				.bundle('app')
				.splitConfig({
					dest: '/chunks/'
				})
				.instructions('>index.ts')
			return fuse.run()
		}

		development() {
			const fuse = this.getConfig()
			fuse.dev({ fallback: 'index.html' }, server => {
				const app = server.httpServer.app
				const dist = path.resolve('./assets')
				app.use('/assets/', express.static(dist))
			})
			fuse
				.bundle('app')
				.hmr()
				.instructions('>index.ts')
				.watch()
			return fuse.run()
		}
	}
)