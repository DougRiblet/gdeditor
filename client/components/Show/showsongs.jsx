import React from 'react';
import PropTypes from 'prop-types';
import Songrow from './songrow.jsx';

function Showsongs({ addCheckedSong, songsInput }) {
  return (
    <table className="showsongs">
      {songsInput.map((songObj) => (
        <Songrow songObj={songObj} addCheckedSong={addCheckedSong} />
      ))}
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
  })).isRequired,
};

export default Showsongs;
