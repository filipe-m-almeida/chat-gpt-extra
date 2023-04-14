# ChatGPT Inline Code Renderer

A Chrome extension that dynamically renders HTML code blocks inline as the page is being created. Seamlessly view inline HTML code snippets directly in your chat window.

## Features

- Toggles between HTML code and rendered previews with a single click
- Supports HTML and SVG code blocks
- Renders code blocks inline within HTML/SVG documents
- Uses a sandboxed iframe to safely display the rendered HTML code

## Installation

Install the latest version from [ChatGPT Extra](https://chrome.google.com/webstore/detail/chatgpt-extra/ampbkjcmmefhmillnhoedcaonipplcbi)

## Manual installation

1. Download the source code from the repository and extract the contents to a folder.
2. Open the Chrome browser and navigate to `chrome://extensions/`.
3. Enable the "Developer mode" toggle in the top right corner of the extensions page.
4. Click the "Load unpacked" button and select the extracted folder containing the source code.
5. The extension should now appear in your list of installed extensions.

## Usage

1. After installing the extension, navigate to a website with supported code blocks.
2. The extension will automatically add a "🌐 Toggle Rendering" button to the header of each supported code block.
3. Click the "🌐 Toggle Rendering" button to switch between the HTML code and the rendered preview.

## Limitations

- The CSS selectors are fragile and based on the current hard-coded HTML structure and class names. Future updates may require changes to the selectors.
- As it navigates a compiled web page with non human-readable CSS class names, the code is not straightforward to follow. That said, it could bennefit from a significant cleanup.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or report any issues you encounter while using the extension.

## License

This project is licensed under the MIT License.

## Author

Filipe Almeida <filipe.almeida@gmail.com>
