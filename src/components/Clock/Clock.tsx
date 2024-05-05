import { useState } from 'react';

type ClockProps = {
  count: boolean;
};

export const Clock = ({ count }: ClockProps) => {
  const [timer, setTimer] = useState(1200);

  setTimeout(() => {
    if (timer > 0 && count) {
      const a = timer - 1;
      setTimer(a);
    }
  }, 1000);

  const minutes = timer > 0 ? Math.floor(timer / 60) % 60 : 0;
  const seconds = timer > 0 ? Math.floor(timer) % 60 : 0;

  return (
    <div>
      {minutes} : {seconds}
    </div>
  );
};
