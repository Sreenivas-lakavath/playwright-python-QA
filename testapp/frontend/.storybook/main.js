module.exports = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@chromatic-com/storybook'],

  // New Storybook framework config format requires an object with a name field.
  framework: {
    // Use the '-vite' framework package which is compatible with the Vite builder
    // Some Storybook versions expect '@storybook/web-components-vite' as the framework name.
    name: '@storybook/web-components-vite',
    options: {},
  },

  docs: {
    autodocs: true
  }
};
