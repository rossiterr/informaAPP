import { useEffect, useState } from "react";
import { 
  Typography, Button, Box, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Dialog, 
  DialogActions, DialogContent, DialogTitle, TextField,
  IconButton, Alert, CircularProgress, InputAdornment,
  MenuItem,
  Select,
  Chip
} from "@mui/material";
import { Add, Delete, Edit, Search } from "@mui/icons-material";
import { motion } from "framer-motion";
import axios from "axios";

interface Route {
  _id: string;
  path: string;
  component: string;
  requiredRole?: string[];
  pageId: string;
  __v: number;
}

// Definindo as opções disponíveis
const componentes = ["Dashboard Power BI", "Gestão de Grupos e Materiais", "Teste"];
const categorias = ["Paraty", "Copel"];


const RoutesEdit = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [open, setOpen] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Route>>({
    path: "/teste",
    component: "Teste",
    requiredRole: [],
    pageId: ""
  });

  const fetchRoutes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/routes");
      setRoutes(response.data);
    } catch (error) {
      console.error("Erro ao buscar as rotas:", error);
      setError("Erro ao carregar rotas");
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleEditClick = (route: Route) => {
    setSelectedRoute(route);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRoute(null);
    setError(null);
  };

  const handleOpenCreateModal = () => setOpenCreateModal(true);
  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
    setFormData({ path: "", component: "", requiredRole: [], pageId: "" });
    setError(null);
  };

  const handleCreateRoute = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://localhost:5000/routes", formData);
      setRoutes([...routes, response.data]);
      handleCloseCreateModal();
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Erro ao criar rota");
      } else {
        setError("Erro inesperado ao criar rota");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedRoute) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`http://localhost:5000/routes/${selectedRoute._id}`, selectedRoute);
      setRoutes(routes.map(route => 
        route._id === selectedRoute._id ? response.data : route
      ));
      handleClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Erro ao atualizar rota");
      } else {
        setError("Erro inesperado ao atualizar rota");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = (routeId: string) => {
    setRouteToDelete(routeId);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setRouteToDelete(null);
  };

  const handleDeleteRoute = async () => {
    if (!routeToDelete) return;

    setLoading(true);
    setError(null);
    try {
      await axios.delete(`http://localhost:5000/routes/${routeToDelete}`);
      setRoutes(routes.filter(route => route._id !== routeToDelete));
      handleCloseDeleteDialog();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Erro ao excluir rota");
      } else {
        setError("Erro inesperado ao excluir rota");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredRoutes = routes.filter(route =>
    route.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.component.toLowerCase().includes(searchQuery.toLowerCase())
  );

  

  return (
   
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'start',
      px: 2,
      ml: "80px",
      background: "#0A1C44",
      width: "calc(100vw - 110px)",
      height: "calc(100vh - 70px)",
      mt: "60px",
      pt: 3,
        gap: 2
      }}>
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: "bold", 
            color: "white", 
            mb: 2,
            fontSize:{ xs: "1.5rem", sm: "2rem", md: "2.5rem" } 
          }}>
            Lista de Módulos
          </Typography>
          <Typography variant="h6" sx={{ 
            color: "#fff", 
            mb: 4, 
            fontSize: { xs: "1rem", sm: "1rem", md: "1rem" },
            opacity: 0.7
          }}>
            Atualmente, você possui {routes.length} módulo(s) cadastrados.
          </Typography>
        </motion.div>
        {error && (
      <Alert severity="error" sx={{ mb: 2, width: "100%", maxWidth: "650px" }}>
        {error}
      </Alert>
    )}
        <Box
          component={Paper} 
          sx={{
            width: '100%',
            backgroundColor: '#1F2A4C',
            borderRadius: "8px",
            display: "flex",
            flexDirection: "row",
            mb: 2
          }}
        >
          <TextField
            placeholder="Buscar Módulo"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#fff' }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              flex: 1,
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />
          <Button 
            variant="contained" 
            onClick={handleOpenCreateModal} 
            sx={{ 
              flex: 0,
              backgroundColor: '#0A1C44',
              '&:hover': {
                backgroundColor: '#152347'
              }
            }}
          >
            <Add />
          </Button>
        </Box>

        <TableContainer 
        component={Paper} 
        sx={{ 
          backgroundColor: '#1F2A4C',
          '& .MuiTableCell-root': {
            color: '#fff'
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Módulo</TableCell>
              <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Classes</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRoutes.map((route) => (
              <TableRow key={route._id}>
                <TableCell>{route.path.slice(1, 2).toUpperCase() + route.path.slice(2)}</TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{route.component}</TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  {route.requiredRole ? route.requiredRole.join(", ") : "Nenhuma"}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEditClick(route)}><Edit /></IconButton>
                  <IconButton onClick={() => handleOpenDeleteDialog(route._id)} color="error"><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Criação */}
      <Dialog open={openCreateModal} onClose={handleCloseCreateModal}>
        <DialogTitle>Criar Novo Módulo</DialogTitle>
        <DialogContent>
          <TextField
            label="Caminho"
            fullWidth
            value={formData.path}
            onChange={(e) => setFormData({ ...formData, path: e.target.value })}
            sx={{ mb: 2, mt: 2 }}
          />
          <Select
            fullWidth
            value={formData.component}
            onChange={(e) => {
              const selectedComponent = e.target.value;
              setFormData({ 
                ...formData, 
                component: selectedComponent,
                pageId: selectedComponent === "Dashboard Power BI" ? (formData.pageId || "") : ""
              });
            }}
            sx={{ mb: 2 }}
          >
            {componentes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          {formData.component === "Dashboard Power BI" && (
            <TextField
              label="Page ID"
              fullWidth
              value={formData.pageId}
              onChange={(e) => setFormData({ ...formData, pageId: e.target.value })}
              sx={{ mb: 2 }}
            />
          )}
          <Select
            multiple
            fullWidth
            value={formData.requiredRole || []}
            onChange={(e) => {
              const value = e.target.value;
              setFormData({ 
                ...formData, 
                requiredRole: typeof value === 'string' ? value.split(',') : value 
              });
            }}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            sx={{ mb: 2 }}
          >
            {categorias.map((categoria) => (
              <MenuItem key={categoria} value={categoria}>
                {categoria}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateModal}>Cancelar</Button>
          <Button onClick={handleCreateRoute} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Criar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Módulo</DialogTitle>
        <DialogContent>
          {selectedRoute && (
            <>
              <TextField
                label="Caminho"
                fullWidth
                value={selectedRoute.path}
                onChange={(e) => setSelectedRoute({ ...selectedRoute, path: e.target.value })}
                sx={{ mb: 2, mt: 2 }}
              />
              <Select
                fullWidth
                value={selectedRoute.component}
                onChange={(e) => {
                  const selectedComponent = e.target.value;
                  setSelectedRoute({ 
                    ...selectedRoute, 
                    component: selectedComponent,
                    pageId: selectedComponent === "Dashboard Power BI" ? selectedRoute.pageId : ""
                  });
                }}
                sx={{ mb: 2 }}
              >
                {componentes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              {selectedRoute.component === "Dashboard Power BI" && (
                <TextField
                  label="Page ID"
                  fullWidth
                  value={selectedRoute.pageId}
                  onChange={(e) => setSelectedRoute({ ...selectedRoute, pageId: e.target.value })}
                  sx={{ mb: 2 }}
                />
              )}
              <Select
                multiple
                fullWidth
                value={selectedRoute.requiredRole || []}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedRoute({ 
                    ...selectedRoute, 
                    requiredRole: typeof value === 'string' ? value.split(',') : value 
                  });
                }}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                sx={{ mb: 2 }}
              >
                {categorias.map((categoria) => (
                  <MenuItem key={categoria} value={categoria}>
                    {categoria}
                  </MenuItem>
                ))}
              </Select>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Confirmação de Deleção */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza de que deseja excluir este módulo?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDeleteRoute} color="error" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Excluir"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoutesEdit;