import axios, { AxiosInstance } from 'axios';

export interface Solution {
  id: string;
  issue: string;
  processes: string[];
}

export interface Signature {
  id: string;
  process: string;
  signatory: string;
  timestamp?: Date;
}

export interface Verification {
  id: string;
  process: string;
  verifier: string;
  timestamp?: Date;
}

export interface IssueBranch {
  id: string;
  title: string;
  process: ProcessBranch | null;
}

export interface ProcessBranch {
  id: string;
  data: string;
  issue: IssueBranch | null;
}

export interface NewProcess {
  data: string;
}

export interface ProcessInputType {
  issue: string;
  text: string;
  timestamp?: Date;
}

export interface Process {
  id: string;
  issue?: string;
  owner?: string;
  data?: string;
  solution?: boolean;
  timestamp?: Date;
  assets?: string[];
  active?: boolean;
  signed?: boolean;
  verified?: boolean;
}

export interface Contact {
  id: string;
  email?: string | null;
  is_registered?: boolean;
  is_verified?: string | null;
}

export interface ContactsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Contact[];
}

export interface NewSolutionClone {
  issue: string;
  processes: Constraint[];
}

export interface NewIssue {
  process?: string | null;
  title: string;
  description: string;
  active?: boolean;
  deadline?: string | null;
  constraints?: Constraint[];
  assets?: string[];
}

export interface Constraint {
  key: string;
  value: string;
}

export interface ClonedIssueResponse {
  detail: string;
  cloned_issue_id: string;
}

export interface Issue {
  id: string;
  assets?: string[] | null;
  timestamp?: Date;
  title?: string;
  description?: string;
  active?: boolean;
  deadline?: string;
  constraints?: Constraint[] | null;
  process?: string | null;
  owner?: string;
  admin?: string[];
  members?: string[];
}

export interface ProcessesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Process[];
}

export interface IssuesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Issue[];
}

export class SolutionService {
  private client: AxiosInstance;

  constructor(baseURL: string, token: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async fetchContact(contactId: string): Promise<Contact | null> {
    try {
      const response = await this.client.get<Contact>(
        `solution/api/v1/contacts/${contactId}/`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching contact:', error);
      return null;
    }
  }

  async fetchContacts(page: number): Promise<ContactsResponse | null> {
    try {
      const response = await this.client.get<ContactsResponse>(
        `solution/api/v1/contacts/?page=${page}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return null;
    }
  }

  async blockContact(issueId: string, contactId: string): Promise<boolean> {
    try {
      await this.client.post(
        `solution/api/v1/issues/${issueId}/block/${contactId}/`
      );
      console.log('Contact blocked successfully');
      return true;
    } catch (error) {
      console.error('Error blocking contact:', error);
      return false;
    }
  }

  async addMember(issueId: string, contactId: string): Promise<void> {
    try {
      await this.client.post(
        `solution/api/v1/issues/${issueId}/member/${contactId}/`
      );
      console.log('Member added successfully');
    } catch (error) {
      console.error('Error adding member:', error);
    }
  }

  async setAdmin(issueId: string, contactId: string): Promise<void> {
    try {
      await this.client.post(
        `solution/api/v1/issues/${issueId}/admin/${contactId}/`
      );
      console.log('Administrator set successfully');
    } catch (error) {
      console.error('Error setting admin:', error);
    }
  }

  async listMembers(issueId: string): Promise<Contact[]> {
    try {
      const response = await this.client.get<Contact[]>(
        `/api/v1/issues/${issueId}/member/`
      );
      return response.data;
    } catch (error) {
      console.error('Error listing members:', error);
      return [];
    }
  }

  async addIssue(input: NewIssue): Promise<Issue | null> {
    try {
      const response = await this.client.post<Issue>(
        `/solution/api/v1/issues/`,
        input
      );
      const ret: Issue | null = response.data;
      console.log('Issue added successfully:', ret);
      return ret;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Failed to add issue:',
          error.response?.data || error.message
        );
      } else {
        console.error('Error adding issue:', error);
      }
      return null;
    }
  }

  async addMasterIssue(input: NewIssue): Promise<void> {
    try {
      const response = await this.client.post<Issue>(
        `/solution/api/v1/issues/`,
        input
      );
      const responseData: Issue = response.data;
      console.log('Master issue added successfully:', responseData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Failed to add master issue:',
          error.response?.data || error.message
        );
      } else {
        console.error('Error adding master issue:', error);
      }
    } finally {
      console.log('Done!');
    }
  }

  async fetchMasterIssues(page: number): Promise<IssuesResponse | null> {
    try {
      console.log('Actually Fetching Page:', page);
      const response = await this.client.get<IssuesResponse>(
        `solution/api/v1/issues/?page=${page}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching master issues:', error);
      return null;
    }
  }

  async fetchApplicationIssues(
    page: number,
    appId: string
  ): Promise<IssuesResponse | null> {
    try {
      const response = await this.client.get<IssuesResponse>(
        `solution/api/v1/processes/${appId}/issues/?page=${page}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching master issues:', error);
      return null;
    }
  }

  async cloneIssue(
    issue: Issue,
    destinationProcess: string
  ): Promise<ClonedIssueResponse | null> {
    try {
      const response = await this.client.post<ClonedIssueResponse>(
        `solution/api/v1/issues/${issue.id}/clone/`,
        { process_id: destinationProcess }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error cloning process:', error);
      return null;
    }
  }

  async fetchIssues(
    processId: string,
    page: number
  ): Promise<IssuesResponse | null> {
    try {
      const response = await this.client.get<IssuesResponse>(
        `solution/api/v1/processes/${processId}/issues/?page=${page}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching issues:', error);
      return null;
    }
  }

  async fetchMasterProcesses(page: number): Promise<ProcessesResponse | null> {
    try {
      const response = await this.client.get<ProcessesResponse>(
        `solution/api/v1/processes/?page=${page}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching master processes:', error);
      return null;
    }
  }

  async fetchSolution(solutionId: string): Promise<Solution | null> {
    try {
      const response = await this.client.get<Solution>(
        `solution/api/v1/solutions/${solutionId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching solution:', error);
      return null;
    }
  }

  async cloneSolution(
    solutionId: string,
    integrationType: string,
    issueID: string,
    processes: string[]
  ): Promise<Solution | null> {
    try {
      console.log(solutionId, integrationType, issueID, processes);
      const response = await this.client.post<Solution>(
        `solution/api/v1/solutions/${solutionId}/clone/?merge_type=${integrationType}`,
        {
          issue_id: issueID,
          process_ids: processes,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error cloning solution:', error);
      return null;
    }
  }

  reverseIssue = (issue: IssueBranch): IssueBranch => {
    if (!issue.process) {
      return issue;
    }

    const reversedProcess = this.reverseProcess(issue.process);

    return {
      id: issue.id,
      title: issue.title,
      process: reversedProcess,
    };
  };

  reverseProcess = (process: ProcessBranch): ProcessBranch => {
    if (!process.issue) {
      return process;
    }

    const reversedIssue = this.reverseIssue(process.issue);

    return {
      id: process.id,
      data: process.data,
      issue: reversedIssue,
    };
  };

  async fetchIssueTree(issueId: string): Promise<IssueBranch | null> {
    try {
      const response = await this.client.get<IssueBranch>(
        `solution/api/v1/issues/${issueId}/tree`
      );
      return this.reverseIssue(response.data);
    } catch (error) {
      console.error('Error fetching issue tree:', error);
      return null;
    }
  }

  async fetchIssueSolution(issueId: string): Promise<Solution | null> {
    try {
      const response = await this.client.get<Solution>(
        `solution/api/v1/issues/${issueId}/solution/`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching issue solution:', error);
      return null;
    }
  }

  async fetchIssue(issueId: string): Promise<Issue | null> {
    try {
      const response = await this.client.get<Issue>(
        `solution/api/v1/issues/${issueId}/`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching issue:', error);
      return null;
    }
  }

  async issueUpdateMembers(
    issue: Issue,
    memberIds: string[]
  ): Promise<Issue | null> {
    try {
      const payload: Issue = {
        ...issue,
        members: memberIds,
      };
      const response = await this.client.put<Issue>(
        `solution/api/v1/issues/${issue.id}/`,
        payload
      );
      console.log('Issue members updated successfully:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Failed to update issue members:',
          error.response?.data || error.message
        );
      } else {
        console.error('Error updating issue members:', error);
      }
      return null;
    }
  }

  async issueUpdateAdmins(
    issue: Issue,
    adminIds: string[]
  ): Promise<Issue | null> {
    try {
      const payload: Issue = {
        ...issue,
        admin: adminIds,
      };
      const response = await this.client.put<Issue>(
        `solution/api/v1/issues/${issue.id}/`,
        payload
      );
      console.log('Issue admins updated successfully:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Failed to update issue admins:',
          error.response?.data || error.message
        );
      } else {
        console.error('Error updating issue admins:', error);
      }
      return null;
    }
  }

  async solveIssue(
    issueId: string,
    processId: string
  ): Promise<Solution | null> {
    try {
      const response = await this.client.post<Solution>(
        `solution/api/v1/issues/${issueId}/solution/${processId}/`
      );
      return response.data;
    } catch (error) {
      console.error('Error solving issue:', error);
      return null;
    }
  }

  async signProcess(processId: string): Promise<Signature | null> {
    try {
      const response = await this.client.post<Signature>(
        `solution/api/v1/processes/${processId}/sign/`
      );
      return response.data;
    } catch (error) {
      console.error('Error signing process:', error);
      return null;
    }
  }

  async verifyProcess(processId: string): Promise<Verification | null> {
    try {
      const response = await this.client.post<Verification>(
        `solution/api/v1/processes/${processId}/verify/`
      );
      return response.data;
    } catch (error) {
      console.error('Error verifying process:', error);
      return null;
    }
  }

  async fetchProcesses(
    issueId: string,
    page: number
  ): Promise<ProcessesResponse | null> {
    try {
      const response = await this.client.get<ProcessesResponse>(
        `solution/api/v1/issues/${issueId}/processes/?page=${page}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching processes:', error);
      return null;
    }
  }

  async cloneProcess(
    processId: string,
    issueId: string
  ): Promise<Process | null> {
    try {
      const response = await this.client.post<Process>(
        `solution/api/v1/processes/${processId}/clone/`,
        { issue: issueId }
      );
      return response.data;
    } catch (error) {
      console.error('Error cloning process:', error);
      return null;
    }
  }

  async fetchProcess(processId: string): Promise<Process | null> {
    try {
      const response = await this.client.get<Process>(
        `solution/api/v1/processes/${processId}/`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching process:', error);
      return null;
    }
  }

  async updateProcess(
    process: Partial<Process> | null,
    onSent: (post: Process) => void
  ): Promise<void> {
    try {
      if (!process?.id) {
        console.error('Process or Process ID is missing');
        return;
      }

      const payload = process;
      const response = await this.client.put<Process>(
        `solution/api/v1/processes/${process.id}/`,
        payload
      );
      const responseData: Process = response.data;
      console.log('Process updated successfully:', responseData);
      onSent(responseData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Failed to update process:',
          error.response?.data || error.message
        );
      } else {
        console.error('Error updating process:', error);
      }
    } finally {
      console.log('Done!');
    }
  }

  async addProcess(
    issueId: string | null,
    input: string | null,
    assets: string[] | null,
    onSent: (post: Process) => void
  ): Promise<void> {
    try {
      const payload = { data: input, issue: issueId, assets };
      const response = await this.client.post<Process>(
        `solution/api/v1/processes/`,
        payload
      );
      const responseData: Process = response.data;
      console.log('Process added successfully:', responseData);
      onSent(responseData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Failed to add process:',
          error.response?.data || error.message
        );
      } else {
        console.error('Error adding process:', error);
      }
    } finally {
      console.log('Done!');
    }
  }

  async deleteProcess(processId: string): Promise<boolean> {
    try {
      await this.client.delete(`solution/api/v1/processes/${processId}/`);
      console.log('Process deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting process:', error);
      return false;
    }
  }
}
