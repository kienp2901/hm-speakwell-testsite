/* eslint-disable import/no-anonymous-default-export */
const PREFIX = `local::`;

function set<T = object>(key: string, value: T): void {
  if (!localStorage) {
    return;
  }

  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(PREFIX + key, serializedValue);
  } catch (error) {
    throw new Error('store serialization failed');
  }
}

function get<T = object>(key: string): T | undefined {
  if (!localStorage) {
    return;
  }

  try {
    const serializedValue = localStorage.getItem(PREFIX + key);
    if (!serializedValue) {
      return;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    throw new Error('store deserialization failed');
  }
}

function removeItem(key: string) {
  if (!localStorage) {
    return;
  }
  try {
    localStorage.removeItem(PREFIX + key);
  } catch (error) {
    throw new Error('store deserialization failed');
  }
}

function removeAllItem() {
  if (!localStorage) {
    return;
  }
  try {
    localStorage.clear();
  } catch (error) {
    throw new Error('store deserialization failed');
  }
}

export const ICAN_AUTH_TOKEN = 'ican_access_token';
export const EMS_TOKEN = 'ems_access_token';
export const EMS_REFRESH_TOKEN = 'ems_refresh_token';
export const CMS_TOKEN = 'cms_access_token';
export const USER_INFO = 'hm_user_info';

export default {
  get,
  set,
  removeItem,
  removeAllItem,
  ICAN_AUTH_TOKEN,
  EMS_TOKEN,
  EMS_REFRESH_TOKEN,
  CMS_TOKEN,
  USER_INFO,
};

