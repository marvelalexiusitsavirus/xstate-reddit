import logo from './logo.svg';
import './App.css';
import { useMachine } from 'xstate';
import { RedditMachine } from './machines';
import { Subreddit } from './components';

function App() {
  const [current, send] = useMachine(RedditMachine);
  const { subreddit } = current.context;

  return (
    <div className="App">
      {subreddit && <Subreddit service={subreddit} key={subreddit} />}
    </div>
  );
}

export default App;
