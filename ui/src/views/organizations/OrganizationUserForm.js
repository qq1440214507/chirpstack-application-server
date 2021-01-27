import React from "react";

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

import FormComponent from "../../classes/FormComponent";
import Form from "../../components/Form";


class OrganizationUserForm extends FormComponent {
    render() {
        if (this.state.object === undefined) {
            return (<div></div>);
        }

        return (
            <Form
                submitLabel={this.props.submitLabel}
                onSubmit={this.onSubmit}
            >
                <TextField
                    label="邮箱"
                    id="email"
                    margin="normal"
                    value={this.state.object.email || ""}
                    onChange={this.onChange}
                    required
                    fullWidth
                    disabled={this.props.update}
                />
                <Typography variant="body1">
                    没有其他权限的用户将能够查看此组织下的所有资源，并且能够发送和接收设备有效载荷。
                </Typography>
                <FormControl fullWidth margin="normal">
                    <FormControlLabel
                        label="组织管理员"
                        control={
                            <Checkbox
                                id="isAdmin"
                                checked={!!this.state.object.isAdmin}
                                onChange={this.onChange}
                                color="primary"
                            />
                        }
                    />
                    <FormHelperText>组织管理员用户能够添加和修改组织的资源部分。</FormHelperText>
                </FormControl>
                {!!!this.state.object.isAdmin && <FormControl fullWidth margin="normal">
                    <FormControlLabel
                        label="设备管理员"
                        control={
                            <Checkbox
                                id="isDeviceAdmin"
                                checked={!!this.state.object.isDeviceAdmin}
                                onChange={this.onChange}
                                color="primary"
                            />
                        }
                    />
                    <FormHelperText>设备管理员用户能够添加和修改设备的资源部分。</FormHelperText>
                </FormControl>}
                {!!!this.state.object.isAdmin && <FormControl fullWidth margin="normal">
                    <FormControlLabel
                        label="网关管理员"
                        control={
                            <Checkbox
                                id="isGatewayAdmin"
                                checked={!!this.state.object.isGatewayAdmin}
                                onChange={this.onChange}
                                color="primary"
                            />
                        }
                    />
                    <FormHelperText>网关管理员用户能够添加和修改网关的资源部分。</FormHelperText>
                </FormControl>}
            </Form>
        );
    }
}
export default OrganizationUserForm;
