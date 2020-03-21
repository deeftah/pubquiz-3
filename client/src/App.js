import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Link as RouterLink,
  Route,
  Switch
} from "react-router-dom";
import io from "socket.io-client";
import ChatWrapper from "./ChatWrapper";
import Groups from "./Groups";
import Persons from "./Persons";
import Player from "./Player";
import { darkTheme } from "./Themes";
import { withStyles, MuiThemeProvider } from "@material-ui/core";
import LoginScreen from "./components/LoginScreen";

import { useStore } from "react-redux";
import { useDispatch } from "react-redux";
import { requestLoginUser } from "./redux/sessions";
import Pubs from "./Pubs";
import TeamChooser from "./TeamChooser";
import { Tabs, Tab, Grid, AppBar, Typography } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Button from "@material-ui/core/Button";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { connect } from "react-redux";

const socket = io({
  autoConnect: false
});

function LoginStub(props) {
  const [nickname, setNickname] = useState("");
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(requestLoginUser(nickname));
  };

  return (
    <div>
      Login [Im Moment: Einloggen mit Benutername. Gibt es den Benutzer noch
      nicht, wird ein neuer angelegt.]
      <br />
      <input
        onChange={e => setNickname(e.target.value)}
        value={nickname}
      ></input>
      <button onClick={handleLogin}>Go</button>
    </div>
  );
}

const styles = theme => ({
  main: {
    background: theme.palette.background.default,
    height: "100vh",
    "& > :last-child": {
      flexGrow: 1,
    },
  },
});

class App extends React.Component {
  componentDidMount() {
    socket.open();
  }

  render() {
    const profileElement = nickname => (
      <Button
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        color="inherit"
        startIcon={<AccountCircle />}
      >
        {nickname}
      </Button>
    );

    const { classes } = this.props;
    return (
      <Router>
        <CssBaseline />
        <Grid container direction="column" className={classes.main}>
          <Grid item>
            <AppBar position="static">
              <Tabs component="nav" value={false}>
                <Tab component={RouterLink} to="/pubs" label="Pubs"></Tab>
                <Tab component={RouterLink} to="/groups" label="Gruppen"></Tab>
                <Tab component={RouterLink} to="/people" label="Personen"></Tab>
                <Tab component={RouterLink} to="/player" label="Player"></Tab>
                <Tab
                  component={RouterLink}
                  to="/aktuellesQuiz"
                  label="Aktuelles Quiz"
                ></Tab>
                {this.props.loggedInUser === undefined ? (
                  <Tab component={RouterLink} to="/login" label="Login"></Tab>
                ) : (
                  profileElement(this.props.loggedInUser.nickname)
                )}
              </Tabs>
            </AppBar>
          </Grid>
          <Grid item container justify="space-evenly" alignItems="stretch">
            <Grid item>
              <ChatWrapper socket={socket} />
            </Grid>
            <Grid item>
              <Switch>
                <Route path="/login">
                  <LoginScreen></LoginScreen>
                </Route>
                <Route path="/pubs">
                  <Pubs></Pubs>
                </Route>
                <Route path="/groups">
                  <Groups></Groups>
                </Route>
                <Route path="/people">
                  <Persons></Persons>
                </Route>
                <Route path="/player">
                  <Player></Player>
                </Route>
                <Route path="/aktuellesQuiz">
                  <TeamChooser></TeamChooser>
                </Route>
              </Switch>
            </Grid>
          </Grid>
        </Grid>
      </Router>
    );
  }
}

const mapStateToProps = state => {
  return { loggedInUser: state.sessionReducer.user };
};
let AppContainer = connect(mapStateToProps, {})(App);

AppContainer = withStyles(styles)(AppContainer);

function ThemeWrapper() {
  return (
    <MuiThemeProvider theme={ darkTheme }>
      <AppContainer />
    </MuiThemeProvider>
  );
}

export default ThemeWrapper;
