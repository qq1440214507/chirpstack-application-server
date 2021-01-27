import React, { Component } from "react";

import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Plus from "mdi-material-ui/Plus";
import HelpCircleOutline from "mdi-material-ui/HelpCircleOutline";

import TitleBar from "../../components/TitleBar";
import TitleBarTitle from "../../components/TitleBarTitle";
import TableCellLink from "../../components/TableCellLink";
import TitleBarButton from "../../components/TitleBarButton";
import DataTable from "../../components/DataTable";

import GatewayProfileStore from "../../stores/GatewayProfileStore";


class ListGatewayProfiles extends Component {
  constructor() {
    super();

    this.state = {
      dialogOpen: false,
    };
  }

  getPage(limit, offset, callbackFunc) {
    GatewayProfileStore.list(0, limit, offset, callbackFunc);
  }

  getRow(obj) {
    return(
      <TableRow
        id={obj.id}
        hover
      >
        <TableCellLink to={`/gateway-profiles/${obj.id}`}>{obj.name}</TableCellLink>
        <TableCellLink to={`/network-servers/${obj.networkServerID}`}>{obj.networkServerName}</TableCellLink>
      </TableRow>
    );
  }

  toggleHelpDialog = () => {
    this.setState({
      dialogOpen: !this.state.dialogOpen,
    });
  }

  render() {
    return(
      <Grid container spacing={4}>
        <Dialog
          open={this.state.dialogOpen}
          onClose={this.toggleHelpDialog}
          aria-labelledby="help-dialog-title"
          aria-describedby="help-dialog-description"
        >
          <DialogTitle id="help-dialog-title">网关配置文件说明</DialogTitle>
          <DialogContent>
            <DialogContentText id="help-dialog-description">
              网关配置文件的唯一作用就是使用它配置的属性来重新配置一个或者多个网关.<br /><br />
              如果网络服务器检测到网关的配置与其网关配置文件不同步时，它将向网关推送配置命令让网关更新配置。<br /><br />
              请注意，此功能是可选的，仅与ChirpStack Concentratord组件结合使用。<br /><br />
              另外，网关配置文件不会修改设备的行为方式。若要修改设备信道，请更新网络服务器配置。
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.toggleHelpDialog} color="primary">关闭</Button>
          </DialogActions>
        </Dialog>

        <TitleBar
          buttons={[
            <TitleBarButton
              key={1}
              label="创建"
              icon={<Plus />}
              to={`/gateway-profiles/create`}
            />,
            <TitleBarButton
              key={2}
              label="帮助"
              icon={<HelpCircleOutline />}
              onClick={this.toggleHelpDialog}
            />
          ]}
        >
          <TitleBarTitle title="网关配置文件" />
        </TitleBar>
        <Grid item xs={12}>
          <DataTable
            header={
              <TableRow>
                <TableCell>名称</TableCell>
                <TableCell>网络服务器</TableCell>
              </TableRow>
            }
            getPage={this.getPage}
            getRow={this.getRow}
          />
        </Grid>
      </Grid>
    );
  }
}

export default ListGatewayProfiles;
