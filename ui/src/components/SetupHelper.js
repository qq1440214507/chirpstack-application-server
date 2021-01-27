import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "@material-ui/core/Button";

import SessionStore from "../stores/SessionStore";
import NetworkServerStore from "../stores/NetworkServerStore";
import ServiceProfileStore from "../stores/ServiceProfileStore";
import DeviceProfileStore from "../stores/DeviceProfileStore";


class SetupHelper extends Component {
  constructor() {
    super();
    this.state = {
      nsDialog: false,
      spDialog: false,
      dpDialog: false,
      organizationID: null,
    };

    this.test = this.test.bind(this);
    this.testNetworkServer = this.testNetworkServer.bind(this);
    this.testServiceProfile = this.testServiceProfile.bind(this);
    this.testDeviceProfile = this.testDeviceProfile.bind(this);
  }

  componentDidMount() {
    SessionStore.on("change", this.test);
    SessionStore.on("organization.change", this.test);

    this.test();
  }

  componentWillUnmount() {
    SessionStore.removeListener("change", this.test);
    SessionStore.removeListener("organization.change", this.test);
  }

  componentDidUpdate(prevProps) {
    if (prevProps === this.props) {
      return;
    }

    this.test();
  }

  test() {
    this.testNetworkServer();
    this.testServiceProfile(() => {
      this.testDeviceProfile(() => {});
    });
  }

  testServiceProfile(callbackFunc) {
    if (SessionStore.getOrganizationID === null) {
      callbackFunc();
      return;
    }

    if (!!localStorage.getItem("spDialogDismiss" + SessionStore.getOrganizationID())) {
      callbackFunc();
      return;
    }

    if (!SessionStore.isAdmin() && !SessionStore.isOrganizationAdmin(SessionStore.getOrganizationID())) {
      callbackFunc();
      return;
    }

    ServiceProfileStore.list(SessionStore.getOrganizationID(), 0, 0, resp => {
      if (resp.totalCount === "0" && !(this.state.nsDialog || this.state.dpDialog)) {
        this.setState({
          spDialog: true,
        });
      } else {
        callbackFunc();
      }
    });
  }

  testDeviceProfile(callbackFunc) {
    if (SessionStore.getOrganizationID === null) {
      callbackFunc();
      return;
    }

    if (!!localStorage.getItem("dpDialogDismiss" + SessionStore.getOrganizationID())) {
      callbackFunc();
      return;
    }

    if (!SessionStore.isAdmin() && !SessionStore.isOrganizationAdmin(SessionStore.getOrganizationID())) {
      callbackFunc();
      return;
    }

    DeviceProfileStore.list(SessionStore.getOrganizationID(), 0, 0, 0, resp => {
      if (resp.totalCount === "0" && !(this.state.nsDialog | this.state.dpDialog)) {
        this.setState({
          dpDialog: true,
        });
      } else {
        callbackFunc();
      }
    });
  }

  testNetworkServer() {
    if (!!localStorage.getItem("nsDialogDismiss") || !SessionStore.isAdmin()) {
      return;
    }

    NetworkServerStore.list(0, 0, 0, resp => {
      if (resp.totalCount === 0) {
        this.setState({
          nsDialog: true,
        });
      }
    });
  }

  toggleDialog(name) {
    let state = this.state;
    state[name] = !state[name];

    if (name === "nsDialog") {
      localStorage.setItem(name + "Dismiss", true);
    } else if (SessionStore.getOrganizationID() !== null) {
      localStorage.setItem(name + "Dismiss" + SessionStore.getOrganizationID(), true);
    }

    this.setState(state);
  }

  render() {
    const orgID = SessionStore.getOrganizationID();

    return(
      <div>
        <Dialog
          open={this.state.nsDialog}
          onClose={this.toggleDialog.bind(this, "nsDialog")}
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
            <Button color="primary" component={Link} to="/network-servers/create" onClick={this.toggleDialog.bind(this, "nsDialog")}>添加网络服务器</Button>
            <Button color="primary" onClick={this.toggleDialog.bind(this, "nsDialog")}>取消</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.spDialog}
          onClose={this.toggleDialog.bind(this, "spDialog")}
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
            <Button color="primary" component={Link} to={`/organizations/${orgID}/service-profiles/create`} onClick={this.toggleDialog.bind(this, "spDialog")}>创建服务配置文件</Button>
            <Button color="primary" onClick={this.toggleDialog.bind(this, "spDialog")}>取消</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.dpDialog}
          onClose={this.toggleDialog.bind(this, "dpDialog")}
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
            <Button color="primary" component={Link} to={`/organizations/${orgID}/device-profiles/create`} onClick={this.toggleDialog.bind(this, "dpDialog")}>创建设备配置文件</Button>
            <Button color="primary" onClick={this.toggleDialog.bind(this, "dpDialog")}>取消</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withRouter(SetupHelper);
