import React, { Component } from "react";
import { Link } from "react-router-dom";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';

import moment from "moment";
import CloudUpload from "mdi-material-ui/CloudUpload";

import TableCellLink from "../../components/TableCellLink";
import DataTable from "../../components/DataTable";
import DeviceAdmin from "../../components/DeviceAdmin";
import FUOTADeploymentStore from "../../stores/FUOTADeploymentStore";
import theme from "../../theme";


const styles = {
  buttons: {
    textAlign: "right",
  },
  button: {
    marginLeft: 2 * theme.spacing(1),
  },
  icon: {
    marginRight: theme.spacing(1),
  },
};


class ListFUOTADeploymentsForDevice extends Component {
  constructor() {
    super();

    this.state = {
      detailDialog: false,
    };

    this.getPage = this.getPage.bind(this);
    this.getRow = this.getRow.bind(this);
    this.onCloseDialog = this.onCloseDialog.bind(this);
    this.showDetails = this.showDetails.bind(this);
  }

  getPage(limit, offset, callbackFunc) {
    FUOTADeploymentStore.list({
      devEUI: this.props.match.params.devEUI,
      limit: limit,
      offset: offset,
    }, callbackFunc);
  }

  getRow(obj) {
    const createdAt = moment(obj.createdAt).format('lll');
    const updatedAt = moment(obj.updatedAt).format('lll');

    return(
      <TableRow
        key={obj.id}
        hover
      >
        <TableCellLink to={`/organizations/${this.props.match.params.organizationID}/applications/${this.props.match.params.applicationID}/fuota-deployments/${obj.id}`}>{obj.name}</TableCellLink>
        <TableCell>{createdAt}</TableCell>
        <TableCell>{updatedAt}</TableCell>
        <TableCell>{obj.state}</TableCell>
        <TableCell><Button size="small" onClick={() => this.showDetails(obj.id)}>显示</Button></TableCell>
      </TableRow>
    );
  }

  showDetails(fuotaDeploymentID) {
    FUOTADeploymentStore.getDeploymentDevice(fuotaDeploymentID, this.props.match.params.devEUI, resp => {
      this.setState({
        deploymentDevice: resp.deploymentDevice,
        fuotaDeploymentID: fuotaDeploymentID,
        detailDialog: true,
      });
    });
  }

  onCloseDialog() {
    this.setState({
      detailDialog: false,
    });
  }

  render() {
    let fddUpdatedAt = "";
    if (this.state.deploymentDevice !== undefined) {
      fddUpdatedAt = moment(this.state.deploymentDevice.updatedAt).format('lll');
    }

    return(
      <Grid container spacing={4}>
        {this.state.deploymentDevice && <Dialog
          open={this.state.detailDialog}
          onClose={this.onCloseDialog}
        >
          <DialogTitle>设备工作状态</DialogTitle>
          <DialogContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>最后更新</TableCell>
                  <TableCell>{fddUpdatedAt}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>设备状态</TableCell>
                  <TableCell>{this.state.deploymentDevice.state}</TableCell>
                </TableRow>
                {this.state.deploymentDevice.state === "ERROR" && <TableRow>
                  <TableCell>错误信息</TableCell>
                  <TableCell>{this.state.deploymentDevice.errorMessage}</TableCell>
                </TableRow>}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.onCloseDialog}>取消</Button>
          </DialogActions>
        </Dialog>}

        <DeviceAdmin organizationID={this.props.match.params.organizationID}>
          <Grid item xs={12} className={this.props.classes.buttons}>
            <Button variant="outlined" className={this.props.classes.button} component={Link} to={`/organizations/${this.props.match.params.organizationID}/applications/${this.props.match.params.applicationID}/devices/${this.props.match.params.devEUI}/fuota-deployments/create`}>
              <CloudUpload className={this.props.classes.icon} />
              创建固件更新作业
            </Button>
          </Grid>
        </DeviceAdmin>

        <Grid item xs={12}>
          <DataTable
            header={
              <TableRow>
                <TableCell>作业名称</TableCell>
                <TableCell>创建</TableCell>
                <TableCell>更新</TableCell>
                <TableCell>作业状态</TableCell>
                <TableCell>设备状态</TableCell>
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

export default withStyles(styles)(ListFUOTADeploymentsForDevice);
