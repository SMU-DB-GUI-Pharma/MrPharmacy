import React from "react";
import { Link } from 'react-router-dom'

export class NavBar extends React.Component {

  state = {
    searchingString: ''
  }

  render() {

    let rest = <></>;

    if (this.props.state === "account") {
      rest = <>
        <button class="btn btn-secondary" type="button" onClick={() => this.props.obj.onSave()}>Save</button>
      </>;
    } else if (this.props.state === "landing") {
      rest = <>
        <Link type="button" className="btn btn-secondary" to='/signup'>Sign Up</Link>
      </>;
    } else if (this.props.state === "signup") {
      rest = <>
        <button type="button" className="btn btn-secondary" onClick={e => this.props.obj.onSignUp()}>Sign Up</button>
      </>;
    } else if (this.props.state === "dashboard") {
      rest =
        <>
          <form class="form-inline">
            <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" onChange={e => this.setState({ searchingString: e.target.value })} />
            <Link class="btn btn-secondary my-2 my-sm-0" type="button" to={"/" + this.props.username + "/" + this.state.searchingString}>Search</Link>
          </form>
          <Link class="btn btn-secondary my-2 my-sm-0" type="button" to={"/" + this.props.username + "/account"}>My Account</Link>
          <Link class="btn btn-secondary my-2 my-sm-0" type="button" to={"/" + this.props.username + "/prescription-creation"}>Add a Prescription</Link>
        </>
    }

    return <>
      <nav className="navbar navbar-light bg-primary">
        <a style={{ fontSize: 40, color: "White" }} className="navbar-brand" href="/">Mr.Pharmacy</a>
        {rest}
      </nav>
    </>
  }
}

