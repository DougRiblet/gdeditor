import React from 'react';
import { gql, useQuery } from '@apollo/client';

const CHECK_VENUE = gql`
  query CheckVenue($site: String!, $city: String!) {
    venueBySiteCity(site: $site, city: $city) {
      id
    }
  }
`;

export default function Showvenue(props) {
  const { loading, error, data } = useQuery(CHECK_VENUE, {
    variables: { site: props.siteInput, city: props.cityInput },
    fetchPolicy: 'network-only',
  });

  if (loading) return <p>Loading</p>;
  if (error) return <p>Error</p>;

  if (data) {
    const venueAlreadyMessage = data.venueBySiteCity?.id
      ? <span style={{ color: 'green' }}>venue in database</span>
      : <span style={{ color: 'red' }}>new venue addition</span>;
    return (
      <p>
        <span className="input-label">site: </span>{props.siteInput}
        <br />
        <span className="input-label">city: </span>{props.cityInput}
        <br />
        {venueAlreadyMessage}
      </p>
    );
  }
}
