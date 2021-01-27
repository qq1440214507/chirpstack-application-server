import React from "react";

import TextField from '@material-ui/core/TextField';
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";

import FormComponent from "../../classes/FormComponent";
import Form from "../../components/Form";
import AutocompleteSelect from "../../components/AutocompleteSelect";
import NetworkServerStore from "../../stores/NetworkServerStore";


class ServiceProfileForm extends FormComponent {
  constructor() {
    super();
    this.getNetworkServerOption = this.getNetworkServerOption.bind(this);
    this.getNetworkServerOptions = this.getNetworkServerOptions.bind(this);
  }

  getNetworkServerOption(id, callbackFunc) {
    NetworkServerStore.get(id, resp => {
      callbackFunc({label: resp.networkServer.name, value: resp.networkServer.id});
    });
  }

  getNetworkServerOptions(search, callbackFunc) {
    NetworkServerStore.list(0, 999, 0, resp => {
      const options = resp.result.map((ns, i) => {return {label: ns.name, value: ns.id}});
      callbackFunc(options);
    });
  }

  render() {
    if (this.state.object === undefined) {
      return(<div></div>);
    }

    return(
      <Form
        submitLabel={this.props.submitLabel}
        onSubmit={this.onSubmit}
        disabled={this.props.disabled}
      >
        <TextField
          id="name"
          label="福配置文件名称"
          margin="normal"
          value={this.state.object.name || ""}
          onChange={this.onChange}
          helperText="服务配置文件的名称"
          disabled={this.props.disabled}
          required
          fullWidth
        />
        {!this.props.update && <FormControl fullWidth margin="normal">
          <FormLabel required>网络服务器</FormLabel>
          <AutocompleteSelect
            id="networkServerID"
            label="网络服务器"
            value={this.state.object.networkServerID || null}
            onChange={this.onChange}
            getOption={this.getNetworkServerOption}
            getOptions={this.getNetworkServerOptions}
          />
          <FormHelperText>
            网络服务器的配置文件。 创建服务配置文件后，无法更改此值。
          </FormHelperText>
        </FormControl>}
        <FormControl fullWidth margin="normal">
          <FormControlLabel
            label="添加网关元数据"
            control={
              <Checkbox
                id="addGWMetaData"
                checked={!!this.state.object.addGWMetaData}
                onChange={this.onChange}
                disabled={this.props.disabled}
                color="primary"
              />
            }
          />
          <FormHelperText>
            网关元数据（RSSI，SNR，GW geoloc等），将添加在发送到应用程序服务器的数据包中。
          </FormHelperText>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <FormControlLabel
            label="开启网络地理位置"
            control={
              <Checkbox
                id="nwkGeoLoc"
                checked={!!this.state.object.nwkGeoLoc}
                onChange={this.onChange}
                disabled={this.props.disabled}
                color="primary"
              />
            }
          />
          <FormHelperText>
            启用后，网络服务器将尝试在此服务配置文件下解析设备的位置。请注意，您需要具有支持精细时间戳功能的网关，并且需要配置网络服务器才能提供地理位置支持。
          </FormHelperText>
        </FormControl>
        <TextField
          id="devStatusReqFreq"
          label="设备状态请求频率"
          margin="normal"
          type="number"
          value={this.state.object.devStatusReqFreq || 0}
          onChange={this.onChange}
          helperText="发起终端设备状态请求的频率（请求/天）。设置为0禁用。"
          disabled={this.props.disabled}
          fullWidth
        />
        {this.state.object.devStatusReqFreq > 0 && <FormControl fullWidth margin="normal">
          <FormGroup>
            <FormControlLabel
              label="上报设备电量到应用序服务器"
              control={
                <Checkbox
                  id="reportDevStatusBattery"
                  checked={!!this.state.object.reportDevStatusBattery}
                  onChange={this.onChange}
                  disabled={this.props.disabled}
                  color="primary"
                />
              }
            />
            <FormControlLabel
              label="上报设备链路余量到应用服务器"
              control={
                <Checkbox
                  id="reportDevStatusMargin"
                  checked={!!this.state.object.reportDevStatusMargin}
                  onChange={this.onChange}
                  disabled={this.props.disabled}
                  color="primary"
                />
              }
            />
          </FormGroup>
        </FormControl>}
        <TextField
          id="drMin"
          label="最低允许的数据速率"
          margin="normal"
          type="number"
          value={this.state.object.drMin || 0}
          onChange={this.onChange}
          helperText="最小允许的数据速率。用于ADR。"
          disabled={this.props.disabled}
          fullWidth
          required
        />
        <TextField
          id="drMax"
          label="最高允许的数据速率"
          margin="normal"
          type="number"
          value={this.state.object.drMax || 0}
          onChange={this.onChange}
          helperText="最大允许的数据速率。用于ADR。"
          disabled={this.props.disabled}
          fullWidth
          required
        />
      </Form>
    );
  }
}

export default ServiceProfileForm;
