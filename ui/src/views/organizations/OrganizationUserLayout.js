import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import Grid from '@material-ui/core/Grid';

import Delete from "mdi-material-ui/Delete";
import Account from "mdi-material-ui/Account";

import TitleBar from "../../components/TitleBar";
import TitleBarTitle from "../../components/TitleBarTitle";
import TitleBarButton from "../../components/TitleBarButton";
import SessionStore from "../../stores/SessionStore";
import OrganizationStore from "../../stores/OrganizationStore";
import UpdateOrganizationUser from "./UpdateOrganizationUser";


class OrganizationUserLayout extends Component {
  constructor() {
    super();
    this.state = {
      admin: false,
    };
    this.deleteOrganizationUser = this.deleteOrganizationUser.bind(this);
    this.setIsAdmin = this.setIsAdmin.bind(this);
  }

  componentDidMount() {
    OrganizationStore.getUser(this.props.match.params.organizationID, this.props.match.params.userID, resp => {
      this.setState({
        organizationUser: resp,
      });
    });

    SessionStore.on("change", this.setIsAdmin);
    this.setIsAdmin();
  }

  componendWillUnmount() {
    SessionStore.removeListener("on", this.setIsAdmin);
  }

  setIsAdmin() {
    this.setState({
      admin: SessionStore.isAdmin(),
    });
  }

  deleteOrganizationUser() {
    if (window.confirm("您确定要删除此组织用户（这不会删除用户本身）吗？")) {
      OrganizationStore.deleteUser(this.props.match.params.organizationID, this.props.match.params.userID, resp => {
        this.props.history.push(`/organizations/${this.props.match.params.organizationID}/users`);
      });
    }
  }

  render() {
    if (this.state.organizationUser === undefined) {
      return(<div></div>);
    }

    return(
      <Grid container spacing={4}>
        <TitleBar
          buttons={
            <div>
              {this.state.admin && <TitleBarButton
                label="转到用户"
                icon={<Account />}
                to={`/users/${this.state.organizationUser.organizationUser.userID}`}
              />}
              <TitleBarButton
                label="删除"
                icon={<Delete />}
                color="secondary"
                onClick={this.deleteOrganizationUser}
              />
            </div>
          }
        >
          <TitleBarTitle to={`/organizations/${this.props.match.params.organizationID}/users`} title="组织用户" />
          <TitleBarTitle title="/" />
          <TitleBarTitle title={this.state.organizationUser.organizationUser.email} />
        </TitleBar>

        <Grid item xs={12}>
          <UpdateOrganizationUser organizationUser={this.state.organizationUser.organizationUser} />
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(OrganizationUserLayout);
