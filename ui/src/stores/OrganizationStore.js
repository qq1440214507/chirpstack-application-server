import { EventEmitter } from "events";

import Swagger from "swagger-client";

import sessionStore from "./SessionStore";
import {checkStatus, errorHandler } from "./helpers";
import dispatcher from "../dispatcher";


class OrganizationStore extends EventEmitter {
  constructor() {
    super();
    this.swagger = new Swagger("/swagger/organization.swagger.json", sessionStore.getClientOpts());
  }

  create(organization, callbackFunc) {
    this.swagger.then(client => {
      client.apis.OrganizationService.Create({
        body: {
          organization: organization,
        },
      })
      .then(checkStatus)
      .then(resp => {
        this.emit("create", organization);
        this.notify("创建");
        callbackFunc(resp.obj);
      })
      .catch(errorHandler);
    });
  }

  get(id, callbackFunc) {
    this.swagger.then(client => {
      client.apis.OrganizationService.Get({
        id: id,
      })
      .then(checkStatus)
      .then(resp => {
        callbackFunc(resp.obj);
      })
      .catch(errorHandler);
    });
  }

  update(organization, callbackFunc) {
    this.swagger.then(client => {
      client.apis.OrganizationService.Update({
        "organization.id": organization.id,
        body: {
          organization: organization,
        },
      })
      .then(checkStatus)
      .then(resp => {
        this.emit("change", organization);
        this.notify("更新");
        callbackFunc(resp.obj);
      })
      .catch(errorHandler);
    });
  }

  delete(id, callbackFunc) {
    this.swagger.then(client => {
      client.apis.OrganizationService.Delete({
        id: id,
      })
      .then(checkStatus)
      .then(resp => {
        this.emit("delete", id);
        this.notify("删除");
        callbackFunc(resp.obj);
      })
      .catch(errorHandler);
    });
  }

  list(search, limit, offset, callbackFunc) {
    this.swagger.then((client) => {
      client.apis.OrganizationService.List({
        search: search,
        limit: limit,
        offset: offset,
      })
      .then(checkStatus)
      .then(resp => {
        callbackFunc(resp.obj);
      })
      .catch(errorHandler);
    });
  }

  addUser(organizationID, user, callbackFunc) {
    this.swagger.then(client => {
      client.apis.OrganizationService.AddUser({
        "organization_user.organization_id": organizationID,
        body: {
          organizationUser: user,
        },
      })
      .then(checkStatus)
      .then(resp => {
        callbackFunc(resp.obj);
      })
      .catch(errorHandler);
    });
  }

  getUser(organizationID, userID, callbackFunc) {
    this.swagger.then(client => {
      client.apis.OrganizationService.GetUser({
        organization_id: organizationID,
        user_id: userID,
      })
      .then(checkStatus)
      .then(resp => {
        callbackFunc(resp.obj);
      })
      .catch(errorHandler);
    });
  }

  deleteUser(organizationID, userID, callbackFunc) {
    this.swagger.then(client => {
      client.apis.OrganizationService.DeleteUser({
        organization_id: organizationID,
        user_id: userID,
      })
      .then(checkStatus)
      .then(resp => {
        callbackFunc(resp.obj);
      })
      .catch(errorHandler);
    });
  }

  updateUser(organizationUser, callbackFunc) {
    this.swagger.then(client => {
      client.apis.OrganizationService.UpdateUser({
        "organization_user.organization_id": organizationUser.organizationID,
        "organization_user.user_id": organizationUser.userID,
        body: {
          organizationUser: organizationUser,
        },
      })
      .then(checkStatus)
      .then(resp => {
        callbackFunc(resp.obj);
      })
      .catch(errorHandler);
    });
  }

  listUsers(organizationID, limit, offset, callbackFunc) {
    this.swagger.then(client => {
      client.apis.OrganizationService.ListUsers({
        organization_id: organizationID,
        limit: limit,
        offset: offset,
      })
      .then(checkStatus)
      .then(resp => {
        callbackFunc(resp.obj);
      })
      .catch(errorHandler);
    });
  }

  notify(action) {
    dispatcher.dispatch({
      type: "CREATE_NOTIFICATION",
      notification: {
        type: "成功",
        message: "组织已" + action,
      },
    });
  }
}

const organizationStore = new OrganizationStore();
export default organizationStore;
