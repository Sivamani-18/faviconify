# Faviconify

[![npm version](https://badge.fury.io/js/faviconify.svg)](https://www.npmjs.com/package/faviconify)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`Faviconify` is a customizable React component that dynamically generates favicons for your web application. It allows you to easily set text-based favicons or use your own custom PNG/SVG images.

## Installation

You can install `Faviconify` using npm or yarn:

```bash
npm install faviconify
```

or

```bash
yarn add faviconify
```

## Usage

Import the `Faviconify` component into your React application and use it to set your favicon.

### Example 1: Text-Based Favicon

```javascript
import React from 'react';
import Faviconify from 'faviconify';

const App = () => {
  return (
    <>
      <Faviconify textContent="M" iconShape="rounded" fontWeight="900" />
      <h1>Welcome to My App!</h1>
    </>
  );
};

export default App;
```

### Example 2: Using a Custom Image as Favicon

```javascript
import React from 'react';
import Faviconify from 'faviconify';
import IconUrl from './path/to/your/favicon.svg'; // Ensure this is a URL, not a React component

const App = () => {
  return (
    <>
      <Faviconify imageUrl={IconUrl} iconShape="rounded" />
      <h1>Welcome to My App!</h1>
    </>
  );
};

export default App;
```

### Props

| Prop        | Type                                | Default  | Description                                                                                  |
|-------------|-------------------------------------|----------|----------------------------------------------------------------------------------------------|
| `fontFamily` | `string`                            | `Arial`  | Font family used for text content.                                                           |
| `textColor`  | `string`                            | `#FFF`   | Color of the text in the favicon.                                                            |
| `bgColor`    | `string`                            | `#000`   | Background color of the favicon.                                                             |
| `iconShape`  | `'circle' \| 'square' \| 'rounded'` | `circle` | Shape of the favicon: circle, square, or rounded square.                                     |
| `fontWeight` | `string`                            | `400`    | Font weight of the text content.                                                             |
| `textSize`   | `number`                            | `200`    | Size of the text in the favicon (in pixels).                                                 |
| `textContent`| `string`                            | `S`      | Text content to be displayed in the favicon.                                                 |
| `imageUrl`   | `string`                            | `undefined` | URL of the image to be used as a favicon. If provided, it will override text-based favicon.  |

## Features

- **Customizable Text Favicon**: Generate favicons with custom text, font, and colors.
- **Shape Options**: Choose between circle, square, and rounded square shapes.
- **Custom Image Favicon**: Use a PNG or SVG image as your favicon.
- **Easy Integration**: Simply drop the `Faviconify` component into your React app.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your ideas and improvements.

## Issues

If you encounter any problems, please open an [issue on GitHub](https://github.com/Sivamani-18/faviconify/issues).

## Author

Created by [Sivamani-18](https://github.com/Sivamani-18). Follow me on [GitHub](https://github.com/Sivamani-18) for more projects!
