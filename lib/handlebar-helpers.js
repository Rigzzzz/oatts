// Copyright 2018 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

/**
 * @namespace templateHelpers
 */

module.exports = {
  notEmptyObject: notEmptyObject,
  json: json,
  isNotDefaultStatusCode: isNotDefaultStatusCode,
  hasBody: hasBody,
  handleQueryParams: handleQueryParams,
  handlePath: handlePath,
  isSuccess: isSuccess
}

/**
 * determines if the given object is empty or not
 * @function notEmptyObject
 * @memberof templateHelpers
 * @instance
 * @param {object} obj object to be evaluated
 * @return {boolean}
 */
function notEmptyObject(obj) {
  if (arguments.length < 1) {
    throw new Error('Handlebars Helper \'notEmptyObject\' needs 1 parameter');
  }

  return obj !== undefined && Object.keys(obj).length !== 0
}

/**
 * stringifies the given JSON object
 * @function json
 * @memberof templateHelpers
 * @instance
 * @param {object} obj JSON object to be stringified
 * @return {string}
 */
function json(obj) {
  if (arguments.length < 1) {
    throw new Error('Handlebars Helper \'json\' needs 1 parameter');
  }

  return JSON.stringify(obj)
}

/**
 * determines if the given status code is the 'default' status
 * @function isNotDefaultStatusCode
 * @memberof templateHelpers
 * @instance
 * @param {(string | number)} code status code to check
 * @return {boolean}
 */
function isNotDefaultStatusCode(code) {
  if (arguments.length < 1) {
    throw new Error(
        'Handlebars Helper \'isNotDefaultStatusCode\' needs 1 parameter');
  }

  return code !== 'default'
}

function hasBody(op, options) {
  let fnTrue = options.fn, 
      fnFalse = options.inverse;
  return ['post', 'patch', 'put'].indexOf(op) !== -1 ? fnTrue(this) : fnFalse(this);
}

function handleQueryParams(query, exampleName) {
  let queryParams = Object.keys(query).reduce((qsAccumulator, parameterName) => {
      if (query[parameterName] && query[parameterName].hasOwnProperty(exampleName)) {
          qsAccumulator[parameterName] = query[parameterName][exampleName].value;
      }
      return qsAccumulator;
  }, {});
  return JSON.stringify(queryParams);
}

function handlePath(path, pathParams, exampleName) {
  Object.keys(pathParams).forEach((paramName) => {
      if (pathParams[paramName] && pathParams[paramName].hasOwnProperty(exampleName)) {
          path = path.replaceBetween(path.indexOf('{'), path.indexOf('}'), pathParams[paramName][exampleName].value);
      }
  });
  return path;
}

function isSuccess(statusCode) {
  if(statusCode.toString()[0] === '2') {
      return true;
  }
  return false;
}

String.prototype.replaceBetween = function(start, end, newSubstring) {
  let newString = '';
  return newString.concat(this.substring(0, start), newSubstring, this.substring(end));
}