import '@testing-library/jest-dom';

// Add TextEncoder/TextDecoder polyfill
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;