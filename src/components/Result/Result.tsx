import { NavLink } from 'react-router-dom';
import css from './Result.module.css';

export const Result = () => {
  return (
    <div className={css.modalWrapper}>
      <div className={css.modal}>
        <>
          <p>Game over!</p>
          <NavLink to="/">Exit</NavLink>
        </>
      </div>
    </div>
  );
};
