// Configuração do cliente Supabase
// O script da CDN expõe a variável global `supabase` com o método createClient.
// Renomeamos nossa instância para `supabaseClient` para não conflitar com o namespace.

const SUPABASE_URL = 'https://yokbozyqiejcroxfddbc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlva2JvenlxaWVqY3JveGZkZGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MDg1MDIsImV4cCI6MjA5NTQ4NDUwMn0.aHMSU_RPiEZrey9zinmf-qPtV6UFpngJdAC0I9lYsOM';

window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
    }
});
