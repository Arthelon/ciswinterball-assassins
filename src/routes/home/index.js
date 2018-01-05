import { h, Component } from "preact";
import { route } from "preact-router";
import { getUser } from "../../auth";
import firebase from "../../firebase";
import style from "./style";
import { Grid, Cell, Button, Icon } from "preact-fluid";

const provider = new firebase.auth.GoogleAuthProvider();

export default class Home extends Component {
  removeUserListener = null;

  state = {
    loading: true,
    gameState: 0
  };

  componentDidMount = async () => {
    try {
      this.userListener = firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          route("/game");
        }
      });
      const database = firebase.database();
      database.ref("gameState").on("value", snapshot => {
        this.setState({
          gameState: snapshot.val(),
          loading: false
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  componentWillUnmount() {
    firebase
      .database()
      .ref("gameState")
      .off();
  }

  handleClick = async () => {
    try {
      if (this.state.gameState === 1) {
        await firebase.auth().signInWithPopup(provider);
        route("/game");
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { gameState, loading } = this.state;
    // show message if game has started
    // disable button if game state is 2
    if (loading) {
      return <div class={style.loader} />;
    }
    return (
      <Grid columns={1}>
        <Cell center middle>
          {gameState > 0 && (
            <div>
              <Button
                onClick={this.handleClick}
                primary
                left={<Icon name="google-plus" size="xsmall" />}
              >
                Join
              </Button>
            </div>
          )}
          {gameState === 0 && <p class={style.title}>01 / 06 / 18</p>}
        </Cell>
      </Grid>
    );
  }
}
