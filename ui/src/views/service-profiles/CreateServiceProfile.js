import React, { Component } from "react";
import { withRouter, Link } from 'react-router-dom';

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

import ServiceProfileForm from "./ServiceProfileForm";
import ServiceProfileStore from "../../stores/ServiceProfileStore";
import NetworkServerStore from "../../stores/NetworkServerStore";


class CreateServiceProfile extends Component {
  constructor() {
    super();
    this.state = {
      nsDialog: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  componentDidMount() {
    NetworkServerStore.list(0, 0, 0, resp => {
      if (resp.totalCount === "0") {
        this.setState({
          nsDialog: true,
        });
      }
    });
  }

  closeDialog() {
    this.setState({
      nsDialog: false,
    });
  }

  onSubmit(serviceProfile) {
    let sp = serviceProfile;
    sp.organizationID = this.props.match.params.organizationID;

    ServiceProfileStore.create(sp, resp => {
      this.props.history.push(`/organizations/${this.props.match.params.organizationID}/service-profiles`);
    });
  }

  render() {
    return(
      <Grid container spacing={4}>
        <Dialog
          open={this.state.nsDialog}
          onClose={this.closeDialog}
        >
          <DialogTitle>添加一个网络服务器?</DialogTitle>
          <DialogContent>
            <DialogContentText paragraph>
              应用程序服务器未连接到网络服务器网络服务器。
              应用服务器可以连接到多个网络服务器实例，例如:支持多个地区。
            </DialogContentText>
            <DialogContentText>
              您现在要连接到网络服务器吗?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" component={Link} to="/network-servers/create" onClick={this.closeDialog}>添加网络服务器</Button>
            <Button color="primary" onClick={this.closeDialog}>取消</Button>
          </DialogActions>
        </Dialog>

        <TitleBar>
          <TitleBarTitle title="服务配置文件" to={`/organizations/${this.props.match.params.organizationID}/service-profiles`} />
          <TitleBarTitle title="/" />
          <TitleBarTitle title="创建" />
        </TitleBar>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <ServiceProfileForm
                submitLabel="创建服务配置文件"
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

export default withRouter(CreateServiceProfile);
