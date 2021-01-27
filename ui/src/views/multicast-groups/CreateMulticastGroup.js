import React, { Component } from "react";
import { withRouter, Link } from 'react-router-dom';

import { withStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from "@material-ui/core/CardContent";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "@material-ui/core/Button";

import TitleBar from "../../components/TitleBar";
import TitleBarTitle from "../../components/TitleBarTitle";

import MulticastGroupForm from "./MulticastGroupForm";
import ServiceProfileStore from "../../stores/ServiceProfileStore";
import MulticastGroupStore from "../../stores/MulticastGroupStore";


const styles = {
  card: {
    overflow: "visible",
  },
};


class CreateMulticastGroup extends Component {
  constructor() {
    super();
    this.state = {
      spDialog: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  componentDidMount() {
    ServiceProfileStore.list(this.props.match.params.organizationID, 0, 0, resp => {
      if (resp.totalCount === "0") {
        this.setState({
          spDialog: true,
        });
      }
    });
  }

  closeDialog() {
    this.setState({
      spDialog: false,
    });
  }

  onSubmit(multicastGroup) {
    MulticastGroupStore.create(multicastGroup, resp => {
      this.props.history.push(`/organizations/${this.props.match.params.organizationID}/multicast-groups`);
    });
  }

  render() {
    return(
      <Grid container spacing={4}>
        <Dialog
          open={this.state.spDialog}
          onClose={this.closeDialog}
        >
          <DialogTitle>添加一个服务配置文件?</DialogTitle>
          <DialogContent>
            <DialogContentText paragraph>
              当前组织还没有服务配置文件。
              服务配置文件将组织连接到网络服务器，并定义组织可以在该网络服务器上使用的功能。
            </DialogContentText>
            <DialogContentText>
              你想创建一个服务配置文件吗?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" component={Link} to={`/organizations/${this.props.match.params.organizationID}/service-profiles/create`} onClick={this.closeDialog}>创建服务配置文件</Button>
            <Button color="primary" onClick={this.closeDialog}>取消</Button>
          </DialogActions>
        </Dialog>

        <TitleBar>
          <TitleBarTitle title="组播组" to={`/organizations/${this.props.match.params.organizationID}/multicast-groups`} />
          <TitleBarTitle title="/" />
          <TitleBarTitle title="创建" />
        </TitleBar>

        <Grid item xs={12}>
          <Card className={this.props.classes.card}>
            <CardContent>
              <MulticastGroupForm
                submitLabel="创建组播组"
                onSubmit={this.onSubmit}
                match={this.props.match}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(withRouter(CreateMulticastGroup));
