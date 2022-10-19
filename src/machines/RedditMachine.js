import { assign, createMachine, spawn } from "xstate";
import SubredditMachine from "./SubredditMachine";

const fetchSubreddit = (context) => {
  const { subreddit } = context;

  return fetch(`https://www.reddit.com/r/${subreddit}.json`)
  .then((response) => response.json())
  .then((json) => json.data.children.map((child) => child.data));
}

const RedditMachine = createMachine({
  id: 'reddit',
  initial: 'idle',
  context: {
    subreddits: {},
    subreddit: null
  },
  states: {
    idle: {},
    selected: {},
  },
  on: {
    SELECT: {
      target: '.selected',
      actions: assign((context, event) => {
        let subreddit = context.subreddits[event.name];

        if (subreddit) {
          return {
            ...context,
            subreddit
          }
        }

        subreddit = spawn(SubredditMachine(event.name));

        return {
          subreddits: {
            ...context.subreddits,
            [event.name]: subreddit,
          },
          subreddit
        }
      }),
    }
  }
});

export default RedditMachine;