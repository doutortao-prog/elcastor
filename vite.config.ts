import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente. O cast (process as any) evita erros de linter.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Injeta a chave de API de forma segura para o build de produção
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});