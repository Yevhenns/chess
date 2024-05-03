import { NavLink } from 'react-router-dom';

export const Home = () => {
  return (
    <div>
      <p>Home</p>
      <NavLink to="/game">Game</NavLink>
    </div>
  );
};
