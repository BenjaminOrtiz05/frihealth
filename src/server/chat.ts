import { ChatMessage } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function processChat(messages: ChatMessage[]) {
  return {
    role: 'assistant',
    content: 'Mensaje de prueba del chatbot',
  };
}
