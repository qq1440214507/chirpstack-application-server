import React, { Component } from "react";
import { Link } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import ApplicationStore from "../../../stores/ApplicationStore";

const styles = {
  media: {
    paddingTop: '35%',
    backgroundSize: 'contain',
  },
};


class HTTPCard extends Component {
  delete = () => {
    if (window.confirm("您确定要删除HTTP集成?")) {
      ApplicationStore.deleteHTTPIntegration(this.props.applicationID, () => {});
    }
  }

  render() {
    return (
      <Card className={this.props.classes.root}>
        <CardMedia
          className={this.props.classes.media}
          image="/integrations/http.png"
          title="HTTP"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            HTTP
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
              HTTP集成将事件作为POST请求转发到用户配置的端点。
          </Typography>
        </CardContent>
        <CardActions>
          {!this.props.add && <Link to={`/organizations/${this.props.organizationID}/applications/${this.props.applicationID}/integrations/http/edit`}>
            <Button size="small" color="primary">
              Edit
            </Button>
          </Link>}
          {!this.props.add && <Button size="small" color="primary" onClick={this.delete}>
            Remove
          </Button>}
            {!!this.props.add && <Link to={`/organizations/${this.props.organizationID}/applications/${this.props.applicationID}/integrations/http/create`}>
              <Button size="small" color="primary">
                添加
              </Button>
            </Link>}
        </CardActions>
      </Card>
    );
  }
}


export default withStyles(styles)(HTTPCard);
