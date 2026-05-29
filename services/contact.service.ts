import { apiFetch, ApiResponse } from './api';

export interface ContactMessage {
  id: number;
  nombre: string;
  correo: string;
  asunto: string;
  mensaje: string;
  leido: boolean;
  created_at: string;
}

export const contactService = {
  /**
   * Envía un mensaje de contacto a través del formulario
   */
  async sendContactMessage(
    nombre: string,
    correo: string,
    asunto: string,
    mensaje: string
  ): Promise<ApiResponse<ContactMessage>> {
    return apiFetch<ApiResponse<ContactMessage>>('/api/contact/index.php', {
      method: 'POST',
      body: JSON.stringify({ nombre, correo, asunto, mensaje }),
    });
  },

  /**
   * Obtiene la lista de mensajes de contacto (requiere Admin)
   */
  async getMessages(soloNoLeidos: boolean = false): Promise<ContactMessage[]> {
    const response = await apiFetch<ApiResponse<ContactMessage[]>>(
      `/api/contact/index.php?soloNoLeidos=${soloNoLeidos}`
    );
    return response.data || [];
  },

  /**
   * Marca un mensaje de contacto como leído (requiere Admin)
   */
  async markAsRead(id: number): Promise<ApiResponse<null>> {
    return apiFetch<ApiResponse<null>>('/api/contact/index.php', {
      method: 'PATCH',
      body: JSON.stringify({ id }),
    });
  },
};

