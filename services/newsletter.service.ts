import { apiFetch, ApiResponse } from './api';

export interface NewsletterSubscriber {
  id: number;
  correo: string;
  created_at: string;
}

export const newsletterService = {
  /**
   * Suscribe un correo al newsletter
   */
  async subscribeNewsletter(correo: string): Promise<ApiResponse<null>> {
    return apiFetch<ApiResponse<null>>('/api/newsletter/index.php', {
      method: 'POST',
      body: JSON.stringify({ correo }),
    });
  },

  /**
   * Obtiene la lista de suscriptores activos (requiere Admin)
   */
  async getSubscribers(): Promise<NewsletterSubscriber[]> {
    const response = await apiFetch<ApiResponse<NewsletterSubscriber[]>>(
      '/api/newsletter/index.php'
    );
    return response.data || [];
  },
};
