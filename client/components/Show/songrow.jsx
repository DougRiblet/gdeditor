import React from 'react';
import { gql, useQuery, useEffect } from '@apollo/client';

const CHECK_SONG_BY_TITLE = gql`
  query CheckSongByTitle($title: String!) {
    songByTitle(title: $title) {
      id
      title
    }
  }
`;

export default function Songrow(props) {
  const { data } = useQuery(CHECK_SONG_BY_TITLE, {
    variables: { title: props.songObj.title },
  });

  useEffect(() => {
    props.addCheckedSong({
      date: props.songObj.date,
      position: props.songObj.position,
      title: data.songByTitle.title,
      arrow: props.songObj.arrow,
    });
  }, [data?.songByTitle?.title]);

  if (data.songByTitle.title) {
    return (
      <tr>
        <td>{props.songObj.date}</td>
        <td>{props.songObj.position}</td>
        <td>{data.songByTitle.title}</td>
        <td>{props.songObj.arrow ? '>' : ''}</td>
      </tr>
    );
  }

  if (data && !data.songByTitle) {
    return (
      <tr>
        <td colSpan="4">
          <span style={{ color: 'red' }}>Song {props.songObj.title} not found in database!</span>
        </td>
      </tr>
    );
  }
}
