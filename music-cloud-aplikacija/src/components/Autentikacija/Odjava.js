import React from "react";
import { ApolloConsumer } from "react-apollo";
import { Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";

export default function Odjava() {
  const Pocetna = () => {
    return (
      <Link
        to="/"
        style={{
          textDecoration: "none",
          fontSize: 14,
          fontWeight: "bold",
          color: "black",
        }}
      >
        Odjava
      </Link>
    );
  };

  const odjavaKor = (client) => {
    localStorage.removeItem("authToken");
    client.writeData({ data: { isLoggedIn: false } });
    console.log("Korisnik je odjavljen", client);
    return <Pocetna />;
  };

  return (
    <ApolloConsumer>
      {(client) => (
        <Button onClick={() => odjavaKor(client)} style={{ fontSize: "small" }}>
          <Typography variant="body3" color="primary">
            <Pocetna />
          </Typography>
        </Button>
      )}
    </ApolloConsumer>
  );
}
