import React from "react";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from '@material-ui/core/TextField';
import FormHelperText from "@material-ui/core/FormHelperText";
import IconButton from '@material-ui/core/IconButton';
import Button from "@material-ui/core/Button";

import Delete from "mdi-material-ui/Delete";

import FormComponent from "../../../classes/FormComponent";
import Form from "../../../components/Form";
import AutocompleteSelect from "../../../components/AutocompleteSelect";
import theme from "../../../theme";


const styles = {
  delete: {
    marginTop: 3 * theme.spacing(1),
  },
  formLabel: {
    fontSize: 12,
  },
};


class HTTPIntegrationHeaderForm extends FormComponent {
  onChange(e) {
    super.onChange(e);
    this.props.onChange(this.props.index, this.state.object);
  }

  onDelete = (e) => {
    e.preventDefault();
    this.props.onDelete(this.props.index);
  }

  render() {
    if (this.state.object === undefined) {
      return null;
    }

    return(
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <TextField
            id="key"
            label="请求头名称"
            margin="normal"
            value={this.state.object.key || ""}
            onChange={this.onChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={7}>
          <TextField
            id="value"
            label="请求头值"
            margin="normal"
            value={this.state.object.value || ""}
            onChange={this.onChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={1} className={this.props.classes.delete}>
          <IconButton aria-label="删除" onClick={this.onDelete}>
            <Delete />
          </IconButton>
        </Grid>
      </Grid>
    );    
  }
}


HTTPIntegrationHeaderForm = withStyles(styles)(HTTPIntegrationHeaderForm);


class HTTPIntegrationForm extends FormComponent {
  addHeader = (e) => {
    e.preventDefault();

    let object = this.state.object;
    if(object.headers === undefined) {
      object.headers = [{}];
    } else {
      object.headers.push({});
    }

    this.setState({
      object: object,
    });
  }

  onDeleteHeader = (index) => {
    let object = this.state.object;
    object.headers.splice(index, 1);

    this.setState({
      object: object,
    });
  }

  onChangeHeader = (index, header) => {
    let object = this.state.object;
    object.headers[index] = header;
    this.setState({
      object: object,
    });
  }

  getMarshalerOptions = (search, callbackFunc) => {
    const marshalerOptions = [
      {value: "JSON", label: "JSON"},
      {value: "PROTOBUF", label: "Protocol Buffers"},
      {value: "JSON_V3", label: "JSON (将被弃用)"},
    ];

    callbackFunc(marshalerOptions);
  }

  render() {
    if (this.state.object === undefined) {
      return null;
    }

    let headers = [];
    if (this.state.object.headers !== undefined) {
      headers = this.state.object.headers.map((h, i) => <HTTPIntegrationHeaderForm key={i} index={i} object={h} onChange={this.onChangeHeader} onDelete={this.onDeleteHeader} />);
    }

    return(
      <Form submitLabel={this.props.submitLabel} onSubmit={this.onSubmit}>
        <FormControl fullWidth margin="normal">
          <FormLabel required>有效负载封装</FormLabel>
          <AutocompleteSelect
            id="marshaler"
            label="选择有效负载封装"
            value={this.state.object.marshaler || ""}
            onChange={this.onChange}
            getOptions={this.getMarshalerOptions}
          />
          <FormHelperText>这定义了如何编码的有效负载。</FormHelperText>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <FormLabel>请求头</FormLabel>
          {headers}
        </FormControl>
        <Button variant="outlined" onClick={this.addHeader}>添加请求头</Button>
        <FormControl fullWidth margin="normal">
          <FormLabel>端点</FormLabel>
          <TextField
            id="eventEndpointURL"
            label="端点的URL(s)事件"
            placeholder="http://example.com/events"
            helperText="程序将使用“事件”作为参数对此URL发出POST请求。可以将多个URL定义为以逗号分隔的列表。空格将被自动删除。"
            value={this.state.object.eventEndpointURL || ""}
            onChange={this.onChange}
            margin="normal"
            fullWidth
          />
          {!!this.state.object.uplinkDataURL && <TextField
            id="uplinkDataURL"
            label="上行链路URL(s)"
            placeholder="http://example.com/uplink"
            helperText="多个URL以逗号隔开。空格将被自动删除。"
            value={this.state.object.uplinkDataURL || ""}
            onChange={this.onChange}
            margin="normal"
            fullWidth
          />}
          {!!this.state.object.joinNotificationURL && <TextField
            id="joinNotificationURL"
            label="入网通知URL(s)"
            placeholder="http://example.com/join"
            helperText="多个URL以逗号隔开。空格将被自动删除。"
            value={this.state.object.joinNotificationURL || ""}
            onChange={this.onChange}
            margin="normal"
            fullWidth
          />}
          {!!this.state.object.statusNotificationURL && <TextField
            id="statusNotificationURL"
            label="设备状态通知URL(s)"
            placeholder="http://example.com/status"
            helperText="多个URL以逗号隔开。空格将被自动删除。"
            value={this.state.object.statusNotificationURL || ""}
            onChange={this.onChange}
            margin="normal"
            fullWidth
          />}
          {!!this.state.object.locationNotificationURL && <TextField
            id="locationNotificationURL"
            label="地理位置通知URL(s)"
            placeholder="http://example.com/location"
            helperText="多个URL以逗号隔开。空格将被自动删除。"
            value={this.state.object.locationNotificationURL || ""}
            onChange={this.onChange}
            margin="normal"
            fullWidth
          />}
          {!!this.state.object.ackNotificationURL && <TextField
            id="ackNotificationURL"
            label="ACK通知URL(s)"
            placeholder="http://example.com/ack"
            helperText="多个URL以逗号隔开。空格将被自动删除。"
            value={this.state.object.ackNotificationURL || ""}
            onChange={this.onChange}
            margin="normal"
            fullWidth
          />}
          {!!this.state.object.txAckNotificationURL && <TextField
            id="txAckNotificationURL"
            label="TX ACK通知URL(s)"
            placeholder="http://example.com/txack"
            helperText="当LoRa网关确认下行链路进行传输时，将发送此通知。多个URL以逗号隔开。空格将被自动删除。"
            value={this.state.object.txAckNotificationURL || ""}
            onChange={this.onChange}
            margin="normal"
            fullWidth
          />}
          {!!this.state.object.integrationNotificationURL && <TextField
            id="integrationNotificationURL"
            label="集成通知URL(s)"
            placeholder="http://example.com/integration"
            helperText="该通知可以由已配置的集成发送，以发送自定义有效负载。多个URL以逗号隔开。空格将被自动删除。"
            value={this.state.object.integrationNotificationURL || ""}
            onChange={this.onChange}
            margin="normal"
            fullWidth
          />}
          {!!this.state.object.errorNotificationURL && <TextField
            id="errorNotificationURL"
            label="错误通知URL(s)"
            placeholder="http://example.com/error"
            helperText="多个URL以逗号隔开。空格将被自动删除。"
            value={this.state.object.errorNotificationURL || ""}
            onChange={this.onChange}
            margin="normal"
            fullWidth
          />}
        </FormControl>
      </Form>
    );
  }
}


export default HTTPIntegrationForm;
