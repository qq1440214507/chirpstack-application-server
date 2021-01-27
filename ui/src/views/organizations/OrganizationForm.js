import React from "react";

import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from "@material-ui/core/FormGroup";
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

import Admin from "../../components/Admin";
import FormControl from "../../components/FormControl";
import FormComponent from "../../classes/FormComponent";
import Form from "../../components/Form";



class OrganizationForm extends FormComponent {
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
          label="组织名称"
          helperText="名称只能包含英文，数字和破折号。"
          margin="normal"
          value={this.state.object.name || ""}
          onChange={this.onChange}
          inputProps={{
            pattern: "[\\w-]+",
          }}
          disabled={this.props.disabled}
          required
          fullWidth
        />
        <TextField
          id="displayName"
          label="显示名称"
          margin="normal"
          value={this.state.object.displayName || ""}
          onChange={this.onChange}
          disabled={this.props.disabled}
          required
          fullWidth
        />
        <Admin>
          <FormControl
            label="网关"
          >
            <FormGroup>
              <FormControlLabel
                label="组织能否有网关"
                control={
                  <Checkbox
                    id="canHaveGateways"
                    checked={!!this.state.object.canHaveGateways}
                    onChange={this.onChange}
                    disabled={this.props.disabled}
                    value="true"
                    color="primary"
                  />
                }
              />
            </FormGroup>
            <FormHelperText>如果选中，则表示组织管理员可以将自己的网关添加到网络。 请注意，网关的使用不限于此组织。</FormHelperText>
            {!!this.state.object.canHaveGateways && <TextField
              id="maxGatewayCount"
              label="最大网关数量"
              helperText="可以添加到此组织的网关的最大数量（0 =无限）。"
              margin="normal"
              value={this.state.object.maxGatewayCount || 0}
              onChange={this.onChange}
              type="number"
              disabled={this.props.disabled}
              required
              fullWidth
            />}
          </FormControl>
          <FormControl
            label="设备"
          >
            <TextField
              id="maxDeviceCount"
              label="最大设备数"
              helperText="可以添加到此组织的设备的最大数量（0 =无限）。"
              margin="normal"
              value={this.state.object.maxDeviceCount || 0}
              onChange={this.onChange}
              type="number"
              disabled={this.props.disabled}
              required
              fullWidth
            />
          </FormControl>
        </Admin>
      </Form>
    );
  }
}

export default OrganizationForm;
