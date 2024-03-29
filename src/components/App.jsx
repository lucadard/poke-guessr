import { useState, useEffect } from 'react';

import api from '../api';
import './App.css';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    let item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });
  const setValue = value => {
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };
  return [storedValue, setValue];
};

const App = () => {
  const [pokemon, setPokemon] = useState({});
  const [score, setScore] = useLocalStorage('score', {
    wins: 0,
    losses: 0,
  });
  const [correct, setCorrect] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPokemon();
  }, []);

  const fetchPokemon = async () => {
    setLoading(true);
    const res = await api.random();
    console.log('answer:', res.name);
    setPokemon(res);
    setLoading(false);
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (loading) return;
    if (event.target.text.value === '') return;
    checkInput(event.target.text.value)
      ? (setScore({ ...score, wins: score.wins + 1 }), setCorrect(true))
      : (setScore({ ...score, losses: score.losses + 1 }), setCorrect(false));
    event.target.text.value = '';
  };

  const checkInput = input => {
    if (input.includes(' ')) input = input.replace(' ', '');
    if (input.includes('.')) input = input.replace('.', '');
    input = input.toLowerCase();
    return input === pokemon.name;
  };

  const handleNextRound = event => {
    event.preventDefault();
    if (correct === null) return;
    fetchPokemon();
    setCorrect(null);
  };

  const returnAnswer = () => {
    return correct ? (
      <span className="nes-text is-success">Correct!</span>
    ) : (
      <>
        <span className="nes-text is-error">Incorrect</span>
        <p>
          The Pokemon was{' '}
          <span style={{ textTransform: 'capitalize' }}>{pokemon.name}</span>!
        </p>
      </>
    );
  };
  const renderButton = () => {
    return (
      <button
        type="submit"
        className={`nes-btn ${
          loading || correct !== null ? 'is-disabled' : 'is-primary'
        }`}
      >
        Submit
      </button>
    );
  };

  return (
    <div className="wrapper">
      <div
        className={`response nes-balloon from-left is-rounded ${
          correct === null && 'hide'
        }`}
      >
        {returnAnswer()}
      </div>
      <div
        style={{ width: '600px' }}
        className="nes-container with-title is-centered"
      >
        <p className="title">Who's that Pokemon?</p>
        <div className="imageContainer">
          {loading ? (
            <p className="title">Loading...</p>
          ) : (
            <img
              src={pokemon.image}
              alt={`pokemon silhouette`}
              className={`pokemonImg ${correct === null ? 'hide' : ''}`}
            />
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            name="text"
            autoComplete="off"
            type="text"
            autoFocus
            className={`nes-input ${correct !== null && 'disabled'}`}
          />
          {renderButton()}
        </form>
      </div>
      <div className="bottom-container">
        <div className="nes-container score-container">
          <div>
            <p>Wins: {score.wins}</p>
            <p>Losses: {score.losses}</p>
          </div>
          <button
            className="nes-btn reset-button"
            onClick={() => setScore({ wins: 0, losses: 0 })}
          >
            Reset
          </button>
        </div>
        <div className="button-container">
          <button
            type="submit"
            className={`nes-btn ${correct === null ? 'is-disabled' : ''}`}
            onClick={handleNextRound}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
