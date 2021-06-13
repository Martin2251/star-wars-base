import React from "react";
import "./App.css";
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";

function CharacterPage() {
  let { id } = useParams();
  // this allows the router to work as you need useParams to Link it
  const [characterData, setCharacterData] = useState("");

  useEffect(
    function () {
      fetch("https://swapi.dev/api/people/" + id)
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          setCharacterData(data);
        });
    },
    [id]
  );

  return (
    <div>
      <h1>Name: {characterData.name}</h1>
      <h1>Height: {characterData.height}</h1>
      <h1>Mass: {characterData.mass}</h1>
      <h1>gender: {characterData.gender}</h1>
      <h1>hair color: {characterData.hair_color}</h1>
      <h1>eye color: {characterData.eye_color}</h1>
    </div>
  );
}

//the card of the character
// now I want to change it dynamically so i use props and look at the matching ones from the api
function Card(props) {
  const id = props.character.url.split("/")[5];
  //as it reads from the api.
  // the films one is .length because I need to get to an array for the number of films

  return (
    <div className="card">
      <Link to={`/character/${id}`}>
        <h4>{props.character.name}</h4>
        <p>Height:{props.character.height}</p>
        <p>Birth Year:{props.character.birth_year}</p>
        <p>Number of Films:{props.character.films.length} </p>
      </Link>
    </div>
  );
}
function App() {
  const [listCharacters, setListCharacters] = useState([]);
  // its an array of data coming back and we want to display the characters
  const [nextUrl, setNextUrl] = useState("");

  // make a request as soon as you land on the page use Effect takes two argument and dependency list
  // using the star wars api always fetch a response that is Json, I want the list of characters (data.results).and the next URL (data.next) which is
  useEffect(function () {
    fetch("https://swapi.dev/api/people")
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        setListCharacters(data.results);
        setNextUrl(data.next);
      });
  }, []);

  // Load more will change the state of the app, load more on the bottom of the page
  function loadMore() {
    // fetch the next url
    fetch(nextUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // update the state
        setListCharacters([...listCharacters, ...data.results]);
        // set the next of the page
        setNextUrl(data.next);
      });
  }

  return (
    <Router>
      <Switch>
        <Route path="/character/:id">
          <CharacterPage></CharacterPage>
        </Route>
        <Route to="/">
          <div className="App">
            <h1> Star Wars Catalog</h1>
            <div className="card-container">
              {listCharacters.map(function (character) {
                return <Card character={character}></Card>;
              })}
            </div>
            <button onClick={loadMore} data-cy="load-more">
              Load More
            </button>
          </div>
        </Route>
      </Switch>
    </Router>
    // this button is related to the Load more function which allows the user to load more of the star wars characters
  );
}
export default App;
