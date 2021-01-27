import React from "react";

import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from '@material-ui/core/TextField';
import FormHelperText from "@material-ui/core/FormHelperText";

import FormComponent from "../../../classes/FormComponent";
import Form from "../../../components/Form";
import AutocompleteSelect from "../../../components/AutocompleteSelect";


const styles = {
  formLabel: {
    fontSize: 12,
  },
};


class InfluxDBIntegrationForm extends FormComponent {
  getPrecisionOptions(search, callbackFunc) {
    const precisionOptions = [
      {value: "NS", label: "Nanosecond"},
      {value: "U", label: "Microsecond"},
      {value: "MS", label: "Millisecond"},
      {value: "S", label: "Second"},
      {value: "M", label: "Minute"},
      {value: "H", label: "Hour"},
    ];

    callbackFunc(precisionOptions);
  }

  render() {
    if (this.state.object === undefined) {
      return null;
    }

    return(
      <Form submitLabel={this.props.submitLabel} onSubmit={this.onSubmit}>
        <TextField
          id="endpoint"
          label="API端点(写入)"
          placeholder="http://localhost:8086/write"
          value={this.state.object.endpoint || ""}
          onChange={this.onChange}
          margin="normal"
          required
          fullWidth
        />
        <TextField
          id="username"
          label="用户名"
          value={this.state.object.username || ""}
          onChange={this.onChange}
          margin="normal"
          fullWidth
        />
        <TextField
          id="password"
          label="密码"
          value={this.state.object.password || ""}
          type="password"
          onChange={this.onChange}
          margin="normal"
          fullWidth
        />
        <TextField
          id="db"
          label="数据库名称"
          value={this.state.object.db || ""}
          onChange={this.onChange}
          margin="normal"
          fullWidth
          required
        />
        <TextField
          id="retentionPolicyName"
          label="保留策略名称"
          helperText="设置写入的目标保留策略。如果您未指定保留策略，则InfluxDB会写入DEFAULT保留策略。"
          value={this.state.object.retentionPolicyName || ""}
          onChange={this.onChange}
          margin="normal"
          fullWidth
        />
        <FormControl fullWidth margin="normal">
          <FormLabel className={this.props.classes.formLabel} required>时间戳精度</FormLabel>
          <AutocompleteSelect
            id="precision"
            label="选择时间戳精度"
            value={this.state.object.precision || ""}
            onChange={this.onChange}
            getOptions={this.getPrecisionOptions}
          />
          <FormHelperText>
              建议使用尽可能低的精度，因为这会有更好的压缩效果。
          </FormHelperText>
        </FormControl>
      </Form>
    );
  }
}

export default withStyles(styles)(InfluxDBIntegrationForm);
