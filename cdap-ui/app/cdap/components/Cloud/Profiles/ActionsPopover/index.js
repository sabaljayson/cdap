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
import Popover from 'components/Popover';
import {exportProfile} from 'components/Cloud/Profiles/Store/ActionCreator';
import T from 'i18n-react';

require('./ActionsPopover.scss');

export default function ProfileActionsPopover({target, namespace, profile, onDeleteClick, className}) {
  return (
    <Popover
      target={target}
      className={`profile-actions-popover ${className}`}
      placement="bottom"
      bubbleEvent={false}
      enableInteractionInPopover={true}
    >
      <ul>
        <li onClick={exportProfile.bind(this, namespace, profile)}>
          {T.translate('features.Cloud.Profiles.common.export')}
        </li>
        <hr />
        <li
          className="delete-action"
          onClick={onDeleteClick}
        >
          {T.translate('commons.delete')}
        </li>
      </ul>
    </Popover>
  );
}

ProfileActionsPopover.propTypes = {
  target: PropTypes.element,
  namespace: PropTypes.string,
  profile: PropTypes.string,
  onDeleteClick: PropTypes.func,
  className: PropTypes.string
};
