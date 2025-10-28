import React, { useEffect, useState, useRef, useCallback } from 'react';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { Link } from '@mui/material';
import { IssueBranch, SolutionService } from '../services/SolutionsService';
import { authService } from '../utils/oidc';
import { User } from 'oidc-client-ts';
import FormattedTextDisplay from './FormattedTextDisplay';
import './IssueTreeComponent.css'; // Create a CSS file for styling

interface IssueTreeComponentProps {
  issueId: string | null;
}

const IssueTreeComponent: React.FC<IssueTreeComponentProps> = ({ issueId }) => {
  const [treeData, setTreeData] = useState<IssueBranch | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const solutionBackendRef = useRef<SolutionService | null>(null);

  const initializeBackendService = useCallback(async (): Promise<void> => {
    try {
      const authenticatedUser = await authService.getUser();
      setUser(authenticatedUser);
      if (authenticatedUser && !solutionBackendRef.current) {
        solutionBackendRef.current = new SolutionService(
          'https://mars.georgievski.net/',
          authenticatedUser.access_token
        );
      }
    } catch (error) {
      console.error('Error initializing backend service:', error);
    }
  }, []);

  useEffect(() => {
    authService
      .getUser()
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  }, []);

  useEffect(() => {
    if (!user) {
      console.log('ProcessMergeForm => No User: ', user);
      return;
    }
    if (!solutionBackendRef.current) {
      console.log('ProcessMergeForm => No Backend => Make New: ');
      solutionBackendRef.current = new SolutionService(
        'https://mars.georgievski.net/',
        user.access_token
      );
    }
  }, [user]);

  useEffect(() => {
    const fetchTreeData = async (): Promise<void> => {
      if (!solutionBackendRef.current) return;
      setLoading(true);

      try {
        if (!issueId) return;
        const result: IssueBranch | undefined | null =
          await solutionBackendRef.current.fetchIssueTree(issueId);
        if (!result) return;
        setTreeData(result);
      } catch (error) {
        console.error('Error fetching tree data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeBackendService()
      .then(() => {
        if (solutionBackendRef.current) {
          void fetchTreeData();
        }
      })
      .catch((error) => {
        console.error('Error initializing backend service:', error);
      });
  }, [initializeBackendService, issueId]);

  const renderTree = (issue: IssueBranch): React.ReactElement => (
    <TreeItem
      key={issue.id}
      itemId={issue.id}
      label={
        <Link href={`/issues/${issue.id}`} color="inherit">
          <FormattedTextDisplay
            htmlContent={((): string => {
              const text =
                new DOMParser().parseFromString(issue.title, 'text/html').body
                  .textContent ?? '';
              return text.length > 20 ? text.slice(0, 20) + '...' : text;
            })()}
          ></FormattedTextDisplay>
        </Link>
      }
    >
      {loading && 'loading'}
      {issue.process && (
        <TreeItem
          key={issue.process.id}
          itemId={issue.process.id}
          label={
            <Link href={`/processes/${issue.process.id}`} color="inherit">
              <FormattedTextDisplay
                htmlContent={((): string => {
                  const text =
                    new DOMParser().parseFromString(
                      issue.process.data,
                      'text/html'
                    ).body.textContent ?? '';
                  return text.length > 20 ? text.slice(0, 20) + '...' : text;
                })()}
              ></FormattedTextDisplay>
            </Link>
          }
        >
          {issue.process.issue && renderTree(issue.process.issue)}
        </TreeItem>
      )}
    </TreeItem>
  );

  return (
    <div className="tree-container">
      <SimpleTreeView>{treeData && renderTree(treeData)}</SimpleTreeView>
    </div>
  );
};

export default IssueTreeComponent;
