import React from 'react';
import Songrow from './songrow.jsx';

export default function Showsongs({ songsInput }) {
  return (
    <table className="showsongs">
      {songsInput.map((songObj) => (
        <Songrow songObj={songObj} />
      ))}
    </table>
  );
}
