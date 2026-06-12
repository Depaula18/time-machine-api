import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "tab_search": "🔍 Rescue Link",
      "tab_history": "📚 My Rescues",
      "title": "⏳ Time Machine",
      "subtitle": "Looks like you're lost in spacetime. This link is dead.",
      "target_url": "Target URL:",
      "no_url": "No URL detected",
      "btn_search": "Search Historical Archives",
      "btn_searching": "Searching archives...",
      "ai_summary": "✨ AI Summary:",
      "btn_travel": "Time Travel & Access",
      "history_title": "Time Machine Records",
      "history_empty": "You haven't rescued any links yet.",
      "btn_access": "Access Archive"
    }
  },
  pt: {
    translation: {
      "tab_search": "🔍 Resgatar Link",
      "tab_history": "📚 Meus Resgates",
      "title": "⏳ Máquina do Tempo",
      "subtitle": "Parece que você se perdeu no espaço-tempo. Esse link está morto.",
      "target_url": "URL Alvo:",
      "no_url": "Nenhuma URL detectada",
      "btn_search": "Procurar nos Arquivos Históricos",
      "btn_searching": "Pesquisando nos arquivos...",
      "ai_summary": "✨ Resumo da IA:",
      "btn_travel": "Viajar no Tempo e Acessar",
      "history_title": "Registros da Máquina do Tempo",
      "history_empty": "Você ainda não resgatou nenhum link.",
      "btn_access": "Acessar Arquivo"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "pt",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;