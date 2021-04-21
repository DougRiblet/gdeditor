import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const CHECK_SONG = gql`
  query CheckSong($title: String!) {
    songByTitle(title: $title) {
      id
      title
    }
  }
`;

const ADD_SONG = gql`
  mutation AddSong($title: String!, $source: String!, $writer: String[]) {
    createSong(title: $title, source: $source, writer: $writer) {
      id
      title
    }
  }
`;

export default function Song() {
  const [tav, setTav] = useState('');
  const [nextsong, setNextsong] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const tavArr = tav.split(/\r?\n/).map((x) => x.trim());
    const [title, source, writer] = tavArr.shift().split(' | ');
    setNextsong({ title, source, writer });
    setTav(tavArr.join(/\n/));
  };

  const clearSongData = () => {
    setNextsong({});
  };

  return (
    <div id="addsong">
      <div className="input">
        <form onSubmit={handleSubmit}>
          <h3>Add Many Songs (plain text)</h3>
          <textarea
            value={tav}
            onChange={(e) => setTav(e.target.value)}
            cols={80}
            rows={20}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="preview">
        {nextsong.title
          && (
            <PreviewSong
              title={nextsong.title}
              source={nextsong.source}
              writer={nextsong.writer}
              clearSongData={clearSongData}
            />
          )}
      </div>
    </div>
  );
}

export function PreviewSong(props) {
  const { loading, error, data } = useQuery(CHECK_SONG, {
    variables: { title: props.title },
  });

  // eslint-disable-next-line no-unused-vars
  const [addSong, mutationResponse] = useMutation(ADD_SONG);

  const [ptitle, setPtitle] = useState(props.title);
  const [psource, setPsource] = useState(props.source);
  const [pwriter, setPwriter] = useState(props.writer);

  useEffect(() => {
    setPtitle(props.title);
    setPsource(props.source);
    setPwriter(props.writer);
  }, [props.title]);

  const onSourceChange = (e) => {
    setPsource(e.target.value);
  };

  const onTitleChange = (e) => {
    setPtitle(e.target.value);
  };

  const onWriterChange = (e) => {
    setPwriter(e.target.value);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    const writerArr = pwriter.split(', ');
    addSong({
      variables: {
        title: ptitle,
        source: psource,
        writer: writerArr,
      },
    });
  };

  if (loading) return <p>Loading</p>;
  if (error) return <p>Error</p>;

  if (data.songByTitle?.id) {
    return (
      <p>
        Song
        {props.title}
        already in database
      </p>
    );
  }

  if (!data.songByTitle) {
    return (
      <div>
        <form onSubmit={handleFinalSubmit}>
          <label htmlFor="title">
            Title:
            <input
              type="text"
              name="title"
              size="50"
              value={ptitle}
              onChange={onTitleChange}
            />
          </label>
          <p>Source:</p>
          <div className="radio">
            <label htmlFor="sourceO">
              <input
                id="sourceO"
                type="radio"
                value="ORIGINAL"
                checked={ptitle === 'ORIGINAL'}
                onChange={onSourceChange}
              />
            </label>
          </div>
          <div className="radio">
            <label htmlFor="sourceC">
              <input
                id="sourceC"
                type="radio"
                value="COVER"
                checked={ptitle === 'COVER'}
                onChange={onSourceChange}
              />
            </label>
          </div>
          <div className="radio">
            <label htmlFor="sourceT">
              <input
                id="sourceT"
                type="radio"
                value="TRADITIONAL"
                checked={ptitle === 'TRADITIONAL'}
                onChange={onSourceChange}
              />
            </label>
          </div>
          {pwriter
          && (
            <label htmlFor="writer">
              Writer:
              <input
                type="text"
                name="writer"
                size="50"
                value={pwriter}
                onChange={onWriterChange}
              />
            </label>
          )}
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}
