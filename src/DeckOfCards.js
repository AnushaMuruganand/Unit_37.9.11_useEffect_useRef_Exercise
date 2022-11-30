import React, { useState, useEffect } from "react";
import Card from "./Card"
import axios from "axios";
import "./Deck.css"

const API_BASE_URL = "https://deckofcardsapi.com/api/deck";

function DeckOfCards() {
    const [deck, setDeck] = useState(null);

    const [cards, setCards] = useState([]);

    const [isShuffling, setIsShuffling] = useState(false);

    useEffect(() => {
        async function loadData() {
            const res = await axios.get(`${API_BASE_URL}/new/shuffle/`);
            setDeck(res.data);
        }
        loadData();
    }, []);

    // Draws a card when the button id clicked
    async function draw() {
        try {
            const res = await axios.get(`${API_BASE_URL}/${deck.deck_id}/draw`);
            // console.log(res.data)
            if (res.data.remaining === 0) throw new Error("No Cards in the deck!!");

            const card = res.data.cards[0];

            // Setting the state of cards each time a card is drawn from the deck as an ARRAY OF OBJECTS
            setCards(cards => [
                ...cards,
                {
                    id: card.code,
                    name: card.suit + " " + card.value,
                    image: card.image,
                }
            ])

        } catch (e) {
            alert(e);
        }
    }

    /** Shuffle: change the state & effect will kick in. */
    async function startShuffling() {
        setIsShuffling(true);
        try {
        await axios.get(`${API_BASE_URL}/${deck.deck_id}/shuffle/`);
        setCards([]);
        } catch (err) {
        alert(err);
        }finally {
        setIsShuffling(false);
        }
    }

    /** Return draw button (disabled if shuffling) */
    function renderDrawBtnIfOk() {
        if (!deck) return null;

        return (
        <button
            className="Deck-gimme"
            onClick={draw}
            disabled={isShuffling}>
            DRAW
        </button>
        );
    }

    /** Return shuffle button (disabled if already is) */
    function renderShuffleBtnIfOk() {
        if (!deck) return null;
        return (
        <button
            className="Deck-gimme"
            onClick={startShuffling}
            disabled={isShuffling}>
            SHUFFLE DECK
        </button>
        );
    }

    return (
        <main className="Deck">
            
            {renderDrawBtnIfOk()}
            {renderShuffleBtnIfOk()}

            <div className="Deck-cardarea">
                {cards.map(c => (
                   <Card key={c.id} name={c.name} image={c.image} />
                ))}
            </div>  
        </main>
    )
}

    export default DeckOfCards;