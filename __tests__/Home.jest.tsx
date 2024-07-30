// __tests__/App.test.tsx
import React from 'react';
import renderer from 'react-test-renderer';
import Home from '../app/pages/Home';

describe('<Home />', () => {
  it('has 1 child', () => {
    const tree = renderer.create(<Home navigation={undefined} />).toJSON();
    expect(tree && (tree as renderer.ReactTestRendererJSON).children.length).toBe(4);
  });
  it('renders correctly', () => {
    const tree = renderer.create(<Home navigation={undefined} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
