/*
 * Copyright © 2017 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import DataPrepBrowserStore from 'components/DataPrep/DataPrepBrowser/DataPrepBrowserStore';
import DataPrepApi from 'api/dataprep';
import isNil from 'lodash/isNil';
import NamespaceStore from 'services/NamespaceStore';
import T from 'i18n-react';
import LoadingSVGCentered from 'components/LoadingSVGCentered';
import {Input} from 'reactstrap';
import IconSVG from 'components/IconSVG';
import ee from 'event-emitter';
import {objectQuery} from 'services/helpers';
import {setDatabaseAsActiveBrowser} from 'components/DataPrep/DataPrepBrowser/DataPrepBrowserStore/ActionCreator';
import DataPrepBrowserPageTitle from 'components/DataPrep/DataPrepBrowser/PageTitle';

require('./DatabaseBrowser.scss');

const PREFIX = `features.DataPrep.DataPrepBrowser.DatabaseBrowser`;

export default class DatabaseBrowser extends Component {
  constructor(props) {
    super(props);
    let store = DataPrepBrowserStore.getState();
    this.state = {
      info: store.database.info,
      connectionId: store.database.connectionId,
      connectionName: '',
      tables: [],
      loading: true,
      search: '',
      searchFocus: true,
      error: null
    };

    this.eventEmitter = ee(ee);
    this.handleSearch = this.handleSearch.bind(this);
    this.prepTable = this.prepTable.bind(this);
    this.eventBasedFetchTable = this.eventBasedFetchTable.bind(this);

    this.eventEmitter.on('DATAPREP_CONNECTION_EDIT_DATABASE', this.eventBasedFetchTable);
  }

  componentDidMount() {
    this.storeSubscription = DataPrepBrowserStore.subscribe(() => {
      let {database, activeBrowser} = DataPrepBrowserStore.getState();
      if (activeBrowser.name !== 'database') {
        return;
      }

      this.setState({
        info: database.info,
        connectionId: database.connectionId,
        loading: database.loading,
        tables: database.tables,
        error: database.error
      });
    });
  }

  componentWillUnmount() {
    this.eventEmitter.off('DATAPREP_CONNECTION_EDIT_DATABASE', this.eventBasedFetchTable);

    if (this.storeSubscription) {
      this.storeSubscription();
    }
  }

  eventBasedFetchTable(connectionId) {
    if (this.state.connectionId === connectionId) {
      setDatabaseAsActiveBrowser({name: 'database', id: connectionId});
    }
  }

  handleSearch(e) {
    this.setState({
      search: e.target.value
    });
  }

  prepTable(tableId) {
    let namespace = NamespaceStore.getState().selectedNamespace;
    let params = {
      namespace,
      connectionId: this.state.connectionId,
      tableId,
      lines: 100
    };

    DataPrepApi.readTable(params)
      .subscribe(
        (res) => {
          let workspaceId = res.values[0].id;
          if (this.props.onWorkspaceCreate && typeof this.props.onWorkspaceCreate === 'function') {
            this.props.onWorkspaceCreate(workspaceId);
            return;
          }
          window.location.href = `${window.location.origin}/cdap/ns/${namespace}/dataprep/${workspaceId}`;
        },
        (err) => {
          console.log('ERROR: ', err);
        }
      );
  }

  renderEmpty() {
    if (this.state.search.length !== 0) {
      return (
        <div className="empty-search-container">
          <div className="empty-search">
            <strong>
              {T.translate(`${PREFIX}.EmptyMessage.title`, {searchText: this.state.search})}
            </strong>
            <hr />
            <span> {T.translate(`${PREFIX}.EmptyMessage.suggestionTitle`)} </span>
            <ul>
              <li>
                <span
                  className="link-text"
                  onClick={() => {
                    this.setState({
                      search: '',
                      searchFocus: true
                    });
                  }}
                >
                  {T.translate(`${PREFIX}.EmptyMessage.clearLabel`)}
                </span>
                <span> {T.translate(`${PREFIX}.EmptyMessage.suggestion1`)} </span>
              </li>
            </ul>
          </div>
        </div>
      );
    }

    return (
      <div className="empty-search-container">
        <div className="empty-search text-xs-center">
          <strong>
            {T.translate(`${PREFIX}.EmptyMessage.emptyDatabase`, {connectionName: this.state.connectionName})}
          </strong>
        </div>
      </div>
    );
  }

  render() {
    const renderNoPluginMessage = (error) => {
      let errorMessage = objectQuery(error, 'response', 'message') || objectQuery(error, 'response') || error;

      return (
        <div className="empty-search-container">
          <div className="empty-search">
            <strong>{errorMessage}</strong>
          </div>
        </div>
      );
    };
    const renderContents = (tables) => {
      if (this.state.error) {
        return renderNoPluginMessage(this.state.error);
      }
      if (!tables.length) {
        return this.renderEmpty();
      }
      return (
        <div className="database-content-table">
          <div className="database-content-header">
            <div className="row">
              <div className="col-xs-12">
                <span>{T.translate(`${PREFIX}.table.namecollabel`)}</span>
              </div>
            </div>
          </div>
          <div className="database-content-body">
            {
              tables.map(table => {
                return (
                  <div
                    className="row content-row"
                    onClick={this.prepTable.bind(this, table.name)}
                  >
                    <div className="col-xs-12">
                      <span>{table.name}</span>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      );
    };

    if (this.state.loading) {
      return (
        <LoadingSVGCentered />
      );
    }
    let filteredTables = this.state.tables;
    if (this.state.search) {
      filteredTables = this.state.tables.filter(table => table.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1);
    }

    return (
      <div className="database-browser">
        <DataPrepBrowserPageTitle
          browserI18NName="DatabaseBrowser"
          browserStateName="database"
        />
        <div className="top-panel">
          <div className="title">
            <h5>
              <span
                className="fa fa-fw"
                onClick={this.props.toggle}
              >
                <IconSVG name="icon-bars" />
              </span>

              <span>
                {T.translate(`${PREFIX}.title`)}
              </span>
            </h5>
          </div>
        </div>
        {
          isNil(this.state.error) ?
            <div>
              <div className="database-browser-header">
                <div className="database-metadata">
                  <h5>{objectQuery(this.state.info, 'info', 'name')}</h5>
                  <span className="tables-count">
                    {
                      T.translate(`${PREFIX}.tableCount`, {
                        context: this.state.tables.length
                      })
                    }
                  </span>
                </div>
                <div className="table-name-search">
                  <Input
                    placeholder={T.translate(`${PREFIX}.searchPlaceholder`)}
                    value={this.state.search}
                    onChange={this.handleSearch}
                    autoFocus={this.state.searchFocus}
                  />
                </div>
              </div>
            </div>
          :
            null
        }

        <div className="database-browser-content">
          { renderContents(filteredTables) }
        </div>
      </div>
    );
  }
}

DatabaseBrowser.propTypes = {
  toggle: PropTypes.func,
  onWorkspaceCreate: PropTypes.func
};
