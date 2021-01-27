import React from "react";

import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import {Controlled as CodeMirror} from "react-codemirror2";
import "codemirror/mode/javascript/javascript";

import FormComponent from "../../classes/FormComponent";
import Form from "../../components/Form";
import KVForm from "../../components/KVForm";
import DurationField from "../../components/DurationField";
import AutocompleteSelect from "../../components/AutocompleteSelect";
import NetworkServerStore from "../../stores/NetworkServerStore";
import { FormLabel } from "../../../node_modules/@material-ui/core";


const styles = {
  formLabel: {
    fontSize: 12,
  },
  codeMirror: {
    zIndex: 1,
  },
};


class DeviceProfileForm extends FormComponent {
  constructor() {
    super();
    this.state = {
      tab: 0,
      tags: [],
    };

    this.onTabChange = this.onTabChange.bind(this);
    this.getNetworkServerOptions = this.getNetworkServerOptions.bind(this);
    this.getMACVersionOptions = this.getMACVersionOptions.bind(this);
    this.getRegParamsOptions = this.getRegParamsOptions.bind(this);
    this.getPingSlotPeriodOptions = this.getPingSlotPeriodOptions.bind(this);
    this.getPayloadCodecOptions = this.getPayloadCodecOptions.bind(this);
    this.onCodeChange = this.onCodeChange.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    this.setKVArray(this.props.object || {});
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(prevProps);

    if (prevProps.object !== this.props.object) {
      this.setKVArray(this.props.object || {});
    }
  }

  getNetworkServerOptions(search, callbackFunc) {
    NetworkServerStore.list(this.props.match.params.organizationID, 999, 0, resp => {
      const options = resp.result.map((ns, i) => {return {label: ns.name, value: ns.id}});
      callbackFunc(options);
    });
  }

  getMACVersionOptions(search, callbackFunc) {
    const macVersionOptions = [
      {value: "1.0.0", label: "1.0.0"},
      {value: "1.0.1", label: "1.0.1"},
      {value: "1.0.2", label: "1.0.2"},
      {value: "1.0.3", label: "1.0.3"},
      {value: "1.1.0", label: "1.1.0"},
    ];

    callbackFunc(macVersionOptions);
  }

  getRegParamsOptions(search, callbackFunc) {
    const regParamsOptions = [
      {value: "A", label: "A"},
      {value: "B", label: "B"},
    ];

    callbackFunc(regParamsOptions);
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

  getPayloadCodecOptions(search, callbackFunc) {
    const payloadCodecOptions = [
      {value: "", label: "None"},
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

  onTabChange(e, v) {
    this.setState({
      tab: v,
    });
  }

  onChange(e) {
    super.onChange(e);
    if (e.target.id === "factoryPresetFreqsStr") {
      let object = this.state.object;
      let freqsStr = e.target.value.split(",");
      object["factoryPresetFreqs"] = freqsStr.map((f, i) => parseInt(f, 10));
      this.setState({
        object: object,
      });
    }
  }

  setKVArray = (props) => {
    let tags = [];

    if (props.tags !== undefined) {
      for (let key in props.tags) {
        tags.push({key: key, value: props.tags[key]});
      }
    }

    this.setState({
      tags: tags,
    });
  }

  render() {
    if (this.state.object === undefined) {
      return null;
    }

    let factoryPresetFreqsStr = "";
    if (this.state.object.factoryPresetFreqsStr !== undefined) {
      factoryPresetFreqsStr = this.state.object.factoryPresetFreqsStr;
    } else if (this.state.object.factoryPresetFreqs !== undefined) {
      factoryPresetFreqsStr = this.state.object.factoryPresetFreqs.join(", ");
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
//  - variables contains the device variables e.g. {"calibration": "3.5"} (both the key / value are of type string)
// The function must return an array of bytes, e.g. [225, 230, 255, 0]
function Encode(fPort, obj, variables) {
  return [];
}`;
    }

    if (payloadDecoderScript === "" || payloadDecoderScript === undefined) {
      payloadDecoderScript = `// Decode decodes an array of bytes into an object.
//  - fPort contains the LoRaWAN fPort number
//  - bytes is an array of bytes, e.g. [225, 230, 255, 0]
//  - variables contains the device variables e.g. {"calibration": "3.5"} (both the key / value are of type string)
// The function must return an object, e.g. {"temperature": 22.5}
function Decode(fPort, bytes, variables) {
  return {};
}`;
    }

    const tags = this.state.tags.map((obj, i) => <KVForm key={i} index={i} object={obj} onChange={this.onChangeKV("tags")} onDelete={this.onDeleteKV("tags")} />);


    return(
      <Form
        submitLabel={this.props.submitLabel}
        onSubmit={this.onSubmit}
        disabled={this.props.disabled}
      >
        <Tabs value={this.state.tab} onChange={this.onTabChange} indicatorColor="primary">
          <Tab label="基础" />
          <Tab label="加入(OTAA / ABP)" />
          <Tab label="B类设备" />
          <Tab label="C类设备" />
          <Tab label="编解码" />
          <Tab label="标签" />
        </Tabs>

        {this.state.tab === 0 && <div>
          <TextField
            id="name"
            label="设备配置文件名称"
            margin="normal"
            value={this.state.object.name || ""}
            onChange={this.onChange}
            helperText="设备配置文件的名称"
            required
            fullWidth
          />
          {!this.props.update && <FormControl fullWidth margin="normal">
            <FormLabel className={this.props.classes.formLabel} required>网络服务器</FormLabel>
            <AutocompleteSelect
              id="networkServerID"
              label="选择网络服务器"
              value={this.state.object.networkServerID || ""}
              onChange={this.onChange}
              getOptions={this.getNetworkServerOptions}
            />
            <FormHelperText>
              此设备配置文件的网络服务器。创建设备配置文件后，该值无法更改。
            </FormHelperText>
          </FormControl>}
          <FormControl fullWidth margin="normal">
            <FormLabel className={this.props.classes.formLabel} required>LoRaWAN MAC版本</FormLabel>
            <AutocompleteSelect
              id="macVersion"
              label="选择LoRaWAN MAC版本"
              value={this.state.object.macVersion || ""}
              onChange={this.onChange}
              getOptions={this.getMACVersionOptions}
            />
            <FormHelperText>
              设备支持的LoRaWAN MAC版本。
            </FormHelperText>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <FormLabel className={this.props.classes.formLabel} required>LoRaWAN区域参数修订</FormLabel>
            <AutocompleteSelect
              id="regParamsRevision"
              label="选择LoRaWAN区域参数修订"
              value={this.state.object.regParamsRevision || ""}
              onChange={this.onChange}
              getOptions={this.getRegParamsOptions}
            />
            <FormHelperText>
              修订设备支持的区域参数规范.
            </FormHelperText>
          </FormControl>
          <TextField
            id="maxEIRP"
            label="最大EIRP"
            type="number"
            margin="normal"
            value={this.state.object.maxEIRP || 0}
            onChange={this.onChange}
            helperText="设备支持的最大EIRP。"
            required
            fullWidth
          />
          <DurationField
            id="uplinkInterval"
            label="上行间隔（秒）"
            helperText="设备发送上行链路消息的预期间隔（以秒为单位）。 这用于确定设备是活跃的还是非活跃的。"
            value={this.state.object.uplinkInterval}
            onChange={this.onChange}
          />
        </div>}

        {this.state.tab === 1 && <div>
          <FormControl fullWidth margin="normal">
            <FormControlLabel
              label="设备支持OTAA"
              control={
                <Checkbox
                  id="supportsJoin"
                  checked={!!this.state.object.supportsJoin}
                  onChange={this.onChange}
                  color="primary"
                />
              }
            />
          </FormControl>
          {!this.state.object.supportsJoin && <TextField
            id="rxDelay1"
            label="RX1延迟"
            type="number"
            margin="normal"
            value={this.state.object.rxDelay1 || 0}
            onChange={this.onChange}
            helperText="RX1延迟(有效值为0 - 15)."
            required
            fullWidth
          />}
          {!this.state.object.supportsJoin && <TextField
            id="rxDROffset1"
            label="RX1数据速率偏移"
            type="number"
            margin="normal"
            value={this.state.object.rxDROffset1 || 0}
            onChange={this.onChange}
            helperText="请参阅LoRaWAN区域参数规范以获取有效值。"
            required
            fullWidth
          />}
          {!this.state.object.supportsJoin && <TextField
            id="rxDataRate2"
            label="RX2数据速率"
            type="number"
            margin="normal"
            value={this.state.object.rxDataRate2 || 0}
            onChange={this.onChange}
            helperText="请参阅LoRaWAN区域参数规范以获取有效值。"
            required
            fullWidth
          />}
          {!this.state.object.supportsJoin && <TextField
            id="rxFreq2"
            label="RX2信道频率（Hz）"
            type="number"
            margin="normal"
            value={this.state.object.rxFreq2 || 0}
            onChange={this.onChange}
            required
            fullWidth
          />}
          {!this.state.object.supportsJoin && <TextField
            id="factoryPresetFreqsStr"
            label="出厂预设频率（Hz）"
            margin="normal"
            value={factoryPresetFreqsStr}
            onChange={this.onChange}
            helperText="出厂预设频率（Hz）列表，以逗号分隔。"
            required
            fullWidth
          />}
        </div>}

        {this.state.tab === 2 && <div>
          <FormControl fullWidth margin="normal">
            <FormControlLabel
              label="设备支持B类"
              control={
                <Checkbox
                  id="supportsClassB"
                  checked={!!this.state.object.supportsClassB}
                  onChange={this.onChange}
                  color="primary"
                />
              }
            />
          </FormControl>

          {this.state.object.supportsClassB && <TextField
            id="classBTimeout"
            label="B类确认下行链路超时"
            type="number"
            margin="normal"
            value={this.state.object.classBTimeout || 0}
            onChange={this.onChange}
            helperText="确认的下行链路传输的B类超时（以秒为单位）。"
            required
            fullWidth
          />}
          {this.state.object.supportsClassB && <FormControl
              fullWidth
              margin="normal"
            >
              <FormLabel className={this.props.classes.formLabel} required>B类ping-slot周期</FormLabel>
              <AutocompleteSelect
                id="pingSlotPeriod"
                label="选择B类ping-slot周期"
                value={this.state.object.pingSlotPeriod || ""}
                onChange={this.onChange}
                getOptions={this.getPingSlotPeriodOptions}
              />
              <FormHelperText>B类ping-slot周期。</FormHelperText>
          </FormControl>}
          {this.state.object.supportsClassB && <TextField
            id="pingSlotDR"
            label="B类ping-slot周期数据速率"
            type="number"
            margin="normal"
            value={this.state.object.pingSlotDR || 0}
            onChange={this.onChange}
            required
            fullWidth
          />}
          {this.state.object.supportsClassB && <TextField
            id="pingSlotFreq"
            label="B类ping-slot频率(Hz)"
            type="number"
            margin="normal"
            value={this.state.object.pingSlotFreq || 0}
            onChange={this.onChange}
            required
            fullWidth
          />}
        </div>}

        {this.state.tab === 3 && <div>
          <FormControl fullWidth margin="normal">
            <FormControlLabel
              label="设备支持C类"
              control={
                <Checkbox
                  id="supportsClassC"
                  checked={!!this.state.object.supportsClassC}
                  onChange={this.onChange}
                  color="primary"
                />
              }
            />
            <FormHelperText>如果需要在设备激活后立即当做C类设备，请选择此选项。当它更改为C类设备时发送了DeviceModeInd mac-command，请不要选择此选项。</FormHelperText>
          </FormControl>

          <TextField
            id="classCTimeout"
            label="C类确认下行超时"
            type="number"
            margin="normal"
            value={this.state.object.classCTimeout || 0}
            onChange={this.onChange}
            helperText="C类确认下行链路传输超时（以秒为单位）。"
            required
            fullWidth
          />
        </div>}

        {this.state.tab === 4 && <div>
          <FormControl fullWidth margin="normal">
            <FormLabel className={this.props.classes.formLabel}>编解码器</FormLabel>
            <AutocompleteSelect
              id="payloadCodec"
              label="选择编解码器"
              value={this.state.object.payloadCodec || ""}
              onChange={this.onChange}
              getOptions={this.getPayloadCodecOptions}
            />
            <FormHelperText>
              通过定义有效负载编解码器，应用服务器可以为您编码和解码二进制设备有效负载。
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

        {this.state.tab === 5 && <div>
          <FormControl fullWidth margin="normal">
            <Typography variant="body1">
              标签可用于存储其他键/值数据。
            </Typography>
            {tags}
          </FormControl>
          <Button variant="outlined" onClick={this.addKV("tags")}>添加标签</Button>
        </div>}
      </Form>
    );
  }
}

export default withStyles(styles)(DeviceProfileForm);
