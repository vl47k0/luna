import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export interface ErrorProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  error_code: string;
  errors?:
    | {
        error_code: string;
        detail?: string;
      }[]
    | null;
}

export interface AgreementType {
  agreementTypeId: string;
  agreementTypeCode: string;
  isActive: boolean;
  attributes: {
    _ver: string;
    name: string;
    abbrevName?: string;
    description?: string;
    firstPartyRelatedDuties?: string[];
    firstPartyRelatedRoles?: string[];
    secondPartyRelatedDuties?: string[];
    secondPartyRelatedRoles?: string[];
  };
  version?: number;
}

export interface Agreement {
  agreementId?: string;
  agreementTypeId?: string;
  firstPartyUnitSetId?: string;
  firstPartyUnitId?: string;
  secondPartyUnitSetId?: string;
  secondPartyUnitId?: string;
  attributes?: {
    _ver?: number;
    priorAgreementId?: string;
    agreementRevision?: number;
    name?: string;
    description?: string;
    firstPartySigner?: string;
    firstPartyRelevantUnitList?: string[];
    secondPartySigner?: string;
    secondPartyRelevantUnitList?: string[];
    agreedDate?: string;
    referenceAgreementIdList?: string[];
  };
  effectiveStartDate?: string;
  effectiveEndDate?: string;
  cancellationDate?: string;
  version?: number;
}

export interface JobDuty {
  jobDutyId?: string;
  unitSetId?: string;
  jobDutyCode: string;
  roleSetIdList?: string[];
  effectiveStartDate: string;
  effectiveEndDate: string;
  targetUnitId?: string;
  attributes: {
    _ver?: string;
    name: string;
    abbrevName?: string;
    description?: string;
  };
  ownerUnitId?: string;
  ownerUserId?: string;
  ownerScopeType?: string;
  scopeType?: string;
  scopeId?: string;
  aclId?: string;
}

export interface RoleSet {
  roleSetId?: string;
  attributes?: {
    name: string;
    abbrevName?: string;
    description?: string;
  };
  roleCodeList: string[];
  targetUnitId?: string;
  ownerUnitId?: string;
  ownerUserId?: string;
  ownerScopeType?: ("unitSet" | "unit" | "user") | null;
  scopeType?: ("everyone" | "unitSet" | "unit" | "user") | null;
  scopeId?: string;
  aclId?: string;
}

export interface Role {
  roleCode: string;
  parentRoleCode?: string | null;
  attributes?: {
    _ver: string;
    name?: string;
    description?: string;
  };
}

export interface ListBusinessPartyUsersScope {
  scopeType: "UnitSet" | "UnitTree" | "AgreementType";
  scopeId: string;
  roleCode?: string;
  jobDutyCode?: string;
  filters?: {
    filterType: string;
    filterValue: string[];
  }[];
}

export interface BusinessPartyUserRecord {
  userId?: string;
  userCode?: string;
  userName?: string;
  unitJobDutyList?: {
    assignedName?: string;
    roleCode?: string;
    unitId?: string;
    unitCode?: string;
    unitName?: string;
    unitAbsPathCode?: {
      id?: string;
      code?: string;
      name?: string;
    };
  }[];
}

export interface ListBusinessPartyUsersResponse {
  hasNext?: boolean;
  records?: BusinessPartyUserRecord[];
}

export interface SearchCondition {
  scopeType: "UnitSet" | "UnitTree" | "AgreementType";
  scopeId: string;
  filters?: {
    filterType: string;
    filterValue: string[];
  }[];
}

export interface ListBusinessPartnersBody {
  searchConditions: SearchCondition[];
  groupUnitLimit?: number;
  groupUserLimit?: number;
  limit?: number;
}

export interface BusinessPartnerUser {
  userId?: string;
  userCode?: string;
  roleCode?: string;
  name?: string;
  abbrevName?: string;
  email?: string;
}

export interface BusinessPartnerUnit {
  unitId?: string;
  unitCode?: string;
  name?: string;
  abbrevName?: string;
  hasNextUser?: boolean;
  unitAbsPathCode?: {
    id?: string;
    code?: string;
    name?: string;
    abbrevName?: string;
  };
  userList?: BusinessPartnerUser[];
}

export interface BusinessPartnerRecord {
  agreementTypeId?: string;
  agreementTypeCode?: string;
  name?: string;
  abbrevName?: string;
  hasNextUnit?: boolean;
  hasNextUser?: boolean;
  unitList?: BusinessPartnerUnit[];
}

export interface ListBusinessPartnersResponse {
  hasNext?: boolean;
  hasNextAgreementType?: boolean;
  hasNextUnit?: boolean;
  hasNextUser?: boolean;
  records?: BusinessPartnerRecord[];
}

export interface GetObjectsByIdBody {
  userIds?: string[];
  unitIds?: string[];
  activeOnly?: boolean;
}

export interface UserInfo {
  userId: string;
  userCode: string;
  attributes: { [key: string]: any };
  effectiveStartDate: string;
  effectiveEndDate: string;
}

export interface UnitInfo {
  unitId: string;
  unitCode: string;
  attributes: { [key: string]: any };
  effectiveStartDate: string;
  effectiveEndDate: string;
  unitAbsPathCode: {
    id: string;
    code: string;
    name: string;
    abbrevName: string;
  }[];
}

export interface ObjectError {
  userId?: string;
  unitId?: string;
  errorCode: string;
  message: string;
}

export interface GetObjectsByIdResponse {
  users: (UserInfo | ObjectError)[];
  units: (UnitInfo | ObjectError)[];
}

//################################################################################
//## SERVICE CLASS
//################################################################################

export class CoreMasterService {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string, axiosInstance?: AxiosInstance) {
    this.axiosInstance =
      axiosInstance ||
      axios.create({
        baseURL,
        headers: {
          "Content-Type": "application/json",
        },
      });
  }

  public setAuthToken(token: string) {
    this.axiosInstance.defaults.headers.common["X-A2b-Token"] = token;
  }

  //==============================================================================
  //== User Service
  //==============================================================================

  public async getUser(
    userId: string,
    config?: AxiosRequestConfig
  ): Promise<UserInfo> {
    const response = await this.axiosInstance.get(`/users/${userId}`, config);
    return response.data;
  }

  public async updateUser(
    userId: string,
    requestBody: Partial<UserInfo>,
    config?: AxiosRequestConfig
  ): Promise<UserInfo> {
    const response = await this.axiosInstance.put(
      `/users/${userId}`,
      requestBody,
      config
    );
    return response.data;
  }

  //==============================================================================
  //== Unit Service
  //==============================================================================

  public async getUnit(
    unitId: string,
    config?: AxiosRequestConfig
  ): Promise<UnitInfo> {
    const response = await this.axiosInstance.get(`/units/${unitId}`, config);
    return response.data;
  }

  public async updateUnit(
    unitId: string,
    requestBody: Partial<UnitInfo>,
    config?: AxiosRequestConfig
  ): Promise<UnitInfo> {
    const response = await this.axiosInstance.put(
      `/units/${unitId}`,
      requestBody,
      config
    );
    return response.data;
  }

  //==============================================================================
  //== Agreements Service
  //==============================================================================

  public async createAgreement(
    requestBody: Agreement,
    config?: AxiosRequestConfig
  ): Promise<{ status?: number; data?: Agreement }> {
    const response = await this.axiosInstance.post(
      "/agreements/",
      requestBody,
      config
    );
    return response.data;
  }

  public async listAgreements(
    params?: {
      typeCode?: string;
      dutyCode?: string;
      roleCode?: string;
      unitSetId?: string;
      targetDate?: string;
      offset?: number;
      limit?: number;
    },
    config?: AxiosRequestConfig
  ): Promise<{
    status?: number;
    data?: { count?: number; records?: Agreement[] };
  }> {
    const response = await this.axiosInstance.get("/agreements/list", {
      ...config,
      params,
    });
    return response.data;
  }

  public async getAgreement(
    agreementId: string,
    config?: AxiosRequestConfig
  ): Promise<{ status?: number; data?: Agreement }> {
    const response = await this.axiosInstance.get(
      `/agreements/${agreementId}`,
      config
    );
    return response.data;
  }

  public async updateAgreement(
    agreementId: string,
    requestBody: Agreement,
    config?: AxiosRequestConfig
  ): Promise<{ status?: number; data?: Agreement }> {
    const response = await this.axiosInstance.put(
      `/agreements/${agreementId}`,
      requestBody,
      config
    );
    return response.data;
  }

  public async deleteAgreement(
    agreementId: string,
    params: { version: number },
    config?: AxiosRequestConfig
  ): Promise<{ status?: number }> {
    const response = await this.axiosInstance.delete(
      `/agreements/${agreementId}`,
      { ...config, params }
    );
    return response.data;
  }

  public async cancelAgreement(
    agreementId: string,
    requestBody: { cancellationDate?: string; version: number },
    config?: AxiosRequestConfig
  ): Promise<Agreement> {
    const response = await this.axiosInstance.put(
      `/agreements/${agreementId}/cancel`,
      requestBody,
      config
    );
    return response.data;
  }

  public async renewAgreement(
    agreementId: string,
    requestBody: Agreement,
    config?: AxiosRequestConfig
  ): Promise<Agreement> {
    const response = await this.axiosInstance.post(
      `/agreements/${agreementId}/renew`,
      requestBody,
      config
    );
    return response.data;
  }

  public async createAgreementType(
    requestBody: Partial<AgreementType>,
    config?: AxiosRequestConfig
  ): Promise<AgreementType> {
    const response = await this.axiosInstance.post(
      "/agreements/types",
      requestBody,
      config
    );
    return response.data;
  }

  public async findAgreementTypes(
    params: { code: string },
    config?: AxiosRequestConfig
  ): Promise<{ records?: AgreementType[] }> {
    const response = await this.axiosInstance.get("/agreements/types/find", {
      ...config,
      params,
    });
    return response.data;
  }

  public async getAgreementType(
    agreementTypeId: string,
    config?: AxiosRequestConfig
  ): Promise<AgreementType> {
    const response = await this.axiosInstance.get(
      `/agreements/types/${agreementTypeId}`,
      config
    );
    return response.data;
  }

  public async updateAgreementType(
    agreementTypeId: string,
    requestBody: Partial<AgreementType>,
    config?: AxiosRequestConfig
  ): Promise<AgreementType> {
    const response = await this.axiosInstance.put(
      `/agreements/types/${agreementTypeId}`,
      requestBody,
      config
    );
    return response.data;
  }

  public async deleteAgreementType(
    agreementTypeId: string,
    config?: AxiosRequestConfig
  ): Promise<void> {
    await this.axiosInstance.delete(
      `/agreements/types/${agreementTypeId}`,
      config
    );
  }

  //==============================================================================
  //== Invited Users Service
  //==============================================================================

  public async getAllInvitedUsers(
    params?: { deleted?: 0 | 1 },
    config?: AxiosRequestConfig
  ): Promise<any> {
    const response = await this.axiosInstance.get("/invited/", {
      ...config,
      params,
    });
    return response.data;
  }

  public async registerInvitation(
    requestBody: {
      unitSetId: string;
      userId: string;
      message?: string;
      assigned: {
        unitId: string;
        jobDutyId: string;
        roleCode: string;
        startDate?: string;
        endDate?: string;
      };
    },
    config?: AxiosRequestConfig
  ): Promise<any> {
    const response = await this.axiosInstance.post(
      "/invited/",
      requestBody,
      config
    );
    return response.data;
  }

  public async acceptInvitation(
    id: string,
    params: { nonce: string },
    config?: AxiosRequestConfig
  ): Promise<void> {
    await this.axiosInstance.get(`/invited/accept/${id}`, {
      ...config,
      params,
    });
  }

  public async refuseInvitation(
    id: string,
    params: { nonce: string },
    config?: AxiosRequestConfig
  ): Promise<void> {
    await this.axiosInstance.get(`/invited/refuse/${id}`, {
      ...config,
      params,
    });
  }

  public async deleteInvitation(
    id: string,
    config?: AxiosRequestConfig
  ): Promise<void> {
    await this.axiosInstance.delete(`/invited/${id}`, config);
  }

  //==============================================================================
  //== Job Duty Service
  //==============================================================================

  public async createJobDuty(
    requestBody: JobDuty,
    config?: AxiosRequestConfig
  ): Promise<JobDuty> {
    const response = await this.axiosInstance.post(
      "/job-duties/",
      requestBody,
      config
    );
    return response.data;
  }

  public async updateJobDuty(
    id: string,
    requestBody: Partial<JobDuty>,
    config?: AxiosRequestConfig
  ): Promise<JobDuty> {
    const response = await this.axiosInstance.put(
      `/job-duties/${id}`,
      requestBody,
      config
    );
    return response.data;
  }

  public async findJobDuty(
    params?: { code?: string; unitSetId?: string },
    config?: AxiosRequestConfig
  ): Promise<{ status?: number; data?: JobDuty[] }> {
    const response = await this.axiosInstance.get("/job-duties/find", {
      ...config,
      params,
    });
    return response.data;
  }

  //==============================================================================
  //== Role Service
  //==============================================================================

  public async getRole(
    roleCode: string,
    config?: AxiosRequestConfig
  ): Promise<{ data: { role: Role; roleCodeList: string[] } }> {
    const response = await this.axiosInstance.get(`/roles/${roleCode}`, config);
    return response.data;
  }

  public async putRole(
    roleCode: string,
    requestBody: Partial<Role>,
    config?: AxiosRequestConfig
  ): Promise<any> {
    const response = await this.axiosInstance.put(
      `/roles/${roleCode}`,
      requestBody,
      config
    );
    return response.data;
  }

  //==============================================================================
  //== Role Set Service
  //==============================================================================

  public async createRoleSet(
    requestBody: Partial<RoleSet>,
    config?: AxiosRequestConfig
  ): Promise<{ data: { roleSet: RoleSet } }> {
    const response = await this.axiosInstance.post(
      "/role-sets/",
      requestBody,
      config
    );
    return response.data;
  }

  public async getRoleSet(
    roleSetId: string,
    config?: AxiosRequestConfig
  ): Promise<{ data: RoleSet }> {
    const response = await this.axiosInstance.get(
      `/role-sets/${roleSetId}`,
      config
    );
    return response.data;
  }

  public async updateRoleSet(
    roleSetId: string,
    requestBody: Partial<RoleSet>,
    config?: AxiosRequestConfig
  ): Promise<{ data: { roleSet: RoleSet } }> {
    const response = await this.axiosInstance.put(
      `/role-sets/${roleSetId}`,
      requestBody,
      config
    );
    return response.data;
  }

  public async deleteRoleSet(
    roleSetId: string,
    config?: AxiosRequestConfig
  ): Promise<any> {
    const response = await this.axiosInstance.delete(
      `/role-sets/${roleSetId}`,
      config
    );
    return response.data;
  }

  //==============================================================================
  //== Batch & Business Services
  //==============================================================================

  public async listBusinessPartyUsers(
    requestBody: ListBusinessPartyUsersScope[],
    config?: AxiosRequestConfig
  ): Promise<{ data?: ListBusinessPartyUsersResponse }> {
    const response = await this.axiosInstance.post(
      "/listBusinessPartyUsers",
      requestBody,
      config
    );
    return response.data;
  }

  public async listBusinessPartners(
    requestBody: ListBusinessPartnersBody,
    config?: AxiosRequestConfig
  ): Promise<{ data?: ListBusinessPartnersResponse }> {
    const response = await this.axiosInstance.post(
      "/list-business-partners",
      requestBody,
      config
    );
    return response.data;
  }

  public async getObjectsById(
    requestBody: GetObjectsByIdBody,
    config?: AxiosRequestConfig
  ): Promise<{ data?: GetObjectsByIdResponse }> {
    const response = await this.axiosInstance.post(
      "/get-objects-by-id",
      requestBody,
      config
    );
    return response.data;
  }

  public async getObjectsByCode(
    requestBody: any,
    config?: AxiosRequestConfig
  ): Promise<any> {
    const response = await this.axiosInstance.post(
      "/get-objects-by-code",
      requestBody,
      config
    );
    return response.data;
  }
}
