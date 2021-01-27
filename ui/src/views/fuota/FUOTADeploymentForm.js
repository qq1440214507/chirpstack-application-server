import React from "react";

import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";

import FormComponent from "../../classes/FormComponent";
import Form from "../../components/Form";
import DurationField from "../../components/DurationField";
import AutocompleteSelect from "../../components/AutocompleteSelect";

const styles = {
  formLabel: {
    fontSize: 12,
  },
};

class FUOTADeploymentForm extends FormComponent {
  constructor() {
    super();

    this.state.file = null;

    this.onFileChange = this.onFileChange.bind(this);
  }

  getGroupTypeOptions(search, callbackFunc) {
    const options = [
      {value: "CLASS_C", label: "C类"},
    ];

    callbackFunc(options);
  }

  getMulticastTimeoutOptions(search, callbackFunc) {
    let options = [];

    for (let i = 0; i < (1 << 4); i++) {
      options.push({
        label: `${1 << i}秒`,
        value: i,
      });
    }

    callbackFunc(options);
  }

  onFileChange(e) {
    let object = this.state.object;

    if (e.target.files.length !== 1) {
      object.payload = "";

      this.setState({
        file: null,
        object: object,
      });
    } else {
      this.setState({
        file: e.target.files[0],
      });

      const reader = new FileReader();
      reader.onload = () => {
        const encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
        object.payload = encoded;

        this.setState({
          object: object,
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  render() {
    if (this.state.object === undefined) {
      return null;
    }

    let fileLabel = "";
    if (this.state.file !== null) {
      fileLabel = `${this.state.file.name} (${this.state.file.size}字节)`
    } else {
      fileLabel = "选择文件..."
    }

    return(
      <Form
        submitLabel={this.props.submitLabel}
        onSubmit={this.onSubmit}
      >
        <TextField
          id="name"
          label="固件更新任务名称"
          helperText="描述固件更新任务的名称。"
          margin="normal"
          value={this.state.object.name || ""}
          onChange={this.onChange}
          fullWidth
          required
        />

        <FormControl fullWidth margin="normal">
          <FormLabel className={this.props.classes.formLabel} required>选择固件文件</FormLabel>
          <Button component="label">
            {fileLabel}
            <input type="file" style={{display: "none"}} onChange={this.onFileChange} />
          </Button>
          <FormHelperText>
            该文件将分片发送到设备。请注意，此文件的格式取决于供应商。
          </FormHelperText>
        </FormControl>

        <TextField
          id="redundancy"
          label="冗余帧"
          helperText="这个数字表示将发送的额外冗余帧，以便设备可以从丢包中恢复。"
          margin="normal"
          type="number"
          value={this.state.object.redundancy || 0}
          onChange={this.onChange}
          required
          fullWidth
        />

        <DurationField
          id="unicastTimeout"
          label="单播超时时间(秒)"
          helperText="将此设置为设备发送上行链路消息的最小间隔。"
          value={this.state.object.unicastTimeout}
          onChange={this.onChange}
        />

        <TextField
          id="dr"
          label="消息速率"
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
          label="频率(Hz)"
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
          />
          <FormHelperText>
            组播组类型定义了网络服务器如何调度组播帧的方式。
          </FormHelperText>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <FormLabel className={this.props.classes.formLabel} required>组播超时</FormLabel>
          <AutocompleteSelect
            id="multicastTimeout"
            label="选择组播超时"
            value={this.state.object.multicastTimeout || ""}
            onChange={this.onChange}
            getOptions={this.getMulticastTimeoutOptions}
          />
        </FormControl>

      </Form>
    );
  }
}

export default withStyles(styles)(FUOTADeploymentForm);

