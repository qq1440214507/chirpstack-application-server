import React from "react";

import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormHelperText from "@material-ui/core/FormHelperText";

import FormComponent from "../../classes/FormComponent";
import AESKeyField from "../../components/AESKeyField";
import DevAddrField from "../../components/DevAddrField";
import Form from "../../components/Form";
import AutocompleteSelect from "../../components/AutocompleteSelect";
import ServiceProfileStore from "../../stores/ServiceProfileStore";
import theme from "../../theme";


const styles = {
  formLabel: {
    fontSize: 12,
  },
  link: {
    color: theme.palette.primary.main,
  },
};


class MulticastGroupForm extends FormComponent {
  constructor() {
    super();
    this.getServiceProfileOption = this.getServiceProfileOption.bind(this);
    this.getServiceProfileOptions = this.getServiceProfileOptions.bind(this);
  }

  getServiceProfileOption(id, callbackFunc) {
    ServiceProfileStore.get(id, resp => {
      callbackFunc({label: resp.serviceProfile.name, value: resp.serviceProfile.id});
    });
  }

  getServiceProfileOptions(search, callbackFunc) {
    ServiceProfileStore.list(this.props.match.params.organizationID, 999, 0, resp => {
      const options = resp.result.map((sp, i) => {return {label: sp.name, value: sp.id}});
      callbackFunc(options);
    });
  }

  getRandomKey(len) {
    let cryptoObj = window.crypto || window.msCrypto;
    let b = new Uint8Array(len);
    cryptoObj.getRandomValues(b);

    return Buffer.from(b).toString('hex');
  }

  getRandomMcAddr = (cb) => {
    cb(this.getRandomKey(4));
  }

  getRandomSessionKey = (cb) => {
    cb(this.getRandomKey(16));
  }


  getGroupTypeOptions(search, callbackFunc) {
    const options = [
      {value: "CLASS_B", label: "B类"},
      {value: "CLASS_C", label: "C类"},
    ];

    callbackFunc(options);
  }

  getPingSlotPeriodOptions(search, callbackFunc) {
    const pingSlotPeriodOptions = [
      {value: 32 * 1, label: "每秒"},
      {value: 32 * 2, label: "每2秒"},
      {value: 32 * 4, label: "每4秒"},
      {value: 32 * 8, label: "每8秒"},
      {value: 32 * 16, label: "每16秒"},
      {value: 32 * 32, label: "每32秒"},
      {value: 32 * 64, label: "每64秒"},
      {value: 32 * 128, label: "每128秒"},
    ];

    callbackFunc(pingSlotPeriodOptions);
  }

  render() {
    if (this.state.object === undefined) {
      return null;
    }

    return(
      <Form
        submitLabel={this.props.submitLabel}
        onSubmit={this.onSubmit}
      >
        <TextField
          id="name"
          label="组播组名称"
          margin="normal"
          value={this.state.object.name || ""}
          onChange={this.onChange}
          helperText="组播组的名称"
          fullWidth
          required
        />
        {!this.props.update && <FormControl fullWidth margin="normal">
          <FormLabel className={this.props.classes.formLabel} required>服务配置文件</FormLabel>
          <AutocompleteSelect
            id="serviceProfileID"
            label="选择服务配置文件"
            value={this.state.object.serviceProfileID || ""}
            onChange={this.onChange}
            getOption={this.getServiceProfileOption}
            getOptions={this.getServiceProfileOptions}
            margin="none"
            required
          />
          <FormHelperText>
            该组播组将添加到的服务配置文件。请注意，创建组播组后就无法更改此值。
          </FormHelperText>
        </FormControl>}
        <DevAddrField
          id="mcAddr"
          label="组播地址"
          margin="normal"
          value={this.state.object.mcAddr || ""}
          onChange={this.onChange}
          disabled={this.props.disabled}
          randomFunc={this.getRandomMcAddr}
          fullWidth
          required
          random
        />
        <AESKeyField
          id="mcNwkSKey"
          label="组播网络会话密钥"
          margin="normal"
          value={this.state.object.mcNwkSKey || ""}
          onChange={this.onChange}
          disabled={this.props.disabled}
          fullWidth
          required
          random
        />
        <AESKeyField
          id="mcAppSKey"
          label="组播应用会话密钥"
          margin="normal"
          value={this.state.object.mcAppSKey || ""}
          onChange={this.onChange}
          disabled={this.props.disabled}
          fullWidth
          required
          random
        />
        <TextField
          id="fCnt"
          label="帧计数器"
          margin="normal"
          type="number"
          value={this.state.object.fCnt || 0}
          onChange={this.onChange}
          required
          fullWidth
        />
        <TextField
          id="dr"
          label="数据速率"
          helperText="传输组播帧时使用的数据速率。具体有效值，请参阅LoRaWAN区域参数规范。"
          margin="normal"
          type="number"
          value={this.state.object.dr || 0}
          onChange={this.onChange}
          required
          fullWidth
        />
        <TextField
          id="frequency"
          label="频率 (Hz)"
          helperText="传输组播帧时使用的频率。具体有效值，请参阅LoRaWAN区域参数规范。"
          margin="normal"
          type="number"
          value={this.state.object.frequency || 0}
          onChange={this.onChange}
          required
          fullWidth
        />
        <FormControl fullWidth margin="normal">
          <FormLabel className={this.props.classes.formLabel} required>组播组类型</FormLabel>
          <AutocompleteSelect
            id="groupType"
            label="选择组播组类型"
            value={this.state.object.groupType || ""}
            onChange={this.onChange}
            getOptions={this.getGroupTypeOptions}
            required
          />
          <FormHelperText>
            组播组类型定义了网络服务器如何调度组播帧的方式。
          </FormHelperText>
        </FormControl>
        {this.state.object.groupType === "CLASS_B" && <FormControl fullWidth margin="normal">
          <FormLabel className={this.props.classes.formLabel} required>B类设备ping-slot时间周期</FormLabel>
          <AutocompleteSelect
            id="pingSlotPeriod"
            label="选择B类设备ping-slot时间周期"
            value={this.state.object.pingSlotPeriod || ""}
            onChange={this.onChange}
            getOptions={this.getPingSlotPeriodOptions}
            required
          />
          <FormHelperText>B类设备ping-slot时间周期。</FormHelperText>
        </FormControl>}
      </Form>
    );
  }
}

export default withStyles(styles)(MulticastGroupForm);
