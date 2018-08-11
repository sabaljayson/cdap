/*
* Copyright © 2018 Cask Data, Inc.
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

import React from 'react';
import PropTypes from 'prop-types';
import T from 'i18n-react';
import PlatformsDetails from 'components/Administration/AdminManagementTabContent/PlatformsDetails';
import ServicesTable from 'components/Administration/AdminManagementTabContent/ServicesTable';
import Helmet from 'react-helmet';

const PREFIX = 'features.Administration';
const I18NPREFIX = `${PREFIX}.Management`;
require('./AdminManagementTabContent.scss');

export default function AdminManagementTabContent(props) {
  return (
    <div className="admin-management-tab-content">
    <Helmet title={T.translate(`${I18NPREFIX}.pageTitle`)} />
      <div className="services-details">
        <div className="services-table-section">
          <strong> {T.translate(`${PREFIX}.Services.title`)} </strong>
          <ServicesTable />
        </div>
        <div className="platform-section">
          <PlatformsDetails platformDetails={props.platformsDetails} />
        </div>
      </div>
    </div>
  );
}

AdminManagementTabContent.propTypes = {
  platformsDetails: PropTypes.object
};
