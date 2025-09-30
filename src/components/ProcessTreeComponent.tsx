import React from 'react';
import { TreeView, TreeItem } from '@mui/lab';
import { ExpandMore, ChevronRight } from '@mui/icons-material';

interface ProcessID {
  id: string;
  parent_issue?: IssueID;
}

interface IssueID {
  id: string;
  parent_process?: ProcessID;
}

interface ProcessTree {
  id: string;
  parent_issue?: IssueID;
}

interface ProcessTreeComponentProps {
  treeData: ProcessTree;
}

const ProcessTreeComponent: React.FC<ProcessTreeComponentProps> = ({
  treeData,
}): JSX.Element => {
  const renderTree = (process: ProcessID) => (
    <TreeItem
      key={process.id}
      nodeId={process.id}
      label={`Process ID: ${process.id}`}
    >
      {process.parent_issue && renderTree(process.parent_issue)}
    </TreeItem>
  );

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMore />}
      defaultExpandIcon={<ChevronRight />}
    >
      <TreeItem nodeId={treeData.id} label={`Process ID: ${treeData.id}`}>
        {treeData.parent_issue && renderTree(treeData.parent_issue)}
      </TreeItem>
    </TreeView>
  );
};

export default ProcessTreeComponent;
