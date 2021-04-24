import React from 'react';
import { gql, useQuery } from '@apollo/client';

const CHECK_DATE = gql`
  query CheckDate($date: String!) {
    show(date: $date) {
      id
    }
  }
`;

export default function Showdate(props) {
  const { loading, error, data } = useQuery(CHECK_DATE, {
    variables: { date: props.dateInput },
  });

  if (loading) return <p>Loading</p>;
  if (error) return <p>Error {error.message}</p>;

  if (data.show?.id) {
    const showAlreadyMessage = `Show on ${props.dateInput} already in database`;
    return <p>{showAlreadyMessage}</p>;
  }

  if (!data.show) {
    return <p><span className="input-label">date: </span>{props.dateInput}</p>;
  }
}
