const types = require('../constants/ActionTypes');
const { push } = require('react-router-redux');

const { setForm, resetForm } = require('./FormActions');
const userAPI = require('../api/user');
const dataAPI = require('../api/data');

const { getDeviceKeysByType } = require('../utils/device');
const { getTimeByPeriod, getPreviousPeriod, getGranularityByDiff } = require('../utils/time');
const { showerFilterToLength, throwServerError } = require('../utils/general');
const { flattenCommonsGroups } = require('../utils/commons');

const { setConfirm, resetConfirm } = require('./FormActions');
const { setSuccess, resetSuccess, requestedQuery, receivedQuery, dismissError, setError } = require('./QueryActions');
const { fetchProfile } = require('./UserActions');

const { SUCCESS_SHOW_TIMEOUT } = require('../constants/HomeConstants');

const saveMembers = function (members) {
  return function (dispatch, getState) {
    const data = {
      members, 
      csrf: getState().user.csrf,
    };

    dispatch(requestedQuery());

    return userAPI.saveMembers(data)
    .then((response) => {
      dispatch(receivedQuery());
      
      if (!response || !response.success) {
        throwServerError(response);  
      }
      
      dispatch(setSuccess());
      setTimeout(() => { dispatch(resetSuccess()); }, SUCCESS_SHOW_TIMEOUT);

      return response;
    }) 
    .catch((error) => {
      console.error('Error caught on saveMembers:', error);
      dispatch(setError(error));
      return error;
    });
  };
};

const addMember = function (data) {
  return function (dispatch, getState) {
    const { index } = data;
    const { members } = getState().user.profile.household;

    const lastIndex = Array.isArray(members) && members.length > 0 ? members.map(m => m.index).reduce((p, c) => c > p ? c : p, 0) : 1;
    const newMembers = [...members, { ...data, active: true, index: lastIndex + 1 }];
    return dispatch(saveMembers(newMembers));
  };
};

const editMember = function (data) {
  return function (dispatch, getState) {
    const { index } = data;
    const { members } = getState().user.profile.household;

    if (index == null || index === -1) {
      return dispatch(addMember(data));
    }

    const newMembers = members.map(m => m.index === index ? { ...m, ...data, active: true } : m);

    return dispatch(saveMembers(newMembers));
  };
};

const removeMember = function (data) {
  return function (dispatch, getState) {
    const { index } = data;
    const { members } = getState().user.profile.household;

    const newMembers = members.filter(m => m.index !== index);

    return dispatch(saveMembers(newMembers));
  };
};

const clickConfirmMember = function () {
  return function (dispatch, getState) {
    const { item, mode } = getState().forms.confirm;

    if (mode === 'create') {
      dispatch(push('/settings/members'));
      dispatch(addMember(item))
      .then(() => dispatch(fetchProfile()));
    } else if (mode === 'update') {
      dispatch(editMember(item))
      .then(() => dispatch(fetchProfile()));
    } else if (mode === 'delete') {
      dispatch(removeMember(item))
      .then(() => dispatch(fetchProfile()));
    } else { 
      throw new Error('Unrecognized mode in click confirm', mode);
    }
    dispatch(resetConfirm());
  };
};


module.exports = {
  saveMembers,
  addMember,
  editMember,
  removeMember,
  //confirm
  clickConfirmMember,
};
