// lib/auth-utils.ts - FIXED VERSION
import { createClient } from '@/lib/supabase/client';

export async function quickLogin(email: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: 'Password123!'
  });

  if (error) {
    throw new Error(error.message);
  }

  // Get user type and redirect
  const userType = data.user?.user_metadata?.user_type || 'tenant';
  const redirectPath = userType === 'tenant' ? '/consumer/dashboard' : `/${userType}/dashboard`;
  
  window.location.href = redirectPath;
  return data.user;
}

export async function manualLogin(email: string, password: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    return { success: false, error: error.message };
  }

  const userType = data.user?.user_metadata?.user_type || 'tenant';
  const redirectPath = userType === 'tenant' ? '/consumer/dashboard' : `/${userType}/dashboard`;

  return { 
    success: true, 
    user: data.user, 
    redirectPath 
  };
}

// SIMPLE DEV TOOLS INJECTION
export function injectDevAuthTool() {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return;

  const accounts = [
    { role: 'Tenant', email: 'tenant@keyat.co.bw', icon: '🏠' },
    { role: 'Landlord', email: 'landlord@keyat.co.bw', icon: '🏢' },
    { role: 'Agent', email: 'agent@keyat.co.bw', icon: '🤝' },
    { role: 'Service', email: 'service@keyat.co.bw', icon: '🔧' },
    { role: 'Admin', email: 'admin@keyat.co.bw', icon: '⚡' }
  ];

  const tool = document.createElement('div');
  tool.innerHTML = `
    <div style="position:fixed; top:10px; right:10px; background:#1e293b; color:white; padding:8px; border-radius:6px; font-size:12px; z-index:9999;">
      <div style="font-weight:bold; margin-bottom:4px; color:#60a5fa;">🔐 DEV</div>
      ${accounts.map(acc => `
        <button onclick="window.quickLogin('${acc.email}')" 
          style="display:block; width:100%; margin:2px 0; padding:4px; background:#334155; border:none; border-radius:4px; color:white; cursor:pointer; font-size:10px;">
          ${acc.icon} ${acc.role}
        </button>
      `).join('')}
    </div>
  `;

  document.body.appendChild(tool);
  (window as any).quickLogin = quickLogin;
}

export const authService = {
  quickLogin,
  manualLogin
};