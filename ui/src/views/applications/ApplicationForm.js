import React from "react";

import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from '@material-ui/core/Typography';

import {Controlled as CodeMirror} from "react-codemirror2";
import "codemirror/mode/javascript/javascript";

import FormComponent from "../../classes/FormComponent";
import Form from "../../components/Form";
import AutocompleteSelect from "../../components/AutocompleteSelect";
import ServiceProfileStore from "../../stores/ServiceProfileStore";


const styles = {
  codeMirror: {
    zIndex: 1,
  },
  formLabel: {
    fontSize: 12,
  },
};


class ApplicationForm extends FormComponent {
  constructor() {
    super();
    this.getServiceProfileOption = this.getServiceProfileOption.bind(this);
    this.getServiceProfileOptions = this.getServiceProfileOptions.bind(this);
    this.getPayloadCodecOptions = this.getPayloadCodecOptions.bind(this);
    this.onCodeChange = this.onCodeChange.bind(this);
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

  getPayloadCodecOptions(search, callbackFunc) {
    const payloadCodecOptions = [
      {value: "", label: "无"},
      {value: "CAYENNE_LPP", label: "Cayenne LPP"},
      {value: "CUSTOM_JS", label: "自定义JavaScript编解码方法"},
    ];

    callbackFunc(payloadCodecOptions);
  }

  onCodeChange(field, editor, data, newCode) {
    let object = this.state.object;
    object[field] = newCode;
    this.setState({
      object: object,
    });
  }

  render() {
    if (this.state.object === undefined) {
      return(<div></div>);
    }

    const codeMirrorOptions = {
      lineNumbers: true,
      mode: "javascript",
      theme: "default",
    };
    
    let payloadEncoderScript = this.state.object.payloadEncoderScript;
    let payloadDecoderScript = this.state.object.payloadDecoderScript;

    if (payloadEncoderScript === "" || payloadEncoderScript === undefined) {
      payloadEncoderScript = `// Encode encodes the given object into an array of bytes.
//  - fPort contains the LoRaWAN fPort number
//  - obj is an object, e.g. {"temperature": 22.5}
// The function must return an array of bytes, e.g. [225, 230, 255, 0]
function Encode(fPort, obj) {
  return [];
}`;
    }

    if (payloadDecoderScript === "" || payloadDecoderScript === undefined) {
      payloadDecoderScript = `// Decode decodes an array of bytes into an object.
//  - fPort contains the LoRaWAN fPort number
//  - bytes is an array of bytes, e.g. [225, 230, 255, 0]
// The function must return an object, e.g. {"temperature": 22.5}
function Decode(fPort, bytes) {
  return {};
}`;
    }

    return(
      <Form
        submitLabel={this.props.submitLabel}
        onSubmit={this.onSubmit}
      >
        <TextField
          id="name"
          label="应用名称"
          margin="normal"
          value={this.state.object.name || ""}
          onChange={this.onChange}
          helperText="名称只能包含英文，数字和破折号。"
          fullWidth
          required
        />
        <TextField
          id="description"
          label="应用描述"
          margin="normal"
          value={this.state.object.description || ""}
          onChange={this.onChange}
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
          />
          <FormHelperText>
            应用程序的服务配置文件。请注意，创建应用程序后，您将无法更改它。
          </FormHelperText>
        </FormControl>}
        {this.state.object.payloadCodec !== "" && this.state.object.payloadCodec !== undefined && <div>
          <FormControl fullWidth margin="normal">
            <FormLabel className={this.props.classes.formLabel}>编解码器</FormLabel>
            <AutocompleteSelect
              id="payloadCodec"
              label="选择一个编解码器"
              value={this.state.object.payloadCodec || ""}
              onChange={this.onChange}
              getOptions={this.getPayloadCodecOptions}
            />
            <FormHelperText>
              通过定义编解码器，应用服务器可以为您编码和解码二进制设备有效负载。
              <strong>重要提示</strong>: 这个配置已移至设备配置文件。为了兼容，现有的编解码器设置仍然可见。
              设备配置文件上的编解码器设置优先于应用程序编解码器设置。
            </FormHelperText>
          </FormControl>
          {this.state.object.payloadCodec === "CUSTOM_JS" && <FormControl fullWidth margin="normal">
            <CodeMirror
              value={payloadDecoderScript}
              options={codeMirrorOptions}
              onBeforeChange={this.onCodeChange.bind(this, 'payloadDecoderScript')}
              className={this.props.classes.codeMirror}
            />
            <FormHelperText>
              这个方法必须具有签名 <strong>function Decode(fPort, bytes)</strong> 并且必须返回一个object对象。
              应用服务器将把它转换为json数据。
            </FormHelperText>
          </FormControl>}
          {this.state.object.payloadCodec === "CUSTOM_JS" && <FormControl fullWidth margin="normal">
            <CodeMirror
              value={payloadEncoderScript}
              options={codeMirrorOptions}
              onBeforeChange={this.onCodeChange.bind(this, 'payloadEncoderScript')}
              className={this.props.classes.codeMirror}
            />
            <FormHelperText>
              这个方法必须具有签名<strong>function Encode(fPort, obj)</strong> 并且必须返回一个Byte数组
            </FormHelperText>
          </FormControl>}
        </div>}
        {this.state.object.payloadCodec === "" && <FormControl fullWidth margin="normal">
          <Typography variant="body1">
            注意: 编解码器配置已经移动到设备配置文件.
          </Typography>
        </FormControl>}
      </Form>
    );
  }
}

export default withStyles(styles)(ApplicationForm);
