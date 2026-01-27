'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  PersonOff as PersonOffIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { DashboardShell } from '@/components/layout/DashboardShell';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuthStore, User } from '@/lib/store/authStore';
import { apiClient } from '@/lib/api/client';

export default function UsersPage() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    is_superuser: false,
  });

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<User[]>('/api/v1/auth/users');
      setUsers(data);
    } catch (err: any) {
      setError(err.message || '사용자 목록을 불러올 수 없습니다');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Open dialog for creating user
  const handleCreate = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      full_name: '',
      is_superuser: false,
    });
    setDialogOpen(true);
  };

  // Open dialog for editing user
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      full_name: user.full_name || '',
      is_superuser: user.is_superuser,
    });
    setDialogOpen(true);
  };

  // Save user (create or update)
  const handleSave = async () => {
    try {
      if (editingUser) {
        // Update existing user
        await apiClient.put(`/api/v1/auth/users/${editingUser.id}`, {
          email: formData.email,
          full_name: formData.full_name,
          ...(formData.password ? { password: formData.password } : {}),
        });
      } else {
        // Create new user
        await apiClient.post('/api/v1/auth/users', formData, {
          params: { is_superuser: formData.is_superuser },
        });
      }

      setDialogOpen(false);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || '저장 실패');
    }
  };

  // Delete user
  const handleDelete = async (userId: number, username: string) => {
    if (!confirm(`정말로 "${username}" 사용자를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await apiClient.delete(`/api/v1/auth/users/${userId}`);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || '삭제 실패');
    }
  };

  // Toggle active status
  const handleToggleActive = async (userId: number) => {
    try {
      await apiClient.patch(`/api/v1/auth/users/${userId}/toggle-active`);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || '상태 변경 실패');
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <DashboardShell>
        <Box sx={{ width: '100%', maxWidth: '100%' }}>
          {/* Header */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  mb: 0.5,
                }}
              >
                사용자 관리
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: '"JetBrains Mono", monospace',
                  color: 'rgba(255,255,255,0.4)',
                  textTransform: 'uppercase',
                }}
              >
                User Management (Admin Only)
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
              sx={{
                bgcolor: '#00FF41',
                color: '#000',
                '&:hover': {
                  bgcolor: '#00CC35',
                },
              }}
            >
              사용자 추가
            </Button>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Users Table */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#00FF41' }} />
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              sx={{
                bgcolor: 'rgba(10,10,12,0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>ID</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>사용자명</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>이메일</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>이름</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>권한</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>상태</TableCell>
                    <TableCell align="right" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>작업</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow
                      key={user.id}
                      sx={{
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.02)',
                        },
                      }}
                    >
                      <TableCell sx={{ color: '#fff' }}>{user.id}</TableCell>
                      <TableCell sx={{ color: '#fff', fontFamily: '"JetBrains Mono", monospace' }}>
                        {user.username}
                        {user.id === currentUser?.id && (
                          <Chip label="나" size="small" sx={{ ml: 1, bgcolor: '#00FF41', color: '#000' }} />
                        )}
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>{user.email}</TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>{user.full_name || '-'}</TableCell>
                      <TableCell>
                        {user.is_superuser ? (
                          <Chip label="관리자" size="small" color="warning" />
                        ) : (
                          <Chip label="일반" size="small" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.is_active ? '활성' : '비활성'}
                          size="small"
                          color={user.is_active ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(user)}
                          sx={{ color: '#00FF41' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleActive(user.id)}
                          disabled={user.id === currentUser?.id}
                          sx={{ color: 'rgba(255,255,255,0.6)' }}
                        >
                          {user.is_active ? <PersonOffIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(user.id, user.username)}
                          disabled={user.id === currentUser?.id}
                          sx={{ color: '#FF4444' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Create/Edit Dialog */}
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                bgcolor: 'rgba(20,20,24,0.98)',
                border: '1px solid rgba(255,255,255,0.1)',
              },
            }}
          >
            <DialogTitle sx={{ color: '#fff' }}>
              {editingUser ? '사용자 수정' : '새 사용자 추가'}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="사용자명"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={!!editingUser}
                  fullWidth
                  required
                />
                <TextField
                  label="이메일"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  fullWidth
                  required
                />
                <TextField
                  label="이름"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="비밀번호"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  fullWidth
                  required={!editingUser}
                  helperText={editingUser ? '변경하지 않으려면 비워두세요' : '최소 8자'}
                />
                {!editingUser && (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.is_superuser}
                        onChange={(e) => setFormData({ ...formData, is_superuser: e.target.checked })}
                      />
                    }
                    label="관리자 권한"
                  />
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#00FF41', color: '#000' }}>
                저장
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </DashboardShell>
    </ProtectedRoute>
  );
}
