import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const GameCard = ({ game }) => (
  <Col>
    <Card>
      <Card.Img variant="top" src={`game-icons/${game.imageName}.png`} />
      <Card.Body>
        <Card.Title>{game.title}</Card.Title>
        <Card.Text>
          {game.description}
        </Card.Text>
        <Button variant="primary" disabled>Coming Soon</Button>
      </Card.Body>
    </Card>
  </Col>
);

const HomePage = () => {
  const games = [
    { title: 'Slots', imageName: 'Slots', description: 'Hit the Jackpot!' },
    { title: 'Blackjack', imageName: 'Blackjack', description: 'Beat the dealer!' },
    { title: 'Roulette', imageName: 'Roulette', description: 'Spin and win!' },
    { title: 'Texas Holdem Poker', imageName: 'TexasHoldem', description: "Bluff, Bet, or Bail!" },
    { title: 'Dice Roll', imageName: 'DiceRoll', description: 'Roll to riches!' },
    { title: 'Video Poker', imageName: 'VideoPoker', description: 'Deal, Bet, Boom!' },
    { title: 'Wheel Of Fortune', imageName: 'Wheel', description: 'Whirl, Win, Woo!' },
    { title: 'More Coming Soon', imageName: '8yg_3', description: 'Stay tuned!' },
  ];
  
  return (
    <Container fluid>
      <Row xs={1} md={4} className="g-4">
        {games.map((game, index) => (
          <GameCard key={index} game={game} />
        ))}
      </Row>
    </Container>
  );
};

export default HomePage;
