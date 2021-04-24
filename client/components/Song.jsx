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
  mutation AddSong($title: String!, $source: Source!, $writer: [String]) {
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
    setTav(tavArr.join('\n'));
  };

  const clearSongData = () => {
    setNextsong({});
  };

  return (
    <div className="add-container">
      <div className="input-pane">
        <form onSubmit={handleSubmit}>
          <h3>Add Many Songs (plain text)</h3>
          <textarea
            value={tav}
            onChange={(e) => setTav(e.target.value)}
            cols={64}
            rows={20}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="preview-pane">
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
    const writerArr = pwriter ? pwriter.split(', ') : [];
    const variables = {
      title: ptitle,
      source: psource,
      writer: writerArr,
    };
    addSong({ variables });
  };

  if (loading) return <p>Loading</p>;
  if (error) return <p>Error {error.message}</p>;

  if (data.songByTitle?.id) {
    const songAlreadyMessage = `Song ${props.title} already in database`;
    return (
      <div>
        <p>{songAlreadyMessage}</p>
        <button type="button" onClick={props.clearSongData}>
          Clear Song Data
        </button>
      </div>
    );
  }

  if (!data.songByTitle) {
    return (
      <div>
        <form onSubmit={handleFinalSubmit}>
          <div className="title-container">
            <label htmlFor="title">
              <span className="input-label">Title:</span>
              <input
                type="text"
                name="title"
                size="50"
                value={ptitle}
                onChange={onTitleChange}
              />
            </label>
          </div>
          <div className="radio-container">
            <input
              id="sourceO"
              type="radio"
              value="ORIGINAL"
              checked={psource === 'ORIGINAL'}
              onChange={onSourceChange}
            />
            <label htmlFor="sourceO">ORIGINAL</label>
            <input
              id="sourceC"
              type="radio"
              value="COVER"
              checked={psource === 'COVER'}
              onChange={onSourceChange}
            />
            <label htmlFor="sourceC">COVER</label>
            <input
              id="sourceT"
              type="radio"
              value="TRADITIONAL"
              checked={psource === 'TRADITIONAL'}
              onChange={onSourceChange}
            />
            <label htmlFor="sourceT">TRADITIONAL</label>
          </div>
          {pwriter
          && (
            <div className="writer-container">
              <label htmlFor="writer">
                <span className="input-label">Writer:</span>
                <input
                  type="text"
                  name="writer"
                  size="50"
                  value={pwriter}
                  onChange={onWriterChange}
                />
              </label>
            </div>
          )}
          <button type="submit">Submit</button>
        </form>
        <div className="after-submit">
          {mutationResponse.called
            && <p>Successfully Submitted!</p>}
          {mutationResponse.error
            && <p>Error in Submission</p>}
          {!mutationResponse.called && !mutationResponse.error
            && <p />}
          <button type="button" onClick={props.clearSongData}>
            Clear Song Data
          </button>
        </div>
      </div>
    );
  }
}
