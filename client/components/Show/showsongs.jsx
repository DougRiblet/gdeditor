import React from 'react';
import PropTypes from 'prop-types';
import Songrow from './songrow.jsx';

function Showsongs({ addCheckedSong, songsInput }) {
  return (
    <table className="showsongs">
      <tbody>
        {songsInput.map((songObj) => (
          <Songrow
            songObj={songObj}
            addCheckedSong={addCheckedSong}
            key={`${songObj.date}_${songObj.position}`}
          />
        ))}
      </tbody>
    </table>
  );
}

Showsongs.propTypes = {
  addCheckedSong: PropTypes.func.isRequired,
  songsInput: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    position: PropTypes.string,
    date: PropTypes.string,
    arrow: PropTypes.bool,
    reprise: PropTypes.bool,
  })).isRequired,
};

export default Showsongs;
