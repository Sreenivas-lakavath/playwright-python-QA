// Migration note: Storybook 8 removed automatic mocking via `argTypesRegex`.
// If your stories relied on `argTypesRegex` to create action spies for event handlers,
// migrate those cases to explicitly mock functions using the `fn` helper in play functions
// as described in the migration guide:
// https://storybook.js.org/docs/essentials/actions#via-storybooktest-fn-spy-function
export const parameters = {
  actions: {},
};
export const tags = ["autodocs"];
