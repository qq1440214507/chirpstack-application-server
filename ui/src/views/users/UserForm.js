import React from "react";

import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from '@material-ui/core/Checkbox';

import FormComponent from "../../classes/FormComponent";
import FormControl from "../../components/FormControl";
import Form from "../../components/Form";


class UserForm extends FormComponent {
  render() {
    if (this.state.object === undefined) {
      return(<div></div>);
    }

    return(
      <Form
        submitLabel={this.props.submitLabel}
        onSubmit={this.onSubmit}
      >
        <TextField
          id="email"
          label="邮箱地址"
          margin="normal"
          type="email"
          value={this.state.object.email || ""}
          onChange={this.onChange}
          required
          fullWidth
        />
        <TextField
          id="note"
          label="可选备注"
          helperText="可选备注，比如，手机号、地址等等"
          margin="normal"
          value={this.state.object.note || ""}
          onChange={this.onChange}
          rows={4}
          fullWidth
          multiline
        />
        {this.state.object.id === undefined && <TextField
          id="password"
          label="密码"
          type="password"
          margin="normal"
          value={this.state.object.password || ""}
          onChange={this.onChange}
          required
          fullWidth
        />}
        <FormControl label="权限">
          <FormGroup>
            <FormControlLabel
              label="激活"
              control={
                <Checkbox
                  id="isActive"
                  checked={!!this.state.object.isActive}
                  onChange={this.onChange}
                  color="primary"
                />
              }
            />
            <FormControlLabel
              label="全局管理员"
              control={
                <Checkbox
                  id="isAdmin"
                  checked={!!this.state.object.isAdmin}
                  onChange={this.onChange}
                  color="primary"
                />
              }
            />
          </FormGroup>
        </FormControl>
      </Form>
    );
  }
}

export default UserForm;
