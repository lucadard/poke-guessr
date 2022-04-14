import { useState, useEffect } from 'react';

import api from '../api';
import './App.css';

const App = () => {
  const [pokemon, setPokemon] = useState({});
  const [score, setScore] = useState(0);
  const [losses, setLosses] = useState(0);
  const [correct, setCorrect] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPokemon();
  }, []);

  const fetchPokemon = async () => {
    setLoading(true);
    const res = await api.random();
    console.log(res.name);
    setPokemon(res);
    setLoading(false);
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (loading) return;
    checkInput(event.target.text.value)
      ? (setScore(score + 1), setCorrect(true))
      : (setLosses(losses + 1), setCorrect(false));
    event.target.text.value = '';
  };

  const checkInput = input => {
    let re = new RegExp(`[${pokemon.name}]`, 'gi');
    return re.test(input);
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
        <span>{`The Pokemon was ${pokemon.name}!`}</span>
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
          <p>Wins: {score}</p>
          <p>Losses: {losses}</p>
        </div>
        <div className="button-container">
          <button
            type="submit"
            className={`nes-btn ${correct === null ? 'is-disabled' : ''}`}
            onClick={handleNextRound}
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
