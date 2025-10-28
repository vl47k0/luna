import React from "react";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { ExpandMore, ChevronRight } from "@mui/icons-material";

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
      itemId={process.id}
      label={`Process ID: ${process.id}`}
    >
      {process.parent_issue && renderTree(process.parent_issue)}
    </TreeItem>
  );

  return (
    <SimpleTreeView
      slots={{
        collapseIcon: ExpandMore,
        expandIcon: ChevronRight,
      }}
    >
      <TreeItem itemId={treeData.id} label={`Process ID: ${treeData.id}`}>
        {treeData.parent_issue && renderTree(treeData.parent_issue)}
      </TreeItem>
    </SimpleTreeView>
  );
};

export default ProcessTreeComponent;
