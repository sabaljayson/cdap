/*
 * Copyright © 2015 Cask Data, Inc.
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

package co.cask.cdap.api.dataset.lib;

import org.apache.twill.filesystem.Location;

/**
 * Represents a partition of a partitioned file set.
 */
public interface Partition {

  /**
   * @return the location of the partition
   */
  Location getLocation();

  /**
   * @return the relative path of the partition within the file set
   */
  String getRelativePath();

  /**
   * @return the partition key
   */
  PartitionKey getPartitionKey();
}
