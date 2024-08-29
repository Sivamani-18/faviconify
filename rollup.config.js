import resolve from '@rollup/plugin-node-resolve'; // Resolve external dependencies
import commonjs from '@rollup/plugin-commonjs'; // Convert CommonJS modules to ES modules
import babel from '@rollup/plugin-babel'; // Transpile your code using Babel
import { terser } from 'rollup-plugin-terser'; // Minify the output code
import typescript from 'rollup-plugin-typescript2'; // Import the TypeScript plugin

export default {
  input: 'src/index.tsx',
  output: {
    file: 'dist/bundle.js',
    format: 'umd',
    name: 'Faviconify',
    sourcemap: true,
    exports: 'named',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  },
  plugins: [
    resolve(),
    commonjs(),
    babel(),
    typescript({
      tsconfig: 'tsconfig.json',
      clean: true,
    }),
    terser(),
  ],
  external: ['react', 'react-dom'],
};
