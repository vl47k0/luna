import axios from 'axios';
import authHeader from './AuthHeader';

export interface Attributes {
  _ver: string;
  name: string;
  abbrevName: string;
  description: string;
}

export interface UnitAbsPathCode {
  id: string;
  code: string;
  name: string;
}

export interface Unit {
  unitId: string;
  unitCode: string;
  attributes: Attributes;
  unitAbsPathCode: UnitAbsPathCode[];
  unitAbsPath: string[];
}

export interface JobDuty {
  jobDutyId: string;
  jobDutyCode: string;
  roleSetIdList: string[];
  attributes: Attributes;
}

export interface UnitAssignedUser {
  unitAssignedUserId: string;
  roleCode: string;
  attributes: Attributes;
  roleCodeList: string[];
}

export interface UnitJobDutyList {
  unitAssignedUser: UnitAssignedUser;
  unit: Unit;
  jobDuty: JobDuty;
}

export interface A2b {
  userId: string;
  userCode: string;
  unitSetId: string;
  attributes: Attributes;
  unitJobDutyList: UnitJobDutyList[];
}

export interface UserInfo {
  s_hash: string;
  at_hash: string;
  _a2b: A2b;
  iat: number;
  exp: number;
  iss: string;
  sub: string;
  jti: string;
}

const axiosBackend = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_URL,
});

class UserService {
  async getPublicContent() {
    const headers = await authHeader();

    return axios.get(
      axiosBackend.defaults.baseURL + 'am/a2b-develop/oidc/userinfo',
      {
        headers,
      }
    );
  }
}

export default new UserService();
