import React, { Component } from "react";
import { withRouter } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from "@material-ui/core/CardContent";

import FormComponent from "../../classes/FormComponent";
import Form from "../../components/Form";
import AESKeyField from "../../components/AESKeyField";
import DeviceStore from "../../stores/DeviceStore";


class LW11DeviceKeysForm extends FormComponent {
  render() {
    let object = {};
    if (this.props.object !== undefined) {
      object = this.props.object;
    }

    return(
      <Form
        submitLabel={this.props.submitLabel}
        onSubmit={this.onSubmit}
      >
        <AESKeyField
          id="nwkKey"
          label="网络秘钥(LoRaWAN 1.1)"
          helperText="用户LoRaWAN 1.1设备。如果您的设备不支持LoRaWAN 1.1，请首先更新设备配置文件。"
          onChange={this.onChange}
          value={object.nwkKey || ""}
          margin="normal"
          fullWidth
          required
          random
        />
        <AESKeyField
          id="appKey"
          label="应用秘钥(LoRaWAN 1.1)"
          helperText="用户LoRaWAN 1.1设备。如果您的设备不支持LoRaWAN 1.1，请首先更新设备配置文件。"
          onChange={this.onChange}
          value={object.appKey || ""}
          margin="normal"
          fullWidth
          required
          random
        />
      </Form>
    );
  }
}

class LW10DeviceKeysForm extends FormComponent {
  render() {
    let object = {};
    if (this.props.object !== undefined) {
      object = this.props.object;
    }

    return(
      <Form
        submitLabel={this.props.submitLabel}
        onSubmit={this.onSubmit}
      >
        <AESKeyField
          id="nwkKey"
          label="应用秘钥"
          helperText="对于LoRaWAN 1.0设备。 如果您的设备支持LoRaWAN 1.1，请首先更新设备配置文件。"
          onChange={this.onChange}
          value={object.nwkKey || ""}
          margin="normal"
          fullWidth
          required
          random
        />
        <AESKeyField
          id="genAppKey"
          label="生成应用秘钥"
          helperText="对于LoRaWAN 1.0设备。仅当设备实施远程组播设置规范/无线固件更新（FUOTA）时，才必须设置此密钥。 否则将此字段留空。"
          onChange={this.onChange}
          value={object.genAppKey || ""}
          margin="normal"
          fullWidth
          random
        />
      </Form>
    );
  }
}


class DeviceKeys extends Component {
  constructor() {
    super();
    this.state = {
      update: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    DeviceStore.getKeys(this.props.match.params.devEUI, resp => {
      if (resp === null) {
        this.setState({
          deviceKeys: {
            deviceKeys: {},
          },
        });
      } else {
        this.setState({
          update: true,
          deviceKeys: resp,
        });
      }
    });
  }

  onSubmit(deviceKeys) {
    if (this.state.update) {
      DeviceStore.updateKeys(deviceKeys, resp => {
        this.props.history.push(`/organizations/${this.props.match.params.organizationID}/applications/${this.props.match.params.applicationID}/devices/${this.props.match.params.devEUI}`);
      });
    } else {
      let keys = deviceKeys;
      keys.devEUI = this.props.match.params.devEUI;
      DeviceStore.createKeys(keys, resp => {
        this.props.history.push(`/organizations/${this.props.match.params.organizationID}/applications/${this.props.match.params.applicationID}/devices/${this.props.match.params.devEUI}`);
      });
    }
  }

  render() {
    if (this.state.deviceKeys === undefined) {
      return null;
    }

    return(
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              {this.props.deviceProfile.macVersion.startsWith("1.0") && <LW10DeviceKeysForm
                submitLabel="设置设备秘钥"
                onSubmit={this.onSubmit}
                object={this.state.deviceKeys.deviceKeys}
              />}
              {this.props.deviceProfile.macVersion.startsWith("1.1") && <LW11DeviceKeysForm
                submitLabel="设置设备秘钥"
                onSubmit={this.onSubmit}
                object={this.state.deviceKeys.deviceKeys}
              />}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(DeviceKeys);
