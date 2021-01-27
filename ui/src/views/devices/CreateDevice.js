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

import ApplicationStore from "../../stores/ApplicationStore";
import DeviceProfileStore from "../../stores/DeviceProfileStore";
import DeviceStore from "../../stores/DeviceStore";
import DeviceForm from "./DeviceForm";


const styles = {
  card: {
    overflow: "visible",
  },
};


class CreateDevice extends Component {
  constructor() {
    super();
    this.state = {
      dpDialog: false,
    };
    this.state = {};
    this.onSubmit = this.onSubmit.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  componentDidMount() {
    ApplicationStore.get(this.props.match.params.applicationID, resp => {
      this.setState({
        application: resp,
      });
    });

    DeviceProfileStore.list(0, this.props.match.params.applicationID, 0, 0, resp => {
      if (resp.totalCount === "0") {
        this.setState({
          dpDialog: true,
        });
      }
    });
  }

  closeDialog() {
    this.setState({
      dpDialog: false,
    });
  }

  onSubmit(device) {
    let dev = device;
    dev.applicationID = this.props.match.params.applicationID;

    DeviceStore.create(dev, resp => {
      DeviceProfileStore.get(dev.deviceProfileID, resp => {
        if (resp.deviceProfile.supportsJoin) {
          this.props.history.push(`/organizations/${this.props.match.params.organizationID}/applications/${this.props.match.params.applicationID}/devices/${dev.devEUI}/keys`);
        } else {
          this.props.history.push(`/organizations/${this.props.match.params.organizationID}/applications/${this.props.match.params.applicationID}/devices/${dev.devEUI}/activation`);
        }
      });

    });
  }

  render() {
    if (this.state.application === undefined) {
      return(<div></div>);
    }

    return(
      <Grid container spacing={4}>
        <Dialog
          open={this.state.dpDialog}
          onClose={this.closeDialog}
        >
          <DialogTitle>添加设备配置文件?</DialogTitle>
          <DialogContent>
            <DialogContentText paragraph>
              当前组织还没有设备配置文件。
              设备配置文件定义设备的功能和引导参数。 您可以为不同类型的设备创建多个设备配置文件。
            </DialogContentText>
            <DialogContentText>
              你想创建一个设备配置文件吗?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" component={Link} to={`/organizations/${this.props.match.params.organizationID}/device-profiles/create`} onClick={this.closeDialog}>创建设备配置文件</Button>
            <Button color="primary" onClick={this.closeDialog}>取消</Button>
          </DialogActions>
        </Dialog>

        <TitleBar>
          <TitleBarTitle title="应用" to={`/organizations/${this.props.match.params.organizationID}/applications`} />
          <TitleBarTitle title="/" />
          <TitleBarTitle title={this.state.application.application.name} to={`/organizations/${this.props.match.params.organizationID}/applications/${this.props.match.params.applicationID}`} />
          <TitleBarTitle title="/" />
          <TitleBarTitle title="设备" to={`/organizations/${this.props.match.params.organizationID}/applications/${this.props.match.params.applicationID}`} />
          <TitleBarTitle title="/" />
          <TitleBarTitle title="创建" />
        </TitleBar>

        <Grid item xs={12}>
          <Card className={this.props.classes.card}>
            <CardContent>
              <DeviceForm
                submitLabel="创建设备"
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

export default withStyles(styles)(withRouter(CreateDevice));
