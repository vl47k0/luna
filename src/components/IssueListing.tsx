import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Container,
  Fab,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Pagination,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowModesModel,
  GridRowModes,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  Issue,
  IssuesResponse,
  SolutionService,
} from "../services/SolutionsService";
import { User } from "oidc-client-ts";
import { authService } from "../utils/oidc";
import { IssueInputForm, IssueForm } from "./IssueInputForm";

const pageSize = 10;

const IssueListing: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const solutionBackendRef = useRef<SolutionService | null>(null);

  const fetchData = useCallback(async (page: number): Promise<void> => {
    console.log("fetchData called with page:", page); // Debug log
    if (!solutionBackendRef.current) return;
    setLoading(true);
    try {
      const data: IssuesResponse | undefined | null =
        await solutionBackendRef.current.fetchMasterIssues(page);
      console.log("Data fetched:", data); // Debug log
      if (!data) return;

      setIssues(data.results);
      setPageCount(Math.ceil(data.count / pageSize));
    } catch (error) {
      console.error("Failed to fetch issues:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    if (!solutionBackendRef.current) {
      solutionBackendRef.current = new SolutionService(
        import.meta.env.VITE_BACKEND_API_URL,
        user.access_token
      );
      console.log("SolutionService initialized"); // Debug log
      setPage(1);
    }
    return (): void => {
      if (solutionBackendRef.current) {
        solutionBackendRef.current = null;
      }
    };
  }, [user]);

  useEffect((): void => {
    void fetchData(page);
  }, [page, fetchData]);

  useEffect((): void => {
    void authService.getUser().then((data) => {
      console.log("User data:", data); // Debug log
      setUser(data);
    });
  }, []);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ): void => {
    setPage(value);
  };

  const handleSubmit = async (form: IssueForm): Promise<void> => {
    if (!solutionBackendRef.current) return;
    try {
      await solutionBackendRef.current.addMasterIssue({
        title: form.title,
        description: form.text,
        assets: form.filenames,
        constraints: form.constraints,
      });
      void fetchData(page);
      setOpenDialog(false);
    } catch (error) {
      console.error("Failed to create issue:", error);
    }
  };

  const submitHandler = (form: IssueForm): void => {
    handleSubmit(form).catch((error) => {
      console.error("Failed to create issue:", error);
    });
  };

  const handleDialogOpen = (): void => {
    setOpenDialog(true);
  };

  const handleDialogClose = (): void => {
    setOpenDialog(false);
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ): void => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => (): void => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => (): void => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => (): void => {
    setIssues(issues.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => (): void => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdate = (newRow: GridRowModel): GridRowModel => {
    const updatedRow: Issue = { ...(newRow as Issue) };
    setIssues(issues.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (
    newRowModesModel: GridRowModesModel
  ): void => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "title", headerName: "Title", width: 150, editable: true },
    {
      field: "description",
      headerName: "Description",
      width: 300,
      editable: true,
    },
    {
      field: "created_at",
      headerName: "Created At",
      width: 150,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key="save"
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key="cancel"
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Container>
      <Pagination
        count={pageCount}
        page={page}
        onChange={handlePageChange}
        color="primary"
      />
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={issues}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize } } }}
          pageSizeOptions={[pageSize]}
          loading={loading}
          pagination
          paginationMode="server"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
        />
      </div>
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={handleDialogOpen}
      >
        <AddIcon />
      </Fab>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogContent>
          <IssueInputForm onSubmit={submitHandler} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default IssueListing;
