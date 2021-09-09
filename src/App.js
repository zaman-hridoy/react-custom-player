import React from "react";
import { AppBar, Toolbar, Typography, Container } from "@material-ui/core";

// components
import MainPlayer from "./player/MainPlayer";

function App() {
  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">React Video Player</Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container maxWidth="md">
        <MainPlayer />
      </Container>
    </div>
  );
}

export default App;
