import React, { useState, useEffect, useContext, createContext, useMemo } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  FormGroup,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
  createTheme,
  ThemeProvider,
  responsiveFontSizes,
  CssBaseline,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
  Card,
  CardContent,
  CardActions,
  Chip,
  Fab,
  useMediaQuery,
  Stack
} from '@mui/material';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, User, LogOut, FileText, ChevronRight, ChevronLeft, Check, Globe, Plus, ShoppingBag, Edit2, Save, X } from 'lucide-react';

// API BASE URL (From Environment Variable)
// API BASE URL
const API_URL = import.meta.env.DEV ? 'http://localhost:3001/api' : '/api';
console.log('Current API_URL:', API_URL);

// --- ERROR BOUNDARY ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, textAlign: 'center', color: 'white', bgcolor: '#333', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h5" gutterBottom>Something went wrong</Typography>
          <Typography variant="body2" color="error">{this.state.error?.toString()}</Typography>
          <Button onClick={() => window.location.reload()} sx={{ mt: 2, color: 'white', borderColor: 'white' }} variant="outlined">
            Reload Application
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

// --- TRANSLATIONS ---
const translations = {
  en: {
    appTitle: "NuLife", login: "Login", logout: "Logout", back: "Back", next: "Next",
    submit: "Submit", loading: "Loading...", success: "Success", error: "Error",
    saveChanges: "Save Changes", saving: "Saving...", newToNuLife: "New to NuLife?",
    firstAssessmentQuestion: "Is it your first assessment?", startAssessment: "Start Assessment",
    memberLogin: "Member Login", phoneLabel: "Phone Number", passwordLabel: "Password",
    loginButton: "Login", loginError: "Invalid phone number or password",
    stepPersonal: "Personal Info", stepHealth: "Health History", stepAssessment: "Assessment",
    stepDeclaration: "Declaration", stepAccount: "Account",
    nameEng: "Name (Eng)", nameChi: "Name (Chi)", dob: "Date of Birth", gender: "Gender",
    address: "Address", email: "Email", phone: "Phone", male: "M", female: "F",
    healthHistoryTitle: "Health History", pacemaker: "Pacemaker/Metal prosthesis?",
    longTermMeds: "Long-term medication?", cancer: "Cancer history?", pregnancy: "Pregnant/Breastfeeding?",
    yes: "Yes", no: "No", details: "Details", assessmentItemsTitle: "Assessment Items",
    hraFull: "HRA101 Full Assessment", consultation: "Professional Consultation",
    currentConcerns: "Current Concerns", disclaimerTitle: "Disclaimer",
    disclaimerText: "I understand that personal data provided will be used for membership processing...",
    voluntarilyParticipate: "I voluntarily participate", acceptDuration: "I accept the duration (3.5 hrs)",
    digitalSignature: "Digital Signature (Type Name)", accountSetupTitle: "Account Setup",
    usePhoneNote: "Use your phone number to login later.", createPassword: "Create Password",
    completeReg: "Complete Registration", regSuccess: "Registration Successful!",
    phoneExists: "Phone number already registered!", history: "History",
    account: "Account", profileSettings: "Profile Settings",
    assessmentHistory: "Assessment History",
    noAssessments: "No assessments found.", healthAssessment: "Health Assessment",
    reviewed: "Reviewed", pending: "Pending", contactInfo: "Contact Info",
    displayName: "Display Name", newPassword: "New Password", profileUpdated: "Profile updated successfully!",
    updateFailed: "Failed to update profile.", startNew: "Start New Assessment",
    orders: "Orders", noOrders: "No active orders found.",
    edit: "Edit", cancel: "Cancel"
  },
  zh: {
    appTitle: "NuLife", login: "登入", logout: "登出", back: "返回", next: "下一步",
    submit: "提交", loading: "載入中...", success: "成功", error: "錯誤",
    saveChanges: "儲存變更", saving: "儲存中...", newToNuLife: "NuLife 新用戶?",
    firstAssessmentQuestion: "這是您第一次評估嗎?", startAssessment: "開始評估",
    memberLogin: "會員登入", phoneLabel: "電話號碼", passwordLabel: "密碼",
    loginButton: "登入", loginError: "電話號碼或密碼錯誤",
    stepPersonal: "個人資料", stepHealth: "健康狀況", stepAssessment: "評估項目",
    stepDeclaration: "聲明", stepAccount: "帳戶設定",
    nameEng: "英文姓名", nameChi: "中文姓名", dob: "出生日期", gender: "性別",
    address: "地址", email: "電郵", phone: "電話", male: "男", female: "女",
    healthHistoryTitle: "健康狀況", pacemaker: "心臟起搏器/金屬假體?",
    longTermMeds: "長期服藥?", cancer: "癌症病史?", pregnancy: "懷孕/哺乳?",
    yes: "是", no: "否", details: "詳細說明", assessmentItemsTitle: "評估項目",
    hraFull: "HRA101 全面評估", consultation: "專業諮詢", currentConcerns: "目前關注的問題",
    disclaimerTitle: "免責聲明", disclaimerText: "本人明白所提供的個人資料將用於會員處理...",
    voluntarilyParticipate: "本人自願參與", acceptDuration: "本人接受時長 (3.5 小時)",
    digitalSignature: "電子簽名 (輸入姓名)", accountSetupTitle: "設定帳戶",
    usePhoneNote: "日後請使用電話號碼登入。", createPassword: "設定密碼",
    completeReg: "完成註冊", regSuccess: "註冊成功!", phoneExists: "電話號碼已被註冊!",
    history: "記錄", account: "帳戶", profileSettings: "個人設定",
    assessmentHistory: "評估記錄", noAssessments: "找不到評估記錄。",
    healthAssessment: "健康評估", reviewed: "已審閱", pending: "待審閱",
    contactInfo: "聯絡資料", editDetails: "編輯資料", displayName: "顯示名稱",
    newPassword: "新密碼", profileUpdated: "個人資料更新成功!", updateFailed: "更新失敗。", startNew: "開始新評估",
    orders: "訂單", noOrders: "找不到進行中的訂單。",
    edit: "編輯", cancel: "取消"
  }
};

const LanguageContext = createContext();
const useLanguage = () => useContext(LanguageContext);

// --- STYLES & THEME ---
let theme = createTheme({
  palette: {
    primary: { main: '#2563eb' },
    secondary: { main: '#3b82f6' },
    background: { default: '#f8fafc' },
    text: { primary: '#1e293b', secondary: '#64748b' }
  },
  typography: {
    fontFamily: '"Noto Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, padding: '10px 24px' }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          '& .MuiOutlinedInput-root': { borderRadius: 12 }
        }
      }
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '16px',
          paddingRight: '16px',
          '@media (min-width: 600px)': {
            paddingLeft: '24px',
            paddingRight: '24px',
          }
        }
      }
    }
  },
});

// Refined Responsive Font Sizes for Mobile
theme = createTheme(theme, {
  typography: {
    h4: {
      fontSize: '1.5rem', // Smaller on mobile
      [theme.breakpoints.up('sm')]: {
        fontSize: '2.125rem',
      },
    },
    h5: {
      fontSize: '1.25rem',
      [theme.breakpoints.up('sm')]: {
        fontSize: '1.5rem',
      },
    },
    h6: {
      fontSize: '1.1rem',
      [theme.breakpoints.up('sm')]: {
        fontSize: '1.25rem',
      },
    },
    subtitle1: {
      fontSize: '0.9rem',
      [theme.breakpoints.up('sm')]: {
        fontSize: '1rem',
      },
    },
    body1: {
      fontSize: '0.875rem',
      [theme.breakpoints.up('sm')]: {
        fontSize: '1rem',
      },
    }
  }
});

const glassStyle = {
  background: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
};

// --- LANGUAGE TOGGLE ---
const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <Button
      variant="contained" color="secondary" startIcon={<Globe size={16} />}
      onClick={() => setLanguage(prev => prev === 'en' ? 'zh' : 'en')}
      sx={{
        position: 'fixed',
        top: { xs: 10, md: 16 },
        right: { xs: 10, md: 16 },
        zIndex: 9999,
        borderRadius: 20,
        minWidth: { xs: 'auto', md: 100 },
        px: { xs: 2, md: 3 },
        fontSize: { xs: '0.75rem', md: '0.875rem' }
      }}
    >
      {language === 'en' ? '中文' : 'English'}
    </Button>
  );
};

import logoImage from './assets/Capture.PNG';

const Logo = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
    <img src={logoImage} alt="NuLife Logo" style={{ maxWidth: '150px', height: 'auto', marginBottom: '16px' }} />
  </Box>
);

// --- COMPONENT: LANDING PAGE ---
function LandingPage() {
  const { t } = useLanguage();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/dashboard');
      } else {
        setError(t.loginError);
      }
    } catch (err) {
      console.error(err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', p: { xs: 2, md: 4 } }}>
      <Paper elevation={0} sx={{ ...glassStyle, p: { xs: 3, md: 5 }, borderRadius: 4, width: '100%', maxWidth: 450 }}>
        <Logo />
        <Card variant="outlined" sx={{ mb: 4, bgcolor: 'rgba(255,255,255,0.6)', borderRadius: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{t.newToNuLife}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{t.firstAssessmentQuestion}</Typography>
            <Button variant="outlined" endIcon={<ChevronRight size={16} />} onClick={() => navigate('/assessment')} fullWidth>
              {t.startAssessment}
            </Button>
          </CardContent>
        </Card>
        <Divider sx={{ mb: 4 }}><Chip label={t.memberLogin} size="small" /></Divider>
        <Box component="form" onSubmit={handleLogin}>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          <TextField fullWidth label={t.phoneLabel} placeholder="+852 1234 5678" value={phone} onChange={(e) => setPhone(e.target.value)} margin="normal" required />
          <TextField fullWidth label={t.passwordLabel} type="password" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" required />
          <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ mt: 3, py: 1.5 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : t.loginButton}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

// --- COMPONENT: REGISTRATION FORM ---
function HealthRiskAssessmentForm() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [formData, setFormData] = useState({
    nameEng: '', nameChi: '', dob: '', gender: 'M', address: '', email: '', bloodType: '', phone: '', concerns: '',
    pacemaker: 'No', ecgDevice: 'No', longTermMedication: 'No', medicationDetails: '', cancer: 'No', cancerDetails: '',
    hormoneTherapy: 'No', hormoneDetails: '', immuneDisease: 'No', immuneDetails: '', pregnancy: 'No', organSurgery: 'No',
    organDetails: '', covidVaccine: 'No', agreeToTerms: false, agreeToTime: false, agreeToDataUse: false, optOutPromotions: false,
    password: '', hra101: false, consultation: false, signature: '',
    submissionDate: new Date().toISOString().split('T')[0],
    itemBMI: false, itemBodyComposition: false, itemBP: false, itemCardio: false, itemOxygen: false, itemExpiratory: false, itemComprehensive: false, itemRejuvenative: false
  });

  const steps = [t.stepPersonal, t.stepHealth, t.stepAssessment, t.stepDeclaration, t.stepAccount];
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };
  const handleNext = () => { activeStep === steps.length - 1 ? handleSubmit() : setActiveStep(prev => prev + 1); };
  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        setSnackbar({ open: true, message: t.regSuccess, severity: 'success' });
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setSnackbar({ open: true, message: data.error || t.error, severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: t.error, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: return (
        <Grid container spacing={2}>
          <Grid item xs={12}><Typography variant="h6" color="primary" gutterBottom>{t.stepPersonal}</Typography></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label={t.nameEng} name="nameEng" value={formData.nameEng} onChange={handleChange} required size="medium" /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label={t.nameChi} name="nameChi" value={formData.nameChi} onChange={handleChange} required size="medium" /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label={t.dob} name="dob" value={formData.dob} onChange={handleChange} required size="medium" placeholder="DD/MM/YYYY" /></Grid>
          <Grid item xs={12} sm={6}><FormLabel component="legend" sx={{ fontSize: '0.85rem', mb: 0.5 }}>{t.gender}</FormLabel><RadioGroup row name="gender" value={formData.gender} onChange={handleChange}><FormControlLabel value="M" control={<Radio size="small" />} label={t.male} /><FormControlLabel value="F" control={<Radio size="small" />} label={t.female} /></RadioGroup></Grid>
          <Grid item xs={12}><TextField fullWidth label={t.address} name="address" value={formData.address} onChange={handleChange} required size="medium" /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label={t.email} name="email" type="email" value={formData.email} onChange={handleChange} required size="medium" /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label={t.phone} name="phone" value={formData.phone} onChange={handleChange} required size="medium" /></Grid>
        </Grid>
      );
      case 1: return (
        <Box>
          <Typography variant="h6" color="primary" gutterBottom>{t.healthHistoryTitle}</Typography>
          {[{ name: 'pacemaker', label: t.pacemaker }, { name: 'longTermMedication', label: t.longTermMeds, detail: 'medicationDetails' }, { name: 'cancer', label: t.cancer, detail: 'cancerDetails' }, { name: 'pregnancy', label: t.pregnancy }].map((item) => (
            <Box key={item.name} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 3, bgcolor: 'rgba(255,255,255,0.5)' }}>
              <Typography variant="subtitle2" fontWeight="bold">{item.label}</Typography>
              <RadioGroup row name={item.name} value={formData[item.name]} onChange={handleChange}><FormControlLabel value="Yes" control={<Radio size="small" />} label={t.yes} /><FormControlLabel value="No" control={<Radio size="small" />} label={t.no} /></RadioGroup>
              {item.detail && formData[item.name] === 'Yes' && (<TextField fullWidth size="small" label={t.details} name={item.detail} value={formData[item.detail]} onChange={handleChange} sx={{ mt: 1 }} />)}
            </Box>
          ))}
        </Box>
      );
      case 2: return (
        <Box>
          <Typography variant="h6" color="primary" gutterBottom>{t.assessmentItemsTitle}</Typography>
          <FormGroup>
            <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 3 }}>
              <FormControlLabel control={<Checkbox name="hra101" checked={formData.hra101} onChange={handleChange} />} label={<Typography fontWeight="bold">{t.hraFull}</Typography>} />
              <Grid container spacing={1} sx={{ pl: 4, mt: 1 }}>{['itemBMI', 'itemBP', 'itemCardio', 'itemOxygen'].map(key => (<Grid item xs={12} sm={6} key={key}><FormControlLabel control={<Checkbox name={key} checked={formData[key]} onChange={handleChange} size="small" />} label={key.replace('item', '')} /></Grid>))}</Grid>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 3 }}>
              <FormControlLabel control={<Checkbox name="consultation" checked={formData.consultation} onChange={handleChange} />} label={t.consultation} />
            </Paper>
            <TextField fullWidth multiline rows={3} label={t.currentConcerns} name="concerns" value={formData.concerns} onChange={handleChange} sx={{ mt: 2 }} />
          </FormGroup>
        </Box>
      );
      case 3: return (
        <Box>
          <Typography variant="h6" color="primary" gutterBottom>{t.disclaimerTitle}</Typography>
          <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#fafafa', maxHeight: 200, overflow: 'auto', borderRadius: 3 }}><Typography variant="body2" color="text.secondary" style={{ lineHeight: 1.6 }}>{t.disclaimerText}</Typography></Paper>
          <FormGroup>
            <FormControlLabel control={<Checkbox name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} />} label={<Typography variant="body2">{t.voluntarilyParticipate}</Typography>} />
            <FormControlLabel control={<Checkbox name="agreeToDataUse" checked={formData.agreeToDataUse} onChange={handleChange} />} label={<Typography variant="body2">{t.acceptDuration}</Typography>} />
            <TextField fullWidth label={t.digitalSignature} name="signature" value={formData.signature} onChange={handleChange} required sx={{ mt: 2 }} />
          </FormGroup>
        </Box>
      );
      case 4: return (
        <Grid container spacing={2}>
          <Grid item xs={12}><Typography variant="h6" color="primary">{t.accountSetupTitle}</Typography></Grid>
          <Grid item xs={12}><Alert severity="info" sx={{ borderRadius: 2 }}>{t.usePhoneNote} ({formData.phone})</Alert></Grid>
          <Grid item xs={12}><TextField fullWidth label={t.createPassword} name="password" type="password" value={formData.password} onChange={handleChange} required /></Grid>
        </Grid>
      );
      default: return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      <Paper elevation={3} sx={{ ...glassStyle, p: { xs: 2, md: 5 }, borderRadius: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4, display: { xs: 'none', sm: 'flex' } }}>{steps.map((label) => (<Step key={label}><StepLabel>{label}</StepLabel></Step>))}</Stepper>
        <Box sx={{ display: { xs: 'block', sm: 'none' }, mb: 3, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Step {activeStep + 1} of {steps.length}</Typography>
          <Typography variant="h6" color="primary">{steps[activeStep]}</Typography>
        </Box>
        <AnimatePresence mode="wait"><motion.div key={activeStep} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3 }}>{renderStepContent(activeStep)}</motion.div></AnimatePresence>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button disabled={activeStep === 0} onClick={handleBack} startIcon={<ChevronLeft />}>{t.back}</Button>
          <Button variant="contained" onClick={handleNext} endIcon={activeStep === steps.length - 1 ? <Check /> : <ChevronRight />}>{activeStep === steps.length - 1 ? (loading ? t.saving : t.completeReg) : t.next}</Button>
        </Box>
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}><Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>{snackbar.message}</Alert></Snackbar>
    </Container>
  );
}

// --- COMPONENT: ORDERS (Empty as requested) ---
function Orders() {
  const { t } = useLanguage();
  return (
    <Paper elevation={0} sx={{ p: 0, bgcolor: 'transparent' }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>{t.orders}</Typography>
      <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary', ...glassStyle, borderRadius: 4 }}>
        {t.noOrders}
      </Paper>
    </Paper>
  );
}

// --- COMPONENT: HISTORY (Blank as requested) ---
function History() {
  const { t } = useLanguage();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    // Intentionally suppressed fetch to keep history blank as requested
    setLoading(false);
    setHistory([]);
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  return (
    <Paper elevation={0} sx={{ p: 0, bgcolor: 'transparent' }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>{t.assessmentHistory}</Typography>
      <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary', ...glassStyle, borderRadius: 4 }}>
        {t.noAssessments}
      </Paper>
    </Paper>
  );
}

// --- COMPONENT: ACCOUNT SETTINGS (Working Edit Button) ---
function Account() {
  const { t } = useLanguage();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [newName, setNewName] = useState(user.nameEng || '');
  const [newPassword, setNewPassword] = useState(user.password || '');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [isEditing, setIsEditing] = useState(false); // Toggle Edit Mode

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });
    try {
      const res = await fetch(`${API_URL}/update-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, nameEng: newName, password: newPassword })
      });
      if (res.ok) {
        const updatedUser = { ...user, nameEng: newName, password: newPassword };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setMsg({ type: 'success', text: t.profileUpdated });
        setIsEditing(false); // Exit edit mode on success
      } else {
        setMsg({ type: 'error', text: t.updateFailed });
      }
    } catch (err) { setMsg({ type: 'error', text: t.updateFailed }); } finally { setLoading(false); }
  };

  return (
    <Paper elevation={0} sx={{ p: 0, bgcolor: 'transparent' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">{t.profileSettings}</Typography>
        {!isEditing && (
          <Button variant="outlined" startIcon={<Edit2 size={16} />} onClick={() => setIsEditing(true)}>
            {t.edit}
          </Button>
        )}
      </Box>

      <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, ...glassStyle }}>
        {msg.text && <Alert severity={msg.type} sx={{ mb: 3, borderRadius: 2 }}>{msg.text}</Alert>}

        <Box component="form" onSubmit={handleUpdate}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label={t.phone} value={user.phone || ''} disabled variant="filled" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label={t.email} value={user.email || ''} disabled variant="filled" />
            </Grid>

            <Grid item xs={12}><Divider sx={{ my: 2 }}><Chip label={t.editDetails} /></Divider></Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t.displayName}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={!isEditing} // Controlled by state
                variant={isEditing ? "outlined" : "filled"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t.newPassword}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={!isEditing} // Controlled by state
                variant={isEditing ? "outlined" : "filled"}
              />
            </Grid>

            {isEditing && (
              <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="text" color="inherit" onClick={() => setIsEditing(false)} disabled={loading}>
                  {t.cancel}
                </Button>
                <Button type="submit" variant="contained" disabled={loading} startIcon={<Save size={16} />}>
                  {loading ? t.saving : t.saveChanges}
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>
    </Paper>
  );
}

function Dashboard() {
  const { t } = useLanguage();
  const [tab, setTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => { if (!user.phone) navigate('/'); }, [user, navigate]);
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => { localStorage.removeItem('user'); navigate('/'); };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', background: '#f1f5f9' }}>
      <AppBar position="sticky" color="default" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}><Heart fill="#2563eb" size={24} color="#2563eb" style={{ marginRight: 8 }} /><Typography variant="h6" fontWeight="bold" color="primary">{t.appTitle}</Typography></Box>
          <div>
            <IconButton onClick={handleMenu} size="small" sx={{ ml: 2 }}><Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: '1rem' }}>{user.nameEng ? user.nameEng[0] : 'U'}</Avatar></IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} PaperProps={{ elevation: 2, sx: { mt: 1, borderRadius: 2 } }} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
              <MenuItem onClick={() => { setTab(2); handleClose(); }}>{t.profileSettings}</MenuItem><Divider /><MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}><LogOut size={16} style={{ marginRight: 8 }} /> {t.logout}</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      {/* Centered Dashboard Container with Adjusted maxWidth for PC */}
      <Container maxWidth="md" sx={{ mt: 4, pb: 8, px: { xs: 2, md: 3 } }}>
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            centered
            variant="fullWidth"
            sx={{ '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' }, '& .MuiTab-root': { fontWeight: 600, minHeight: 60 } }}
          >
            <Tab icon={<ShoppingBag size={20} />} label={t.orders} iconPosition="start" />
            <Tab icon={<Activity size={20} />} label={t.history} iconPosition="start" />
            <Tab icon={<User size={20} />} label={t.account} iconPosition="start" />
          </Tabs>
        </Box>
        <AnimatePresence mode="wait"><motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>{tab === 0 && <Orders />}{tab === 1 && <History />}{tab === 2 && <Account />}</motion.div></AnimatePresence>
      </Container>
    </Box>
  );
}

export default function App() {
  const [language, setLanguage] = useState('en');
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LanguageToggle />
        <HashRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/assessment" element={<HealthRiskAssessmentForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<LandingPage />} />
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </LanguageContext.Provider>
  );
}