import React, { useState } from 'react';

import Showvenue from './showvenue.jsx';
import Showdate from './showdate.jsx';
import Showsongs from './showsongs.jsx';

export default function Show() {
  const [tav, setTav] = useState('');
  const [showdate, setShowdate] = useState('');
  const [site, setSite] = useState('');
  const [city, setCity] = useState('');
  const [songs, setSongs] = useState([]);
  const [checkedSongs, setCheckedSongs] = useState([]);

  const addCheckedSong = (songObj) => {
    setCheckedSongs(checkedSongs.concat(songObj));
  };

  const processSongData = (songArr, dateStr) => {
    const outputArr = [];
    let setCount = 1;
    const setNums = { 1: '1', 2: '2', 3: 'e' };
    let trackCount = 1;

    while (songArr.length) {
      let songline = songArr[0];
      let songarrow = false;
      if (songline.length > 1) {
        if (songline.endsWith('>')) {
          songarrow = true;
          songline = songline.replace(/\s?>$/, '');
        }
        const trackObj = {
          position: `${setNums[setCount]}${trackCount < 10 ? '0' : ''}${trackCount}`,
          title: songline,
          date: dateStr,
          arrow: songarrow,
        };
        outputArr.push(trackObj);
        trackCount += 1;
        songArr.shift();
      } else {
        setCount += 1;
        trackCount = 1;
        songArr.shift();
      }
    }
    return outputArr;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tavArr = tav.split(/\r?\n/).map((x) => x.trim());
    const dateline = tavArr[0];
    const siteline = tavArr[1];
    const cityline = tavArr[2];
    const songlines = tavArr.slice(4);
    const songlist = processSongData(songlines, dateline);

    setShowdate(dateline);
    setSite(siteline);
    setCity(cityline);
    setSongs(songlist);
  };

  const clearShowData = () => {
    setShowdate('');
    setSite('');
    setCity('');
    setSongs([]);
    setCheckedSongs([]);
  };

  return (
    <div className="add-container">
      <div className="input-pane">
        <form onSubmit={handleSubmit}>
          <h3>Add Show Data (plain text)</h3>
          <textarea
            value={tav}
            onChange={(e) => setTav(e.target.value)}
            cols={36}
            rows={32}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="preview-pane">
        <div className="song-preview-section">
          {Boolean(showdate)
            && (
              <Showdate
                dateInput={showdate}
              />
            )}
        </div>
        <div className="song-preview-section">
          {Boolean(site) && Boolean(city)
            && (
              <Showvenue
                cityInput={city}
                siteInput={site}
              />
            )}
        </div>
        <div className="song-preview-section">
          {Boolean(songs.length)
            && (
              <Showsongs
                songsInput={songs}
                addCheckedSong={addCheckedSong}
              />
            )}
        </div>
        <div className="song-preview-section">
          <p>Songs Input: {songs.length} | Songs Checked: {checkedSongs.length}</p>
        </div>
        <div className="after-submit">
          <button
            type="button"
            onClick={clearShowData}
          >
            Clear Show Data
          </button>
        </div>
      </div>
    </div>
  );
}
