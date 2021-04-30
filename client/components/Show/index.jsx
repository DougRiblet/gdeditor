import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import Showvenue from './showvenue.jsx';
import Showdate from './showdate.jsx';
import Showsongs from './showsongs.jsx';

const ADD_SHOW = gql`
  mutation AddShow($date: String!, $site: String!, $city: String!) {
    createShow(date: $date, site: $site, city: $city) {
      id
    }
  }
`;

const ADD_TRACKS = gql`
  mutation AddTracks($tracks: [CreateTrackInput]!) {
    createTracks(tracks: $tracks) {
      count
    }
  }
`;

export default function Show() {
  // eslint-disable-next-line no-unused-vars
  const [addShow, showMutationResponse] = useMutation(ADD_SHOW);
  // eslint-disable-next-line no-unused-vars
  const [addTracks, tracksMutationResponse] = useMutation(ADD_TRACKS);

  const [tav, setTav] = useState('');
  const [showdate, setShowdate] = useState('');
  const [site, setSite] = useState('');
  const [city, setCity] = useState('');
  const [songs, setSongs] = useState([]);
  const [checkedSongs, setCheckedSongs] = useState([]);
  const [showDataSubmitted, setShowDataSubmitted] = useState(false);
  const [dateValid, setDateValid] = useState(false);

  const addCheckedSong = (songObj) => {
    setCheckedSongs(checkedSongs.concat(songObj));
  };

  const markShowDataSubmitted = () => {
    setShowDataSubmitted(true);
  };

  const checkDateFormat = (str) => {
    const segA = Number(str.slice(0, 2));
    const a = Number.isInteger(segA) && segA > 64 && segA < 96;
    const segB = Number(str.slice(2, 4));
    const b = Number.isInteger(segB) && segB > 0 && segB < 13;
    const segC = Number(str.slice(4, 6));
    const c = Number.isInteger(segC) && segC > 0 && segC < 32;
    return (a && b && c && str.length === 6);
  };

  const processSongData = (songArr, dateStr) => {
    const outputArr = [];
    let setCount = 1;
    const setNums = { 1: '1', 2: '2', 3: 'e' };
    let trackCount = 1;
    const repriseCheck = { 'Sunshine Daydream': true };

    while (songArr.length) {
      let songline = songArr[0];
      let songarrow = false;
      let songreprise = false;
      if (songline.length > 1) {
        if (songline.endsWith('>')) {
          songarrow = true;
          songline = songline.replace(/\s?>$/, '');
        }
        if (repriseCheck[songline]) {
          songreprise = true;
        } else {
          repriseCheck[songline] = true;
        }
        const trackObj = {
          position: `${setNums[setCount]}${trackCount < 10 ? '0' : ''}${trackCount}`,
          title: songline,
          date: dateStr,
          arrow: songarrow,
          reprise: songreprise,
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
    setDateValid(checkDateFormat(dateline));
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
    setShowDataSubmitted(false);
    setDateValid(false);
  };

  const handleFinalSubmit = () => {
    addShow({
      variables: { date: showdate, site, city },
    });
    markShowDataSubmitted();
  };

  const handleTracksSubmit = () => {
    addTracks({
      variables: { tracks: checkedSongs },
    });
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
        <div className="show-preview-container">
          <div className="show-preview-data">
            <div className="preview-section">
              {Boolean(showdate)
                && (
                  <Showdate
                    dateInput={showdate}
                    dateValid={dateValid}
                  />
                )}
            </div>
            <div className="preview-section">
              {Boolean(site) && Boolean(city)
                && (
                  <Showvenue
                    cityInput={city}
                    siteInput={site}
                  />
                )}
            </div>
            <div className="preview-section">
              <p>Songs Input: {songs.length}<br />Songs Checked: {checkedSongs.length}</p>
            </div>
            <div className="preview-section">
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={!dateValid}
              >
                Submit Show Data
              </button>
            </div>
            <div className="preview-section">
              <button type="button" disabled={!showDataSubmitted || !dateValid} onClick={handleTracksSubmit}>
                Submit Tracks Data
              </button>
            </div>
            <div className="preview-section">
              {showMutationResponse.called
                && <p>Show Successfully Submitted!</p>}
              {tracksMutationResponse.called
                && <p>Tracks Successfully Submitted!</p>}
              {tracksMutationResponse.error
                && <p>Error in Tracks Submission</p>}
            </div>
            <div className="preview-section">
              <button type="button" onClick={clearShowData}>
                Clear Show Data
              </button>
            </div>
          </div>
          <div className="show-preview-setlist">
            {Boolean(songs.length)
              && (
                <Showsongs
                  songsInput={songs}
                  addCheckedSong={addCheckedSong}
                />
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
