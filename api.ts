import { Article, Category, SiteSettings, ContactMessage, AuthResponse, AdminUser } from '../types';

const TOKEN_KEY = 'technova_admin_token';

export const authStorage = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
};

function getHeaders(isFormData = false): HeadersInit {
  const headers: Record<string, string> = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  const token = authStorage.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Network request failed' }));
    throw new Error(errorData.error || `HTTP error ${res.status}`);
  }
  return res.json();
}

export const publicApi = {
  getSettings: async (): Promise<SiteSettings> => {
    const res = await fetch('/api/public/settings');
    return handleResponse<SiteSettings>(res);
  },

  getCategories: async (): Promise<Category[]> => {
    const res = await fetch('/api/public/categories');
    return handleResponse<Category[]>(res);
  },

  getArticles: async (params?: {
    category?: string;
    tag?: string;
    search?: string;
    limit?: number;
    page?: number;
    featured?: boolean;
  }): Promise<{
    articles: Article[];
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
  }> => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.tag) query.append('tag', params.tag);
    if (params?.search) query.append('search', params.search);
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.page) query.append('page', params.page.toString());
    if (params?.featured) query.append('featured', 'true');

    const res = await fetch(`/api/public/articles?${query.toString()}`);
    return handleResponse(res);
  },

  getArticleBySlug: async (
    slug: string
  ): Promise<{ article: Article; related: Article[] }> => {
    const res = await fetch(`/api/public/articles/${encodeURIComponent(slug)}`);
    return handleResponse(res);
  },

  submitContact: async (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    mathAnswer: number;
    mathExpected: number;
  }): Promise<{ success: boolean; message: string; ticketId: string }> => {
    const res = await fetch('/api/public/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
};

export const adminApi = {
  login: async (usernameOrEmail: string, password: string): Promise<AuthResponse> => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail, password }),
    });
    const data = await handleResponse<AuthResponse>(res);
    authStorage.setToken(data.token);
    return data;
  },

  getMe: async (): Promise<AdminUser> => {
    const res = await fetch('/api/admin/me', {
      headers: getHeaders(),
    });
    return handleResponse<AdminUser>(res);
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const res = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  getStats: async () => {
    const res = await fetch('/api/admin/stats', {
      headers: getHeaders(),
    });
    return handleResponse<{
      total: number;
      published: number;
      drafts: number;
      scheduled: number;
      unreadMessages: number;
      totalMessages: number;
      totalViews: number;
      categoriesCount: number;
      recentScheduled: Article[];
    }>(res);
  },

  getArticles: async (params?: {
    status?: string;
    category?: string;
    search?: string;
  }): Promise<Article[]> => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`/api/admin/articles?${query.toString()}`, {
      headers: getHeaders(),
    });
    return handleResponse<Article[]>(res);
  },

  getArticle: async (id: string): Promise<Article> => {
    const res = await fetch(`/api/admin/articles/${encodeURIComponent(id)}`, {
      headers: getHeaders(),
    });
    return handleResponse<Article>(res);
  },

  createArticle: async (articleData: Partial<Article>): Promise<{ success: boolean; article: Article; message: string }> => {
    const res = await fetch('/api/admin/articles', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(articleData),
    });
    return handleResponse(res);
  },

  updateArticle: async (id: string, articleData: Partial<Article>): Promise<{ success: boolean; article: Article; message: string }> => {
    const res = await fetch(`/api/admin/articles/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(articleData),
    });
    return handleResponse(res);
  },

  deleteArticle: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`/api/admin/articles/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  uploadImage: async (fileData: string, fileName?: string): Promise<{ success: boolean; url: string; fileName: string }> => {
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ fileData, fileName }),
    });
    return handleResponse(res);
  },

  getSettings: async (): Promise<SiteSettings> => {
    const res = await fetch('/api/admin/settings', {
      headers: getHeaders(),
    });
    return handleResponse<SiteSettings>(res);
  },

  updateSettings: async (settings: Partial<SiteSettings>): Promise<{ success: boolean; message: string; settings: SiteSettings }> => {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(settings),
    });
    return handleResponse(res);
  },

  getMessages: async (): Promise<ContactMessage[]> => {
    const res = await fetch('/api/admin/messages', {
      headers: getHeaders(),
    });
    return handleResponse<ContactMessage[]>(res);
  },

  updateMessageStatus: async (id: string, status: 'unread' | 'read' | 'replied') => {
    const res = await fetch(`/api/admin/messages/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  deleteMessage: async (id: string) => {
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  restoreDatabase: async (data: any) => {
    const res = await fetch('/api/admin/restore', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
};
