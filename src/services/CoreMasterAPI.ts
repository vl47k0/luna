// === Auto-generated from OpenAPI (typed Axios client) ===
import axios, { AxiosInstance } from 'axios';

// ---- Schemas & Operation Types ----
export interface FindByUnitSetCodeQuery {
  "code": string;
}
export type never = never;
export type FindByUnitSetCodeResponse = any;
export type never = never;
export type CreateUnitSetResponse = any;
export type never = never;
export type FindByUnitIdResponse = any;
export type never = never;
export type EditUnitSetResponse = any;
export type never = never;
export type DeleteUnitSetResponse = any;
export interface GetUnitSetUnitsQuery {
  "unitCode"?: string;
}
export type never = never;
export type GetUnitSetUnitsResponse = any;
export type never = never;
export type CreateUnitResponse = any;
export interface GetUnitQuery {
  "lowerIds"?: true | false;
  "detailed"?: true | false;
}
export type never = never;
export type GetUnitResponse = any;
export type never = never;
export type UpdateUnitResponse = any;
export interface GetUnitLinksQuery {
  "target"?: string;
}
export type never = never;
export type GetUnitLinksResponse = any;
export type CreateUnitLinkBody = {
  "unitLinkId"?: string;
  "upperUnitId"?: string;
  "unitId"?: string;
  "startDate"?: string;
  "endDate"?: string;
  "unitSetId"?: string;
  "version"?: number;
  "creationDate"?: string;
  "creationUserId"?: string;
  "creationUnitId"?: string;
  "updateDate"?: string;
  "updateUserId"?: string;
  "updateUnitId"?: string;
  "deletionDate"?: any;
};
export type CreateUnitLinkResponse = any;
export interface UpdateLinkPath {
  "linkId": string;
}
export type UpdateLinkBody = {
  "unitLinkId"?: string;
  "upperUnitId"?: string;
  "unitId"?: string;
  "startDate"?: string;
  "endDate"?: string;
  "unitSetId"?: string;
  "version"?: number;
  "creationDate"?: string;
  "creationUserId"?: string;
  "creationUnitId"?: string;
  "updateDate"?: string;
  "updateUserId"?: string;
  "updateUnitId"?: string;
  "deletionDate"?: any;
};
export type UpdateLinkResponse = any;
export interface DeleteLinkPath {
  "linkId": string;
}
export type never = never;
export type DeleteLinkResponse = any;
export interface GetUpperUnitLinksListPath {
  "unitId": string;
}
export type never = never;
export type GetUpperUnitLinksListResponse = any;
export interface PutRelinkPath {
  "unitId": string;
}
export type PutRelinkBody = {
  "unitLinkId"?: string;
  "upperUnitId"?: string;
  "unitId"?: string;
  "startDate"?: string;
  "endDate"?: string;
  "unitSetId"?: string;
  "version"?: number;
  "creationDate"?: string;
  "creationUserId"?: string;
  "creationUnitId"?: string;
  "updateDate"?: string;
  "updateUserId"?: string;
  "updateUnitId"?: string;
  "deletionDate"?: any;
} & {
  "unitId"?: any;
  "version"?: any;
};
export type PutRelinkResponse = any;
export interface PutUnlinkPath {
  "unitId": string;
  "linkId": string;
}
export interface PutUnlinkQuery {
  "version": number;
}
export type PutUnlinkBody = {
  "endDate": string;
};
export type PutUnlinkResponse = any;
export interface GetUnitUsersPath {
  "unitId": string;
}
export interface GetUnitUsersQuery {
  "jobDutyId"?: string;
  "roleCode"?: string;
}
export type never = never;
export type GetUnitUsersResponse = any;
export interface GetUnitsFindQuery {
  "unitCode": string;
  "unitSetCode"?: string;
}
export interface GetUnitsFindHeader {
  "X-A2b-Token": string;
}
export type never = never;
export type GetUnitsFindResponse = any;
export interface PutUnitAssignedUsersPath {
  "unitAssignedUserId": string;
}
export interface PutUnitAssignedUsersHeader {
  "X-A2b-Token": string;
}
export type PutUnitAssignedUsersBody = any & {
  "unitSetId"?: any;
  "version"?: any;
};
export type PutUnitAssignedUsersResponse = any;
export interface GetUnitAssignedUsersPath {
  "unitId": string;
}
export interface GetUnitAssignedUsersQuery {
  "userId"?: string;
}
export interface GetUnitAssignedUsersHeader {
  "X-A2b-Token": string;
}
export type never = never;
export type GetUnitAssignedUsersResponse = any;
export interface PostUnitAssignedUsersPath {
  "unitId": string;
}
export interface PostUnitAssignedUsersHeader {
  "X-A2b-Token": string;
}
export type PostUnitAssignedUsersBody = any & {
  "unitId"?: any;
};
export type PostUnitAssignedUsersResponse = any;
export type never = never;
export type FindAssginedRolesResponse = any;
export type never = never;
export type CreateUnitAssginedRolesResponse = any;
export interface GetAssginedRolePath {
  "id": string;
}
export type never = never;
export type GetAssginedRoleResponse = any;
export interface UpdateAssginedRolePath {
  "id": string;
}
export type never = never;
export type UpdateAssginedRoleResponse = any;
export interface DeleteAssginedRolePath {
  "id": string;
}
export type never = never;
export type DeleteAssginedRoleResponse = any;
export interface FindAssginableJobDutyQuery {
  "jobDutyId"?: string;
}
export type never = never;
export type FindAssginableJobDutyResponse = any;
export type never = never;
export type CreateAssignableJobDutyResponse = any;
export interface GetAssignableJobDutyPath {
  "id": string;
}
export type never = never;
export type GetAssignableJobDutyResponse = any;
export interface UpdateAssignableJobDutyPath {
  "id": string;
}
export type never = never;
export type UpdateAssignableJobDutyResponse = any;
export interface DeleteUnitsUnitidJobDutiesIdPath {
  "id": string;
}
export type never = never;
export type DeleteUnitsUnitidJobDutiesIdResponse = any;
export interface PostUsersHeader {
  "X-A2b-Token": string;
}
export type PostUsersBody = {
  "user": any;
  "unitAssignedUser"?: any & {
  "userId"?: any;
};
};
export type PostUsersResponse = any;
export interface GetUsersQuery {
  "userId"?: string;
  "userCode"?: string;
  "unitSetId"?: string;
}
export interface GetUsersHeader {
  "X-A2b-Token": string;
}
export type never = never;
export type GetUsersResponse = any;
export interface PutUsersPath {
  "userId": string;
}
export interface PutUsersHeader {
  "X-A2b-Token": string;
}
export type PutUsersBody = any & {
  "version"?: any;
};
export type PutUsersResponse = any;
export interface GetUsersJobDutyListPath {
  "userId": string;
}
export interface GetUsersJobDutyListQuery {
  "unitId": string;
  "targetDate"?: string;
}
export interface GetUsersJobDutyListHeader {
  "X-A2b-Token": string;
}
export type never = never;
export type GetUsersJobDutyListResponse = any;
export interface PostRolesHeader {
  "X-A2b-Token": string;
}
export type PostRolesBody = {
  "jobDuty"?: {
  "roleCode"?: string;
  "roleType"?: "Function" | "Virtual" | "FunctionGroup";
  "attributes"?: {
  "name"?: any;
  "abbrevName"?: any;
  "description"?: any;
};
  "targetUnitId"?: string;
};
};
export type PostRolesResponse = any;
export interface GetRolesListQuery {
  "targetUnitId": string;
  "roleType"?: string;
  "roleCode"?: string;
  "offset"?: number;
  "limit"?: number;
  "targetDate"?: string;
  "lowerDepth"?: number;
  "attrCond"?: string;
  "$filter"?: string;
}
export interface GetRolesListHeader {
  "X-A2b-Token": string;
}
export type never = never;
export type GetRolesListResponse = any;
export interface GetRolesPath {
  "roleCode": string;
}
export interface GetRolesHeader {
  "X-A2b-Token": string;
}
export type never = never;
export type GetRolesResponse = any;
export interface PutRolesPath {
  "roleCode": string;
}
export interface PutRolesHeader {
  "X-A2b-Token": string;
}
export type PutRolesBody = {
  "roleType"?: "Function" | "Virtual" | "FunctionGroup";
  "attributes"?: {
  "_ver"?: any;
  "name"?: any;
  "abbrevName"?: any;
  "description"?: any;
};
  "targetUnitId"?: string;
  "ownerUnitId"?: string;
  "ownerUserId"?: string;
  "ownerScopeType"?: string;
  "scopeType"?: string;
  "scopeId"?: string;
  "aclId"?: string;
};
export type PutRolesResponse = any;
export interface DeleteRolesPath {
  "roleCode": string;
}
export interface DeleteRolesQuery {
  "version": number;
}
export interface DeleteRolesHeader {
  "X-A2b-Token": string;
}
export type never = never;
export type DeleteRolesResponse = any;
export interface PostRoleLinksPath {
  "roleCode": string;
  "lowerRoleCode": string;
}
export interface PostRoleLinksHeader {
  "X-A2b-Token": string;
}
export type PostRoleLinksBody = {
  "startDate"?: string;
  "endDate"?: string;
};
export type PostRoleLinksResponse = any;
export interface DeleteRoleLinksPath {
  "roleCode": string;
  "lowerRoleCode": string;
}
export interface DeleteRoleLinksQuery {
  "targetDate"?: string;
}
export interface DeleteRoleLinksHeader {
  "X-A2b-Token": string;
}
export type never = never;
export type DeleteRoleLinksResponse = any;
export interface PostRoleSetsHeader {
  "X-A2b-Token": string;
}
export type PostRoleSetsBody = {
  "attributes"?: {
  "name"?: any;
  "abbrevName"?: any;
  "description"?: any;
};
  "roleCodeList": string[];
  "targetUnitId"?: string;
  "ownerUnitId"?: string;
  "ownerUserId"?: string;
  "ownerScopeType"?: string;
  "scopeType"?: string;
  "scopeId"?: string;
  "aclId"?: string;
};
export type PostRoleSetsResponse = any;
export interface GetFindRoleSetsQuery {
  "targetUnitId": string;
  "offset"?: number;
  "limit"?: number;
  "lowerDepth"?: number;
  "attrCond"?: string;
}
export interface GetFindRoleSetsHeader {
  "X-A2b-Token": string;
}
export type never = never;
export type GetFindRoleSetsResponse = any;
export interface GetRoleSetsPath {
  "roleSetId": string;
}
export interface GetRoleSetsHeader {
  "X-A2b-Token": string;
}
export type never = never;
export type GetRoleSetsResponse = any;
export interface PutRoleSetsPath {
  "roleSetId": string;
}
export interface PutRoleSetsHeader {
  "X-A2b-Token": string;
}
export type PutRoleSetsBody = {
  "attributes"?: {
  "name"?: any;
  "abbrevName"?: any;
  "description"?: any;
};
  "roleCodeList"?: string[];
  "targetUnitId"?: string;
  "ownerUnitId"?: string;
  "ownerUserId"?: string;
  "ownerScopeType"?: string;
  "scopeType"?: string;
  "scopeId"?: string;
  "aclId"?: string;
};
export type PutRoleSetsResponse = any;
export interface DeleteRoleLinksPath {
  "roleSetId": string;
}
export interface DeleteRoleLinksHeader {
  "X-A2b-Token": string;
}
export type never = never;
export type DeleteRoleLinksResponse = any;
export type PostAgreementsBody = {
  "agreementId"?: string;
  "agreementTypeId"?: string;
  "firstPartyUnitSetId"?: string;
  "firstPartyUnitId"?: string;
  "secondPartyUnitSetId"?: string;
  "secondPartyUnitId"?: string;
  "attributes"?: {
  "_ver"?: string;
  "name"?: string;
  "description"?: string;
  "priorAgreementId"?: string;
  "agreementRevision"?: string;
  "firstPartySigner"?: string;
  "firstPartyRelevantUnitList"?: string[];
  "secondPartySigner"?: string;
  "secondPartyRelevantUnitList"?: string[];
  "agreedDate"?: string;
  "referenceAgreementIdList"?: string[];
};
  "effectiveStartDate"?: string;
  "effectiveEndDate"?: string;
  "cancellationDate"?: string;
  "version"?: number;
  "ownerUnitId"?: string;
  "ownerUserId"?: string;
  "scopeType"?: "unitSet" | "unit" | "unitTree" | "user" | "everyone" | "anonymous" | "none" | "unitRole" | "unitTreeRole";
  "scopeId"?: string;
  "aclId"?: string;
  "creationDate"?: string;
  "creationUserId"?: string;
  "creationUnitId"?: string;
  "updateDate"?: string;
  "updateUserId"?: string;
  "updateUnitId"?: string;
  "deletionDate"?: string;
};
export type PostAgreementsResponse = any;
export interface GetAgreementsListQuery {
  "typeCode"?: string;
  "dutyCode"?: string;
  "roleCode"?: string;
  "unitSetId"?: string;
  "targetDate"?: string;
  "offset"?: number;
  "limit"?: number;
  "order"?: string[];
}
export type never = never;
export type GetAgreementsListResponse = any;
export interface GetAgreementsAgreementidPath {
  "agreementId": string;
}
export type never = never;
export type GetAgreementsAgreementidResponse = any;
export interface PutAgreementsAgreementidPath {
  "agreementId": string;
}
export type PutAgreementsAgreementidBody = {
  "agreementId"?: string;
  "agreementTypeId"?: string;
  "firstPartyUnitSetId"?: string;
  "firstPartyUnitId"?: string;
  "secondPartyUnitSetId"?: string;
  "secondPartyUnitId"?: string;
  "attributes"?: {
  "_ver"?: string;
  "name"?: string;
  "description"?: string;
  "priorAgreementId"?: string;
  "agreementRevision"?: string;
  "firstPartySigner"?: string;
  "firstPartyRelevantUnitList"?: string[];
  "secondPartySigner"?: string;
  "secondPartyRelevantUnitList"?: string[];
  "agreedDate"?: string;
  "referenceAgreementIdList"?: string[];
};
  "effectiveStartDate"?: string;
  "effectiveEndDate"?: string;
  "cancellationDate"?: string;
  "version"?: number;
  "ownerUnitId"?: string;
  "ownerUserId"?: string;
  "scopeType"?: "unitSet" | "unit" | "unitTree" | "user" | "everyone" | "anonymous" | "none" | "unitRole" | "unitTreeRole";
  "scopeId"?: string;
  "aclId"?: string;
  "creationDate"?: string;
  "creationUserId"?: string;
  "creationUnitId"?: string;
  "updateDate"?: string;
  "updateUserId"?: string;
  "updateUnitId"?: string;
  "deletionDate"?: string;
} & {
  "firstPartyUnitId"?: any;
  "secondPartyUnitId"?: any;
  "attributes"?: {
  "referenceAgreementIdList"?: any;
};
  "version"?: any;
};
export type PutAgreementsAgreementidResponse = any;
export interface DeleteAgreementsAgreementidPath {
  "agreementId": string;
}
export interface DeleteAgreementsAgreementidQuery {
  "version": number;
}
export type never = never;
export type DeleteAgreementsAgreementidResponse = any;
export interface PutAgreementsAgreementidCancelPath {
  "agreementId": string;
}
export type PutAgreementsAgreementidCancelBody = {
  "cancellationDate"?: string;
  "version": number;
};
export type PutAgreementsAgreementidCancelResponse = any;
export interface PostAgreementsAgreementidRenewPath {
  "agreementId": string;
}
export type PostAgreementsAgreementidRenewBody = {
  "agreementId"?: string;
  "agreementTypeId"?: string;
  "firstPartyUnitSetId"?: string;
  "firstPartyUnitId"?: string;
  "secondPartyUnitSetId"?: string;
  "secondPartyUnitId"?: string;
  "attributes"?: {
  "_ver"?: string;
  "name"?: string;
  "description"?: string;
  "priorAgreementId"?: string;
  "agreementRevision"?: string;
  "firstPartySigner"?: string;
  "firstPartyRelevantUnitList"?: string[];
  "secondPartySigner"?: string;
  "secondPartyRelevantUnitList"?: string[];
  "agreedDate"?: string;
  "referenceAgreementIdList"?: string[];
};
  "effectiveStartDate"?: string;
  "effectiveEndDate"?: string;
  "cancellationDate"?: string;
  "version"?: number;
  "ownerUnitId"?: string;
  "ownerUserId"?: string;
  "scopeType"?: "unitSet" | "unit" | "unitTree" | "user" | "everyone" | "anonymous" | "none" | "unitRole" | "unitTreeRole";
  "scopeId"?: string;
  "aclId"?: string;
  "creationDate"?: string;
  "creationUserId"?: string;
  "creationUnitId"?: string;
  "updateDate"?: string;
  "updateUserId"?: string;
  "updateUnitId"?: string;
  "deletionDate"?: string;
} & {
  "version"?: any;
};
export type PostAgreementsAgreementidRenewResponse = any;
export type PostAgreementsTypesBody = any & {
  "agreementTypeCode"?: any;
  "version"?: any;
};
export type PostAgreementsTypesResponse = any;
export interface GetAgreementsTypesFindQuery {
  "code": string;
}
export type never = never;
export type GetAgreementsTypesFindResponse = any;
export interface GetAgreementsTypesAgreementtypeidPath {
  "agreementTypeId": string;
}
export type never = never;
export type GetAgreementsTypesAgreementtypeidResponse = any;
export interface PutAgreementsTypesAgreementtypeidPath {
  "agreementTypeId": string;
}
export type PutAgreementsTypesAgreementtypeidBody = any;
export type PutAgreementsTypesAgreementtypeidResponse = any;
export interface DeleteAgreementsTypesAgreementtypeidPath {
  "agreementTypeId": string;
}
export type never = never;
export type DeleteAgreementsTypesAgreementtypeidResponse = any;
export type PostListbusinesspartyusersBody = {
  "scopeType": "UnitSet" | "UnitTree" | "AgreementType";
  "scopeId": string;
  "roleCode"?: string;
  "jobDutyCode"?: string;
  "filters"?: {
  "filterType": string;
  "filterValue": string[];
}[];
}[];
export type PostListbusinesspartyusersResponse = any;
export type PostListBusinessPartnersBody = {
  "searchConditions"?: {
  "scopeType": "UnitSet" | "UnitTree" | "AgreementType";
  "scopeId": string;
  "filters"?: {
  "filterType": string;
  "filterValue": string[];
}[];
}[];
  "groupUnitLimit"?: number;
  "groupUserLimit"?: number;
  "limit"?: number;
};
export type PostListBusinessPartnersResponse = any;
export interface GetObjectsByIdHeader {
  "X-A2b-Token": string;
}
export type GetObjectsByIdBody = {
  "userIds"?: any[];
  "unitIds"?: any[];
  "activeOnly"?: boolean;
};
export type GetObjectsByIdResponse = any;
export interface GetObjectsByCodeHeader {
  "X-A2b-Token": string;
}
export type GetObjectsByCodeBody = {
  "userCodes"?: {
  "userCode": any;
  "unitSetCode"?: any;
}[];
  "unitCodes"?: {
  "unitCode": any;
  "unitSetCode"?: any;
}[];
  "activeOnly"?: boolean;
};
export type GetObjectsByCodeResponse = any;
export type never = never;
export type GetSecurityGroupResponse = any;
export type PutSecurityGroupBody = any & {
  "members"?: any & any[];
} & any;
export type PutSecurityGroupResponse = any;
export interface DeleteSecurityGroupQuery {
  "version": number;
}
export type never = never;
export type DeleteSecurityGroupResponse = any;
export interface PostSimpleAclHeader {
  "X-A2b-Token": string;
}
export type PostSimpleAclBody = {
  "candidateScopeType": "unitSet" | "unitTree" | "unit" | "user";
  "candidateScopeId": string;
  "userIdAs"?: string;
  "unitIdAs"?: string;
  "unitSetIdAs"?: string;
  "checkScopeList"?: "unitSet" | "unitTree" | "unit" | "agreement"[];
};
export type PostSimpleAclResponse = any;

export interface FindByUnitSetCodeRequest {
  path: Record<string, never>;
  query?: FindByUnitSetCodeQuery;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface CreateUnitSetRequest {
  path: Record<string, never>;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface FindByUnitIdRequest {
  path: Record<string, never>;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface EditUnitSetRequest {
  path: Record<string, never>;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface DeleteUnitSetRequest {
  path: Record<string, never>;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface GetUnitSetUnitsRequest {
  path: Record<string, never>;
  query?: GetUnitSetUnitsQuery;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface CreateUnitRequest {
  path: Record<string, never>;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface GetUnitRequest {
  path: Record<string, never>;
  query?: GetUnitQuery;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface UpdateUnitRequest {
  path: Record<string, never>;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface GetUnitLinksRequest {
  path: Record<string, never>;
  query?: GetUnitLinksQuery;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface CreateUnitLinkRequest {
  path: Record<string, never>;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: CreateUnitLinkBody;
}
export interface UpdateLinkRequest {
  path: UpdateLinkPath;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: UpdateLinkBody;
}
export interface DeleteLinkRequest {
  path: DeleteLinkPath;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface GetUpperUnitLinksListRequest {
  path: GetUpperUnitLinksListPath;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface PutRelinkRequest {
  path: PutRelinkPath;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: PutRelinkBody;
}
export interface PutUnlinkRequest {
  path: PutUnlinkPath;
  query?: PutUnlinkQuery;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: PutUnlinkBody;
}
export interface GetUnitUsersRequest {
  path: GetUnitUsersPath;
  query?: GetUnitUsersQuery;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface GetUnitsFindRequest {
  path: Record<string, never>;
  query?: GetUnitsFindQuery;
  header?: GetUnitsFindHeader;
  cookie?: Record<string, never>;
  body?: never;
}
export interface PutUnitAssignedUsersRequest {
  path: PutUnitAssignedUsersPath;
  query?: Record<string, never>;
  header?: PutUnitAssignedUsersHeader;
  cookie?: Record<string, never>;
  body?: PutUnitAssignedUsersBody;
}
export interface GetUnitAssignedUsersRequest {
  path: GetUnitAssignedUsersPath;
  query?: GetUnitAssignedUsersQuery;
  header?: GetUnitAssignedUsersHeader;
  cookie?: Record<string, never>;
  body?: never;
}
export interface PostUnitAssignedUsersRequest {
  path: PostUnitAssignedUsersPath;
  query?: Record<string, never>;
  header?: PostUnitAssignedUsersHeader;
  cookie?: Record<string, never>;
  body?: PostUnitAssignedUsersBody;
}
export interface FindAssginedRolesRequest {
  path: Record<string, never>;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface CreateUnitAssginedRolesRequest {
  path: Record<string, never>;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface GetAssginedRoleRequest {
  path: GetAssginedRolePath;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface UpdateAssginedRoleRequest {
  path: UpdateAssginedRolePath;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface DeleteAssginedRoleRequest {
  path: DeleteAssginedRolePath;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface FindAssginableJobDutyRequest {
  path: Record<string, never>;
  query?: FindAssginableJobDutyQuery;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface CreateAssignableJobDutyRequest {
  path: Record<string, never>;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface GetAssignableJobDutyRequest {
  path: GetAssignableJobDutyPath;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface UpdateAssignableJobDutyRequest {
  path: UpdateAssignableJobDutyPath;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface DeleteUnitsUnitidJobDutiesIdRequest {
  path: DeleteUnitsUnitidJobDutiesIdPath;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface PostUsersRequest {
  path: Record<string, never>;
  query?: Record<string, never>;
  header?: PostUsersHeader;
  cookie?: Record<string, never>;
  body?: PostUsersBody;
}
export interface GetUsersRequest {
  path: Record<string, never>;
  query?: GetUsersQuery;
  header?: GetUsersHeader;
  cookie?: Record<string, never>;
  body?: never;
}
export interface PutUsersRequest {
  path: PutUsersPath;
  query?: Record<string, never>;
  header?: PutUsersHeader;
  cookie?: Record<string, never>;
  body?: PutUsersBody;
}
export interface GetUsersJobDutyListRequest {
  path: GetUsersJobDutyListPath;
  query?: GetUsersJobDutyListQuery;
  header?: GetUsersJobDutyListHeader;
  cookie?: Record<string, never>;
  body?: never;
}
export interface PostRolesRequest {
  path: Record<string, never>;
  query?: Record<string, never>;
  header?: PostRolesHeader;
  cookie?: Record<string, never>;
  body?: PostRolesBody;
}
export interface GetRolesListRequest {
  path: Record<string, never>;
  query?: GetRolesListQuery;
  header?: GetRolesListHeader;
  cookie?: Record<string, never>;
  body?: never;
}
export interface GetRolesRequest {
  path: GetRolesPath;
  query?: Record<string, never>;
  header?: GetRolesHeader;
  cookie?: Record<string, never>;
  body?: never;
}
export interface PutRolesRequest {
  path: PutRolesPath;
  query?: Record<string, never>;
  header?: PutRolesHeader;
  cookie?: Record<string, never>;
  body?: PutRolesBody;
}
export interface DeleteRolesRequest {
  path: DeleteRolesPath;
  query?: DeleteRolesQuery;
  header?: DeleteRolesHeader;
  cookie?: Record<string, never>;
  body?: never;
}
export interface PostRoleLinksRequest {
  path: PostRoleLinksPath;
  query?: Record<string, never>;
  header?: PostRoleLinksHeader;
  cookie?: Record<string, never>;
  body?: PostRoleLinksBody;
}
export interface DeleteRoleLinksRequest {
  path: DeleteRoleLinksPath;
  query?: DeleteRoleLinksQuery;
  header?: DeleteRoleLinksHeader;
  cookie?: Record<string, never>;
  body?: never;
}
export interface PostRoleSetsRequest {
  path: Record<string, never>;
  query?: Record<string, never>;
  header?: PostRoleSetsHeader;
  cookie?: Record<string, never>;
  body?: PostRoleSetsBody;
}
export interface GetFindRoleSetsRequest {
  path: Record<string, never>;
  query?: GetFindRoleSetsQuery;
  header?: GetFindRoleSetsHeader;
  cookie?: Record<string, never>;
  body?: never;
}
export interface GetRoleSetsRequest {
  path: GetRoleSetsPath;
  query?: Record<string, never>;
  header?: GetRoleSetsHeader;
  cookie?: Record<string, never>;
  body?: never;
}
export interface PutRoleSetsRequest {
  path: PutRoleSetsPath;
  query?: Record<string, never>;
  header?: PutRoleSetsHeader;
  cookie?: Record<string, never>;
  body?: PutRoleSetsBody;
}
export interface DeleteRoleLinksRequest {
  path: DeleteRoleLinksPath;
  query?: Record<string, never>;
  header?: DeleteRoleLinksHeader;
  cookie?: Record<string, never>;
  body?: never;
}
export interface PostAgreementsRequest {
  path: Record<string, never>;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: PostAgreementsBody;
}
export interface GetAgreementsListRequest {
  path: Record<string, never>;
  query?: GetAgreementsListQuery;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface GetAgreementsAgreementidRequest {
  path: GetAgreementsAgreementidPath;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface PutAgreementsAgreementidRequest {
  path: PutAgreementsAgreementidPath;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: PutAgreementsAgreementidBody;
}
export interface DeleteAgreementsAgreementidRequest {
  path: DeleteAgreementsAgreementidPath;
  query?: DeleteAgreementsAgreementidQuery;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface PutAgreementsAgreementidCancelRequest {
  path: PutAgreementsAgreementidCancelPath;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: PutAgreementsAgreementidCancelBody;
}
export interface PostAgreementsAgreementidRenewRequest {
  path: PostAgreementsAgreementidRenewPath;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: PostAgreementsAgreementidRenewBody;
}
export interface PostAgreementsTypesRequest {
  path: Record<string, never>;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: PostAgreementsTypesBody;
}
export interface GetAgreementsTypesFindRequest {
  path: Record<string, never>;
  query?: GetAgreementsTypesFindQuery;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface GetAgreementsTypesAgreementtypeidRequest {
  path: GetAgreementsTypesAgreementtypeidPath;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface PutAgreementsTypesAgreementtypeidRequest {
  path: PutAgreementsTypesAgreementtypeidPath;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: PutAgreementsTypesAgreementtypeidBody;
}
export interface DeleteAgreementsTypesAgreementtypeidRequest {
  path: DeleteAgreementsTypesAgreementtypeidPath;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface PostListbusinesspartyusersRequest {
  path: Record<string, never>;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: PostListbusinesspartyusersBody;
}
export interface PostListBusinessPartnersRequest {
  path: Record<string, never>;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: PostListBusinessPartnersBody;
}
export interface GetObjectsByIdRequest {
  path: Record<string, never>;
  query?: Record<string, never>;
  header?: GetObjectsByIdHeader;
  cookie?: Record<string, never>;
  body?: GetObjectsByIdBody;
}
export interface GetObjectsByCodeRequest {
  path: Record<string, never>;
  query?: Record<string, never>;
  header?: GetObjectsByCodeHeader;
  cookie?: Record<string, never>;
  body?: GetObjectsByCodeBody;
}
export interface GetSecurityGroupRequest {
  path: Record<string, never>;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface PutSecurityGroupRequest {
  path: Record<string, never>;
  query?: Record<string, never>;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: PutSecurityGroupBody;
}
export interface DeleteSecurityGroupRequest {
  path: Record<string, never>;
  query?: DeleteSecurityGroupQuery;
  header?: Record<string, never>;
  cookie?: Record<string, never>;
  body?: never;
}
export interface PostSimpleAclRequest {
  path: Record<string, never>;
  query?: Record<string, never>;
  header?: PostSimpleAclHeader;
  cookie?: Record<string, never>;
  body?: PostSimpleAclBody;
}

// ---- Client ----
export interface ApiClientOptions { baseURL?: string; }
export class OpenApiClient {
  private axios: AxiosInstance;
  constructor(opts: ApiClientOptions = {}) {
    this.axios = axios.create({ baseURL: "http://localhost:3000/v1" });
    if (opts.baseURL) this.axios.defaults.baseURL = opts.baseURL;
  }
  async findByUnitSetCode(params: FindByUnitSetCodeRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<FindByUnitSetCodeResponse>> {
    const url = `/unit-sets`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'get',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<FindByUnitSetCodeResponse>(reqConfig);
  }
  async createUnitSet(params: CreateUnitSetRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<CreateUnitSetResponse>> {
    const url = `/unit-sets`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'post',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<CreateUnitSetResponse>(reqConfig);
  }
  async findByUnitId(params: FindByUnitIdRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<FindByUnitIdResponse>> {
    const url = `/unit-sets/{unitSetId}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'get',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<FindByUnitIdResponse>(reqConfig);
  }
  async editUnitSet(params: EditUnitSetRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<EditUnitSetResponse>> {
    const url = `/unit-sets/{unitSetId}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'put',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<EditUnitSetResponse>(reqConfig);
  }
  async deleteUnitSet(params: DeleteUnitSetRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<DeleteUnitSetResponse>> {
    const url = `/unit-sets/{unitSetId}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'delete',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<DeleteUnitSetResponse>(reqConfig);
  }
  async getUnitSetUnits(params: GetUnitSetUnitsRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<GetUnitSetUnitsResponse>> {
    const url = `/unit-sets/{unitSetId}/units`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'get',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<GetUnitSetUnitsResponse>(reqConfig);
  }
  async createUnit(params: CreateUnitRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<CreateUnitResponse>> {
    const url = `/units`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'post',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<CreateUnitResponse>(reqConfig);
  }
  async getUnit(params: GetUnitRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<GetUnitResponse>> {
    const url = `/units/{unitId}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'get',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<GetUnitResponse>(reqConfig);
  }
  async updateUnit(params: UpdateUnitRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<UpdateUnitResponse>> {
    const url = `/units/{unitId}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'put',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<UpdateUnitResponse>(reqConfig);
  }
  async getUnitLinks(params: GetUnitLinksRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<GetUnitLinksResponse>> {
    const url = `/units/{unitId}/links`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'get',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<GetUnitLinksResponse>(reqConfig);
  }
  async createUnitLink(params: CreateUnitLinkRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<CreateUnitLinkResponse>> {
    const url = `/units/{unitId}/links`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'post',
      url,
      params: params.query || {},
      data: params.body,
      headers,
    });
    return this.axios.request<CreateUnitLinkResponse>(reqConfig);
  }
  async updateLink(params: UpdateLinkRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<UpdateLinkResponse>> {
    const url = `/units/{unitId}/links/{linkId}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'put',
      url,
      params: params.query || {},
      data: params.body,
      headers,
    });
    return this.axios.request<UpdateLinkResponse>(reqConfig);
  }
  async deleteLink(params: DeleteLinkRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<DeleteLinkResponse>> {
    const url = `/units/{unitId}/links/{linkId}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'delete',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<DeleteLinkResponse>(reqConfig);
  }
  async getUpperUnitLinksList(params: GetUpperUnitLinksListRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<GetUpperUnitLinksListResponse>> {
    const url = `/units/{unitId}/upper-unit-links-list`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'get',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<GetUpperUnitLinksListResponse>(reqConfig);
  }
  async putRelink(params: PutRelinkRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<PutRelinkResponse>> {
    const url = `/units/{unitId}/relink`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'put',
      url,
      params: params.query || {},
      data: params.body,
      headers,
    });
    return this.axios.request<PutRelinkResponse>(reqConfig);
  }
  async putUnlink(params: PutUnlinkRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<PutUnlinkResponse>> {
    const url = `/units/{unitId}/links/{linkId}/unlink`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'put',
      url,
      params: params.query || {},
      data: params.body,
      headers,
    });
    return this.axios.request<PutUnlinkResponse>(reqConfig);
  }
  async getUnitUsers(params: GetUnitUsersRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<GetUnitUsersResponse>> {
    const url = `/units/{unitId}/users/list`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'get',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<GetUnitUsersResponse>(reqConfig);
  }
  async getUnitsFind(params: GetUnitsFindRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<GetUnitsFindResponse>> {
    const url = `/units/find`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'get',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<GetUnitsFindResponse>(reqConfig);
  }
  async putUnitAssignedUsers(params: PutUnitAssignedUsersRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<PutUnitAssignedUsersResponse>> {
    const url = `/unit-assigned-users/{unitAssignedUserId}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'put',
      url,
      params: params.query || {},
      data: params.body,
      headers,
    });
    return this.axios.request<PutUnitAssignedUsersResponse>(reqConfig);
  }
  async getUnitAssignedUsers(params: GetUnitAssignedUsersRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<GetUnitAssignedUsersResponse>> {
    const url = `/units/{unitId}/unit-assigned-users/list`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'get',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<GetUnitAssignedUsersResponse>(reqConfig);
  }
  async postUnitAssignedUsers(params: PostUnitAssignedUsersRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<PostUnitAssignedUsersResponse>> {
    const url = `/units/{unitId}/unit-assigned-users`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'post',
      url,
      params: params.query || {},
      data: params.body,
      headers,
    });
    return this.axios.request<PostUnitAssignedUsersResponse>(reqConfig);
  }
  async findAssginedRoles(params: FindAssginedRolesRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<FindAssginedRolesResponse>> {
    const url = `/units/{unitId}/roles/list`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'get',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<FindAssginedRolesResponse>(reqConfig);
  }
  async createUnitAssginedRoles(params: CreateUnitAssginedRolesRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<CreateUnitAssginedRolesResponse>> {
    const url = `/units/{unitId}/roles`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'post',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<CreateUnitAssginedRolesResponse>(reqConfig);
  }
  async getAssginedRole(params: GetAssginedRoleRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<GetAssginedRoleResponse>> {
    const url = `/units/{unitId}/roles/{id}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'get',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<GetAssginedRoleResponse>(reqConfig);
  }
  async updateAssginedRole(params: UpdateAssginedRoleRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<UpdateAssginedRoleResponse>> {
    const url = `/units/{unitId}/roles/{id}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'put',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<UpdateAssginedRoleResponse>(reqConfig);
  }
  async deleteAssginedRole(params: DeleteAssginedRoleRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<DeleteAssginedRoleResponse>> {
    const url = `/units/{unitId}/roles/{id}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'delete',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<DeleteAssginedRoleResponse>(reqConfig);
  }
  async findAssginableJobDuty(params: FindAssginableJobDutyRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<FindAssginableJobDutyResponse>> {
    const url = `/units/{unitId}/job-duties/find`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'get',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<FindAssginableJobDutyResponse>(reqConfig);
  }
  async createAssignableJobDuty(params: CreateAssignableJobDutyRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<CreateAssignableJobDutyResponse>> {
    const url = `/units/{unitId}/job-duties`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'post',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<CreateAssignableJobDutyResponse>(reqConfig);
  }
  async getAssignableJobDuty(params: GetAssignableJobDutyRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<GetAssignableJobDutyResponse>> {
    const url = `/units/{unitId}/job-duties/{id}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'get',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<GetAssignableJobDutyResponse>(reqConfig);
  }
  async updateAssignableJobDuty(params: UpdateAssignableJobDutyRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<UpdateAssignableJobDutyResponse>> {
    const url = `/units/{unitId}/job-duties/{id}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'put',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<UpdateAssignableJobDutyResponse>(reqConfig);
  }
  async delete__units__unitId__job_duties__id_(params: DeleteUnitsUnitidJobDutiesIdRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<DeleteUnitsUnitidJobDutiesIdResponse>> {
    const url = `/units/{unitId}/job-duties/{id}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'delete',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<DeleteUnitsUnitidJobDutiesIdResponse>(reqConfig);
  }
  async postUsers(params: PostUsersRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<PostUsersResponse>> {
    const url = `/users`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'post',
      url,
      params: params.query || {},
      data: params.body,
      headers,
    });
    return this.axios.request<PostUsersResponse>(reqConfig);
  }
  async getUsers(params: GetUsersRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<GetUsersResponse>> {
    const url = `/users/find`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'get',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<GetUsersResponse>(reqConfig);
  }
  async putUsers(params: PutUsersRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<PutUsersResponse>> {
    const url = `/users/{userId}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'put',
      url,
      params: params.query || {},
      data: params.body,
      headers,
    });
    return this.axios.request<PutUsersResponse>(reqConfig);
  }
  async get_users_job_duty_list(params: GetUsersJobDutyListRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<GetUsersJobDutyListResponse>> {
    const url = `/users/{userId}/job-duty-list`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'get',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<GetUsersJobDutyListResponse>(reqConfig);
  }
  async postRoles(params: PostRolesRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<PostRolesResponse>> {
    const url = `/roles`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'post',
      url,
      params: params.query || {},
      data: params.body,
      headers,
    });
    return this.axios.request<PostRolesResponse>(reqConfig);
  }
  async getRolesList(params: GetRolesListRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<GetRolesListResponse>> {
    const url = `/roles/list`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'get',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<GetRolesListResponse>(reqConfig);
  }
  async getRoles(params: GetRolesRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<GetRolesResponse>> {
    const url = `/roles/{roleCode}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'get',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<GetRolesResponse>(reqConfig);
  }
  async putRoles(params: PutRolesRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<PutRolesResponse>> {
    const url = `/roles/{roleCode}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'put',
      url,
      params: params.query || {},
      data: params.body,
      headers,
    });
    return this.axios.request<PutRolesResponse>(reqConfig);
  }
  async deleteRoles(params: DeleteRolesRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<DeleteRolesResponse>> {
    const url = `/roles/{roleCode}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'delete',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<DeleteRolesResponse>(reqConfig);
  }
  async postRoleLinks(params: PostRoleLinksRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<PostRoleLinksResponse>> {
    const url = `/{roleCode}/link/{lowerRoleCode}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'post',
      url,
      params: params.query || {},
      data: params.body,
      headers,
    });
    return this.axios.request<PostRoleLinksResponse>(reqConfig);
  }
  async deleteRoleLinks(params: DeleteRoleLinksRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<DeleteRoleLinksResponse>> {
    const url = `/{roleCode}/unlink/{lowerRoleCode}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'post',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<DeleteRoleLinksResponse>(reqConfig);
  }
  async postRoleSets(params: PostRoleSetsRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<PostRoleSetsResponse>> {
    const url = `/role-sets`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'post',
      url,
      params: params.query || {},
      data: params.body,
      headers,
    });
    return this.axios.request<PostRoleSetsResponse>(reqConfig);
  }
  async getFindRoleSets(params: GetFindRoleSetsRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<GetFindRoleSetsResponse>> {
    const url = `/role-sets/list`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'get',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<GetFindRoleSetsResponse>(reqConfig);
  }
  async getRoleSets(params: GetRoleSetsRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<GetRoleSetsResponse>> {
    const url = `/role-sets/{roleSetId}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'get',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<GetRoleSetsResponse>(reqConfig);
  }
  async putRoleSets(params: PutRoleSetsRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<PutRoleSetsResponse>> {
    const url = `/role-sets/{roleSetId}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'put',
      url,
      params: params.query || {},
      data: params.body,
      headers,
    });
    return this.axios.request<PutRoleSetsResponse>(reqConfig);
  }
  async deleteRoleLinks(params: DeleteRoleLinksRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<DeleteRoleLinksResponse>> {
    const url = `/role-sets/{roleSetId}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'delete',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<DeleteRoleLinksResponse>(reqConfig);
  }
  async post__agreements_(params: PostAgreementsRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<PostAgreementsResponse>> {
    const url = `/agreements/`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'post',
      url,
      params: params.query || {},
      data: params.body,
      headers,
    });
    return this.axios.request<PostAgreementsResponse>(reqConfig);
  }
  async get__agreements_list(params: GetAgreementsListRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<GetAgreementsListResponse>> {
    const url = `/agreements/list`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'get',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<GetAgreementsListResponse>(reqConfig);
  }
  async get__agreements__agreementId_(params: GetAgreementsAgreementidRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<GetAgreementsAgreementidResponse>> {
    const url = `/agreements/{agreementId}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'get',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<GetAgreementsAgreementidResponse>(reqConfig);
  }
  async put__agreements__agreementId_(params: PutAgreementsAgreementidRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<PutAgreementsAgreementidResponse>> {
    const url = `/agreements/{agreementId}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'put',
      url,
      params: params.query || {},
      data: params.body,
      headers,
    });
    return this.axios.request<PutAgreementsAgreementidResponse>(reqConfig);
  }
  async delete__agreements__agreementId_(params: DeleteAgreementsAgreementidRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<DeleteAgreementsAgreementidResponse>> {
    const url = `/agreements/{agreementId}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'delete',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<DeleteAgreementsAgreementidResponse>(reqConfig);
  }
  async put__agreements__agreementId__cancel(params: PutAgreementsAgreementidCancelRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<PutAgreementsAgreementidCancelResponse>> {
    const url = `/agreements/{agreementId}/cancel`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'put',
      url,
      params: params.query || {},
      data: params.body,
      headers,
    });
    return this.axios.request<PutAgreementsAgreementidCancelResponse>(reqConfig);
  }
  async post__agreements__agreementId__renew(params: PostAgreementsAgreementidRenewRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<PostAgreementsAgreementidRenewResponse>> {
    const url = `/agreements/{agreementId}/renew`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'post',
      url,
      params: params.query || {},
      data: params.body,
      headers,
    });
    return this.axios.request<PostAgreementsAgreementidRenewResponse>(reqConfig);
  }
  async post__agreements_types(params: PostAgreementsTypesRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<PostAgreementsTypesResponse>> {
    const url = `/agreements/types`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'post',
      url,
      params: params.query || {},
      data: params.body,
      headers,
    });
    return this.axios.request<PostAgreementsTypesResponse>(reqConfig);
  }
  async get__agreements_types_find(params: GetAgreementsTypesFindRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<GetAgreementsTypesFindResponse>> {
    const url = `/agreements/types/find`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'get',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<GetAgreementsTypesFindResponse>(reqConfig);
  }
  async get__agreements__types__agreementTypeId_(params: GetAgreementsTypesAgreementtypeidRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<GetAgreementsTypesAgreementtypeidResponse>> {
    const url = `/agreements//types/{agreementTypeId}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'get',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<GetAgreementsTypesAgreementtypeidResponse>(reqConfig);
  }
  async put__agreements__types__agreementTypeId_(params: PutAgreementsTypesAgreementtypeidRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<PutAgreementsTypesAgreementtypeidResponse>> {
    const url = `/agreements//types/{agreementTypeId}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'put',
      url,
      params: params.query || {},
      data: params.body,
      headers,
    });
    return this.axios.request<PutAgreementsTypesAgreementtypeidResponse>(reqConfig);
  }
  async delete__agreements__types__agreementTypeId_(params: DeleteAgreementsTypesAgreementtypeidRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<DeleteAgreementsTypesAgreementtypeidResponse>> {
    const url = `/agreements//types/{agreementTypeId}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'delete',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<DeleteAgreementsTypesAgreementtypeidResponse>(reqConfig);
  }
  async post__listBusinessPartyUsers(params: PostListbusinesspartyusersRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<PostListbusinesspartyusersResponse>> {
    const url = `/listBusinessPartyUsers`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'post',
      url,
      params: params.query || {},
      data: params.body,
      headers,
    });
    return this.axios.request<PostListbusinesspartyusersResponse>(reqConfig);
  }
  async post__list_business_partners(params: PostListBusinessPartnersRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<PostListBusinessPartnersResponse>> {
    const url = `/list-business-partners`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'post',
      url,
      params: params.query || {},
      data: params.body,
      headers,
    });
    return this.axios.request<PostListBusinessPartnersResponse>(reqConfig);
  }
  async getObjectsById(params: GetObjectsByIdRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<GetObjectsByIdResponse>> {
    const url = `/get-objects-by-id`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'post',
      url,
      params: params.query || {},
      data: params.body,
      headers,
    });
    return this.axios.request<GetObjectsByIdResponse>(reqConfig);
  }
  async getObjectsByCode(params: GetObjectsByCodeRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<GetObjectsByCodeResponse>> {
    const url = `/get-objects-by-code`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'post',
      url,
      params: params.query || {},
      data: params.body,
      headers,
    });
    return this.axios.request<GetObjectsByCodeResponse>(reqConfig);
  }
  async getSecurityGroup(params: GetSecurityGroupRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<GetSecurityGroupResponse>> {
    const url = `/security-groups/{securityGroupCode}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'get',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<GetSecurityGroupResponse>(reqConfig);
  }
  async putSecurityGroup(params: PutSecurityGroupRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<PutSecurityGroupResponse>> {
    const url = `/security-groups/{securityGroupCode}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'put',
      url,
      params: params.query || {},
      data: params.body,
      headers,
    });
    return this.axios.request<PutSecurityGroupResponse>(reqConfig);
  }
  async deleteSecurityGroup(params: DeleteSecurityGroupRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<DeleteSecurityGroupResponse>> {
    const url = `/security-groups/{securityGroupCode}`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'delete',
      url,
      params: params.query || {},
      headers,
    });
    return this.axios.request<DeleteSecurityGroupResponse>(reqConfig);
  }
  async postSimpleAcl(params: PostSimpleAclRequest, config: import('axios').AxiosRequestConfig = {}): Promise<import('axios').AxiosResponse<PostSimpleAclResponse>> {
    const url = `/validations/simple-acl`;
    const headers = Object.assign({}, params.header || {}, config.headers || {});
    const reqConfig: import('axios').AxiosRequestConfig = Object.assign({}, config, {
      method: 'post',
      url,
      params: params.query || {},
      data: params.body,
      headers,
    });
    return this.axios.request<PostSimpleAclResponse>(reqConfig);
  }
}
