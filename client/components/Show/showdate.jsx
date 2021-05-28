import React from 'react';
import { gql, useQuery } from '@apollo/client';

const CHECK_DATE = gql`
  query CheckDate($date: String!) {
    show(date: $date) {
      id
    }
  }
`;

export default function Showdate({ dateInput, dateValid }) {
  const { loading, error, data } = useQuery(CHECK_DATE, {
    variables: { date: dateInput },
    fetchPolicy: 'network-only',
  });

  if (loading) return <p>Loading</p>;
  if (error) return <p>Error {error.message}</p>;

  if (data.show?.id) {
    const showAlreadyMessage = `Show on ${dateInput} already in database`;
    return <p>{showAlreadyMessage}</p>;
  }

  if (!data.show && dateValid) {
    return <p><span className="input-label">date: </span>{dateInput}</p>;
  }

  if (!data.show && !dateValid) {
    return (
      <p>
        <span className="input-label">date: </span>{dateInput}
        <br />
        <span style={{ color: 'red' }}>Invalid Date Format!</span>
      </p>
    );
  }
}
