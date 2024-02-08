/*
 * ChatGPT Inline Code Renderer
 *
 * This script provides functionality for rendering inline code blocks within
 * HTML/PHP/SVG documents and toggling between the rendered output and the code.
 * 
 * TODO:
 * - The CSS selectors are very fragile and based on the current hard-coded HTML
 *   structure and hard-coded class names. Make the more generic and relative to other.
 *   HTML elements.
 * 
 * Author: Filipe Almeida <filipe.almeida@gmail.com>
 */


const config = {
  codeBlockContainerSelector: '.dark.bg-gray-950.rounded-md',
  headerSelector: '.flex.items-center.relative.text-token-text-secondary.bg-token-main-surface-secondary.px-4.py-2.text-xs.font-sans.justify-between.rounded-t-md',
  codeBlockSelector: 'code.hljs',
  renderedCodeSelector: '.rendered-code',
  iframeSelector: 'iframe',
  allowedClasses: ['language-html', 'language-php-template', 'language-svg'],
};

// Update iframe content
const updateIframeContent = (codeContent, iframe) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(codeContent, 'text/html');

  const script = document.createElement('script');
  script.textContent = `
    window.addEventListener("message", (event) => {
      if (event.data.type === "requestHeight") {
        const height = document.documentElement.scrollHeight;
        window.parent.postMessage({ type: "iframeHeight", height: height }, "*");
      }
    });
  `;

  const head = doc.head || doc.querySelector('head') || doc.createElement('head');
  head.appendChild(script);
  doc.documentElement.insertBefore(head, doc.documentElement.firstChild);

  const serializer = new XMLSerializer();
  const modifiedContent = serializer.serializeToString(doc);

  iframe.src = `data:text/html;base64,${btoa(modifiedContent)}`;
};

// Toggle rendering between code block and iframe
const toggleRendering = (event) => {
  const codeBlockContainer = event.target.closest(config.codeBlockContainerSelector);
  const codeBlock = codeBlockContainer.querySelector(config.codeBlockSelector);
  const codeContent = codeBlock.innerText;
  const renderedCode = codeBlockContainer.querySelector(config.renderedCodeSelector);
  const iframe = renderedCode.querySelector(config.iframeSelector);

  updateIframeContent(codeContent, iframe);

  codeBlock.classList.toggle('hidden');
  renderedCode.classList.toggle('hidden');

  if (!codeBlock.classList.contains('hidden')) {
    iframe.contentWindow.postMessage({ type: 'requestHeight' }, '*');
  }
};

// Create a toggle button for a code block container
const createToggleTab = (codeBlockContainer) => {
  const codeBlock = codeBlockContainer.querySelector(config.codeBlockSelector);

  if (!config.allowedClasses.some((cls) => codeBlock.classList.contains(cls))) {
    return;
  }

  const existingToggleTab = codeBlockContainer.querySelector('button.toggle-rendering-button');
  if (existingToggleTab) {
    return;
  }

  const toggleTab = createElementWithAttributes(
    'button',
    { 'class': 'toggle-rendering-button' },
    '🌐 Toggle Rendering');
  toggleTab.style.marginLeft = '8px';
  toggleTab.style.cursor = 'pointer';
  toggleTab.addEventListener('click', toggleRendering);

  const header = codeBlockContainer.querySelector(config.headerSelector);
  header.appendChild(toggleTab);
};

const createElementWithAttributes = (tagName, attributes, textContent) => {
  const element = document.createElement(tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  if (textContent) {
    element.textContent = textContent;
  }
  return element;
};

const createIframe = () => {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('sandbox', 'allow-scripts allow-modals');
  iframe.style.width = '100%';
  return iframe;
};

// Render an inline code block
const renderInlineCodeBlock = (codeBlockContainer) => {
  createToggleTab(codeBlockContainer);

  const codeBlock = codeBlockContainer.querySelector(config.codeBlockSelector);
  const codeContent = codeBlock.innerText;

  const prevContent = codeBlockContainer.getAttribute('data-prev-content');
  if (prevContent === codeContent) {
    return;
  }
  codeBlockContainer.setAttribute('data-prev-content', codeContent);

  const renderedCode = codeBlockContainer.querySelector(config.renderedCodeSelector);
  if (!renderedCode) {
    const newRenderedCode = document.createElement('div');
    newRenderedCode.classList.add('rendered-code', 'hidden');

    const iframe = createIframe();
    newRenderedCode.appendChild(iframe);

    codeBlock.parentNode.insertBefore(newRenderedCode, codeBlock.nextSibling);
  }
};

const renderInlineCodeBlocks = () => {
  const codeBlocks = document.querySelectorAll(config.codeBlockSelector);
  codeBlocks.forEach((codeBlock) => {
    const codeBlockContainer = codeBlock.closest(config.codeBlockContainerSelector);
    renderInlineCodeBlock(codeBlockContainer);
  });
};

window.addEventListener('message', (event) => {
  console.log(`Received message from iframe: ${event.data}`);
  if (event.data.type === 'iframeHeight') {
    const height = parseInt(event.data.height);
    if (!isNaN(height)) {
      const iframes = document.querySelectorAll('.rendered-code iframe');
      iframes.forEach(iframe => {
        if (iframe.contentWindow === event.source) {
          console.log(`Setting iframe height to ${height}px`);
          iframe.style.height = `${height}px`;
        }
      });
    } else {
      console.error(`Invalid height received from iframe: ${event.data.height}`);
    }
  }
});

renderInlineCodeBlocks();


setInterval(renderInlineCodeBlocks, 1000);
