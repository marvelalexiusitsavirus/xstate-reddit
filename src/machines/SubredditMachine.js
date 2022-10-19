import { assign, createMachine } from "xstate";

const fetchSubreddit = (context) => {
  const { subreddit } = context;

  return fetch(`https://www.reddit.com/r/${subreddit}.json`)
  .then((response) => response.json())
  .then((json) => json.data.children.map((child) => child.data));
}

const SubredditMachine = (subreddit) => {
return createMachine({
    id: 'subreddit',
    initial: 'loading',
    context: {
      subreddit,
      posts: null,
      lastUpdated: null,
    },
    states: {
      loading: {
        invoke: {
          id: 'fetch-subreddit',
          src: fetchSubreddit,
          onDone: {
            target: 'loaded',
            actions: assign({
              posts: (_, event) => event.data,
              lastUpdated: () => Date.now(),
            })
          },
          onError: 'failed',
        },
      },
      loaded: {
        on: {
          REFRESH: 'loading',
        }
      },
      failure: {
        on: {
          RETRY: 'loading',
        }
      }
    },
  })
};

export default SubredditMachine;