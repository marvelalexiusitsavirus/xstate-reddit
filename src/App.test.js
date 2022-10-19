import { assert } from 'chai';
import { interpret } from 'xstate';
import { RedditMachine } from './machines';

describe("simulate reddit machine", () => {
  it("should load subreddit", (done) => {
    const redditService = interpret(RedditMachine)
      .onTransition((state) => {
        if (state.matches({ selected: 'loaded' })) {
          assert.isNotEmpty(state.context.posts);
          
          done();
        }
      })
      .start();

    redditService.send({ type: 'SELECT', name: 'reactjs' });
  });
});

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
